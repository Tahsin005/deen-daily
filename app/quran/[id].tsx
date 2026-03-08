import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useAudioPlayer, useAudioPlayerStatus, type AudioPlayer } from "expo-audio";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { ScrollToTopButton } from "../../components/common/ScrollToTopButton";
import { SkeletonLine } from "../../components/common/Skeleton";
import { BackButton } from "../../components/quran/BackButton";
import { VerseCard } from "../../components/quran/VerseCard";
import { Colors } from "../../constants/Colors";
import { Fonts } from "../../constants/Fonts";
import { Theme } from "../../constants/Theme";
import { getSurah } from "../../lib/api/quranV2/getSurah";
import { useLocalStorageString } from "../../lib/storage/useLocalStorageString";

export default function SurahDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ id?: string }>();
    const [showScrollTop, setShowScrollTop] = useState(false);
    const listRef = useRef<FlatList<{ id: number; text: string; translation: string }>>(null);
    const [selectedLanguage] = useLocalStorageString("quranLanguage", "en");
    const selectedIndex = useMemo(() => {
        const rawValue = Array.isArray(params.id) ? params.id[0] : params.id;
        const parsed = rawValue ? Number.parseInt(rawValue, 10) : NaN;
        return Number.isFinite(parsed) ? parsed : null;
    }, [params.id]);

    const {
        data: surahDetail,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["surahDetail", selectedIndex, selectedLanguage],
        queryFn: () => getSurah(selectedIndex ?? 0, selectedLanguage),
        enabled: selectedIndex !== null,
    });

    const orderedVerses = useMemo(() => surahDetail?.verses ?? [], [surahDetail]);
    const audioEntries = useMemo(
        () => Object.entries(surahDetail?.audio ?? {}),
        [surahDetail]
    );
    const preferredReciterKey = useMemo(() => {
        if (!audioEntries.length) {
            return null;
        }
        const target = "mishary rashid al-afasy";
        const matched = audioEntries.find(([, reciter]) =>
            reciter.reciter.toLowerCase().includes(target)
        );
        return matched?.[0] ?? audioEntries[0][0];
    }, [audioEntries]);

    const selectedReciter = useMemo(() => {
        if (!preferredReciterKey) {
            return null;
        }
        return audioEntries.find(([key]) => key === preferredReciterKey)?.[1] ?? null;
    }, [audioEntries, preferredReciterKey]);

    const audioSource = useMemo(
        () => (selectedReciter?.url ? { uri: selectedReciter.url } : undefined),
        [selectedReciter?.url]
    );
    const player = useAudioPlayer(audioSource) as unknown as {
        play: () => void;
        pause: () => void;
        stop?: () => void;
    };
    const status = useAudioPlayerStatus(player as unknown as AudioPlayer);
    const isPlaying = Boolean(status?.playing);

    useEffect(() => {
        player?.stop?.();
    }, [preferredReciterKey, player]);

    const handleTogglePlayback = () => {
        if (!selectedReciter?.url) {
            return;
        }

        if (isPlaying) {
            player.pause();
        } else {
            player.play();
        }
    };

    return (
        <View style={styles.container}>
            <BackButton onPress={() => router.back()} />

            {isLoading ? (
                <View style={styles.stateContainer}>
                    <View style={styles.skeletonList}>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <View key={`skeleton-${index}`} style={styles.skeletonRow}>
                                <SkeletonLine style={styles.skeletonLine} />
                                <SkeletonLine style={styles.skeletonLineWide} />
                            </View>
                        ))}
                    </View>
                </View>
            ) : error || selectedIndex === null ? (
                <View style={styles.stateContainer}>
                    <Text style={styles.stateText}>Could not load surah details.</Text>
                    <Pressable onPress={() => refetch()} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>Try again</Text>
                    </Pressable>
                </View>
            ) : surahDetail ? (
                <FlatList
                    ref={listRef}
                    data={orderedVerses}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    onScroll={({ nativeEvent }) => {
                        setShowScrollTop(nativeEvent.contentOffset.y > 300);
                    }}
                    scrollEventThrottle={16}
                    ListHeaderComponent={
                        <View style={styles.headerFrame}>
                            <Text style={styles.title}>{surahDetail.transliteration}</Text>
                            <Text style={styles.subtitle}>{surahDetail.translation}</Text>
                            <Text style={styles.subtitleAlt}>
                                {surahDetail.name} · {surahDetail.total_verses} verses
                            </Text>
                            {audioEntries.length ? (
                                <View style={styles.audioCard}>
                                    <View style={styles.audioTopRow}>
                                        <View style={styles.audioIconWrap}>
                                            <Ionicons
                                                name="musical-notes"
                                                size={22}
                                                color={Theme.colors.primary}
                                            />
                                        </View>
                                        <View style={styles.audioInfo}>
                                            <Text style={styles.audioTitle}>Recitation</Text>
                                            <Text style={styles.audioReciterName}>
                                                {selectedReciter?.reciter ?? "Recitation unavailable"}
                                            </Text>
                                        </View>
                                        <Pressable
                                            style={styles.audioControlButton}
                                            onPress={handleTogglePlayback}
                                        >
                                            <Ionicons
                                                name={isPlaying ? "pause" : "play"}
                                                size={18}
                                                color={Theme.colors.onPrimary}
                                            />
                                            <Text style={styles.audioControlText}>
                                                {isPlaying ? "Pause" : "Play"}
                                            </Text>
                                        </Pressable>
                                    </View>
                                    <View style={styles.audioMetaRow}>
                                        <Ionicons name="headset" size={14} color={Colors.light.icon} />
                                        <Text style={styles.audioMetaText}>
                                            High quality MP3 stream
                                        </Text>
                                    </View>
                                </View>
                            ) : null}
                        </View>
                    }
                    renderItem={({ item }) => (
                        <VerseCard
                            verseNumber={item.id.toString()}
                            arabicText={item.text}
                            translationText={item.translation}
                        />
                    )}
                />
            ) : null}

            <ScrollToTopButton
                visible={showScrollTop}
                onPress={() => listRef.current?.scrollToOffset({ offset: 0, animated: true })}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    headerFrame: {
        marginBottom: 18,
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.radius.lg,
        borderWidth: 1,
        borderColor: Theme.colors.borderLight,
        paddingVertical: 18,
        paddingHorizontal: 16,
        alignItems: "center",
        gap: 4,
    },
    title: {
        fontSize: Fonts.size.hero,
        fontWeight: "700",
        color: Colors.light.text,
        textAlign: "center",
    },
    subtitle: {
        marginTop: 4,
        fontSize: Fonts.size.md,
        color: Colors.light.icon,
        textAlign: "center",
    },
    subtitleAlt: {
        marginTop: 4,
        fontSize: Fonts.size.sm,
        color: Colors.light.icon,
        textAlign: "center",
    },
    audioCard: {
        marginTop: 12,
        width: "100%",
        borderRadius: Theme.radius.md,
        borderWidth: 1,
        borderColor: Theme.colors.borderLight,
        backgroundColor: Theme.colors.surfaceMuted,
        padding: 14,
        gap: 10,
    },
    audioTopRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    audioIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Theme.colors.surface,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: Theme.colors.border,
    },
    audioInfo: {
        flex: 1,
        gap: 2,
    },
    audioTitle: {
        fontSize: Fonts.size.md,
        fontWeight: "700",
        color: Colors.light.text,
    },
    audioReciterName: {
        fontSize: Fonts.size.sm,
        color: Colors.light.icon,
    },
    audioControlButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: Theme.radius.pill,
        backgroundColor: Theme.colors.primary,
    },
    audioControlText: {
        fontSize: Fonts.size.sm,
        fontWeight: "600",
        color: Theme.colors.onPrimary,
    },
    audioMetaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    audioMetaText: {
        fontSize: Fonts.size.xs,
        color: Colors.light.icon,
    },
    listContent: {
        paddingBottom: 32,
        paddingTop: 8,
        gap: 4,
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.radius.xl,
        borderWidth: 1,
        borderColor: Theme.colors.borderLight,
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    stateContainer: {
        marginTop: 32,
        alignItems: "center",
        gap: 10,
    },
    stateText: {
        fontSize: Fonts.size.text,
        color: Colors.light.icon,
    },
    skeletonList: {
        width: "100%",
        gap: 12,
    },
    skeletonRow: {
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.radius.md,
        borderWidth: 1,
        borderColor: Theme.colors.borderLight,
        padding: 12,
        gap: 8,
    },
    skeletonLine: {
        width: "70%",
        height: 12,
        borderRadius: 6,
    },
    skeletonLineWide: {
        width: "90%",
        height: 12,
        borderRadius: 6,
    },
    retryButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: Theme.radius.pill,
        backgroundColor: Theme.colors.primary,
    },
    retryButtonText: {
        color: Theme.colors.onPrimary,
        fontWeight: "600",
    },
});
