import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
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
import { getSurahDetail } from "../../lib/api/quran/getSurahDetail";
import { getSurahTranslation } from "../../lib/api/quran/getSurahTranslation";

export default function SurahDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ id?: string }>();
    const [showScrollTop, setShowScrollTop] = useState(false);
    const listRef = useRef<FlatList<{ key: string; value: string; translation?: string }>>(null);
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
        queryKey: ["surahDetail", selectedIndex],
        queryFn: () => getSurahDetail(selectedIndex ?? 0),
        enabled: selectedIndex !== null,
    });

    const {
        data: translationDetail,
        isLoading: isTranslationLoading,
        error: translationError,
    } = useQuery({
        queryKey: ["surahTranslation", selectedIndex],
        queryFn: () => getSurahTranslation(selectedIndex ?? 0),
        enabled: selectedIndex !== null,
    });

    const orderedVerses = useMemo(() => {
        if (!surahDetail) {
            return [];
        }

        return Object.entries(surahDetail.verse)
            .map(([key, value]) => ({
                key,
                value,
                translation: translationDetail?.verse[key],
                order: Number.parseInt(key.split("_")[1] ?? "0", 10),
            }))
            .sort((a, b) => a.order - b.order);
    }, [surahDetail, translationDetail]);

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
                    keyExtractor={(item) => item.key}
                    contentContainerStyle={styles.listContent}
                    onScroll={({ nativeEvent }) => {
                        setShowScrollTop(nativeEvent.contentOffset.y > 300);
                    }}
                    scrollEventThrottle={16}
                    ListHeaderComponent={
                        <View style={styles.headerFrame}>
                            <Text style={styles.title}>{surahDetail.name}</Text>
                            <Text style={styles.subtitle}>{surahDetail.count} verses</Text>
                            {isTranslationLoading ? (
                                <SkeletonLine style={styles.translationSkeleton} />
                            ) : translationError ? (
                                <Text style={styles.translationStatus}>Translation unavailable.</Text>
                            ) : null}
                        </View>
                    }
                    renderItem={({ item }) => (
                        <VerseCard
                            verseNumber={item.key.replace("verse_", "")}
                            arabicText={item.value}
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
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#F0F0F0",
        paddingVertical: 18,
        paddingHorizontal: 16,
        alignItems: "center",
        gap: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: Colors.light.text,
        textAlign: "center",
    },
    subtitle: {
        marginTop: 4,
        fontSize: 13,
        color: Colors.light.icon,
        textAlign: "center",
    },
    listContent: {
        paddingBottom: 32,
        paddingTop: 8,
        gap: 4,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#F0F0F0",
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    translationStatus: {
        marginTop: 6,
        fontSize: 12,
        color: Colors.light.icon,
        textAlign: "center",
    },
    translationSkeleton: {
        marginTop: 6,
        width: 140,
        height: 10,
        borderRadius: 5,
        alignSelf: "center",
    },
    stateContainer: {
        marginTop: 32,
        alignItems: "center",
        gap: 10,
    },
    stateText: {
        fontSize: 14,
        color: Colors.light.icon,
    },
    skeletonList: {
        width: "100%",
        gap: 12,
    },
    skeletonRow: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#F0F0F0",
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
        borderRadius: 999,
        backgroundColor: Colors.light.primary,
    },
    retryButtonText: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
});
