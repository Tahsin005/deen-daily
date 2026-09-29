import Ionicons from "@expo/vector-icons/Ionicons";
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
import { AmbientBackground } from "../../components/glass/AmbientBackground";
import { GlassCard } from "../../components/glass/GlassCard";
import { BackButton } from "../../components/quran/BackButton";
import { VerseCard } from "../../components/quran/VerseCard";
import { Fonts } from "../../constants/Fonts";
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
    if (!audioEntries.length) return null;
    const target = "mishary rashid al-afasy";
    const matched = audioEntries.find(([, reciter]) =>
      reciter.reciter.toLowerCase().includes(target)
    );
    return matched?.[0] ?? audioEntries[0][0];
  }, [audioEntries]);

  const selectedReciter = useMemo(() => {
    if (!preferredReciterKey) return null;
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
    if (!selectedReciter?.url) return;
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  return (
    <AmbientBackground>
      <View style={styles.container}>
        <BackButton onPress={() => router.back()} />

        {isLoading ? (
          <View style={styles.skeletonContainer}>
            <GlassCard style={{ padding: 20 }}>
              <SkeletonLine style={{ width: "50%", height: 20 }} />
              <SkeletonLine style={{ width: "80%", height: 14, marginTop: 10 }} />
            </GlassCard>
            {Array.from({ length: 4 }).map((_, index) => (
              <GlassCard key={`sk-${index}`} style={{ padding: 16, marginTop: 10 }}>
                <SkeletonLine style={{ width: "30%", height: 14 }} />
                <SkeletonLine style={{ width: "95%", height: 18, marginTop: 10 }} />
                <SkeletonLine style={{ width: "75%", height: 12, marginTop: 8 }} />
              </GlassCard>
            ))}
          </View>
        ) : error || selectedIndex === null ? (
          <View style={styles.stateContainer}>
            <Text style={styles.stateText}>Could not load Surah details.</Text>
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
            showsVerticalScrollIndicator={false}
            onScroll={({ nativeEvent }) => {
              setShowScrollTop(nativeEvent.contentOffset.y > 300);
            }}
            scrollEventThrottle={16}
            ListHeaderComponent={
              <View style={styles.headerWrap}>

                <GlassCard variant="elevated" style={styles.surahBanner}>
                  <View style={styles.bannerTop}>
                    <View>
                      <Text style={styles.surahTitle}>{surahDetail.transliteration}</Text>
                      <Text style={styles.surahSubtitle}>{surahDetail.translation}</Text>
                    </View>
                    <Text style={styles.surahArabicTitle}>{surahDetail.name}</Text>
                  </View>

                  <View style={styles.bannerMeta}>
                    <Text style={styles.metaBadge}>
                      Surah #{surahDetail.id} · {surahDetail.total_verses} Verses
                    </Text>
                  </View>


                  {selectedReciter?.url ? (
                    <View style={styles.audioPlayerCard}>
                      <View style={styles.audioLeft}>
                        <View style={[styles.audioIconBadge, isPlaying && styles.audioPlayingBadge]}>
                          <Ionicons
                            name={isPlaying ? "musical-notes" : "volume-medium"}
                            size={18}
                            color={isPlaying ? "#48A111" : "#9CA3AF"}
                          />
                        </View>
                        <View>
                          <Text style={styles.reciterLabel}>Recitation</Text>
                          <Text style={styles.reciterName}>{selectedReciter.reciter}</Text>
                        </View>
                      </View>

                      <Pressable
                        onPress={handleTogglePlayback}
                        style={[styles.playButton, isPlaying && styles.pauseButton]}
                      >
                        <Ionicons
                          name={isPlaying ? "pause" : "play"}
                          size={18}
                          color="#FFFFFF"
                        />
                        <Text style={styles.playText}>
                          {isPlaying ? "Pause" : "Play"}
                        </Text>
                      </Pressable>
                    </View>
                  ) : null}
                </GlassCard>


                {surahDetail.id !== 9 ? (
                  <GlassCard variant="muted" style={styles.bismillahCard}>
                    <Text style={styles.bismillahText}>
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </Text>
                  </GlassCard>
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
    </AmbientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerWrap: {
    marginBottom: 16,
  },
  surahBanner: {
    padding: 18,
  },
  bannerTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  surahTitle: {
    fontSize: Fonts.size.hero,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.4,
  },
  surahSubtitle: {
    fontSize: Fonts.size.sm,
    color: "#9CA3AF",
    marginTop: 2,
  },
  surahArabicTitle: {
    fontSize: Fonts.size.giant,
    fontWeight: "700",
    color: "#FDE68A",
  },
  bannerMeta: {
    marginTop: 10,
    marginBottom: 14,
  },
  metaBadge: {
    fontSize: Fonts.size.xs,
    color: "#48A111",
    fontWeight: "600",
  },
  audioPlayerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  audioLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  audioIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  audioPlayingBadge: {
    backgroundColor: "rgba(37, 103, 30, 0.4)",
    borderColor: "rgba(72, 161, 17, 0.4)",
    borderWidth: 1,
  },
  reciterLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 0.8,
  },
  reciterName: {
    fontSize: Fonts.size.xs,
    fontWeight: "600",
    color: "#F3F4F6",
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: "#25671E",
    borderWidth: 1,
    borderColor: "rgba(72, 161, 17, 0.5)",
  },
  pauseButton: {
    backgroundColor: "rgba(242, 181, 11, 0.3)",
    borderColor: "rgba(242, 181, 11, 0.6)",
  },
  playText: {
    fontSize: Fonts.size.xs,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  bismillahCard: {
    marginTop: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  bismillahText: {
    fontSize: Fonts.size.mega,
    color: "#FDE68A",
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 110,
  },
  skeletonContainer: {
    gap: 12,
  },
  stateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
    gap: 12,
  },
  stateText: {
    fontSize: Fonts.size.md,
    color: "#9CA3AF",
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(37, 103, 30, 0.4)",
  },
  retryButtonText: {
    fontSize: Fonts.size.sm,
    color: "#48A111",
    fontWeight: "600",
  },
});
