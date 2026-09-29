import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ScrollToTopButton } from "../../components/common/ScrollToTopButton";
import { SkeletonLine } from "../../components/common/Skeleton";
import { AmbientBackground } from "../../components/glass/AmbientBackground";
import { GlassCard } from "../../components/glass/GlassCard";
import { GlassPill } from "../../components/glass/GlassPill";
import { BackButton } from "../../components/quran/BackButton";
import { Fonts } from "../../constants/Fonts";
import { getLanguages } from "../../lib/api/quranV2/getLanguages";
import { searchQuran } from "../../lib/api/quranV2/searchQuran";
import type { QuranLanguage, QuranSearchResult } from "../../lib/api/quranV2/types";
import { useLocalStorageString } from "../../lib/storage/useLocalStorageString";

export default function QuranSearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const listRef = useRef<FlatList<QuranSearchResult>>(null);
  const [selectedLanguage, setSelectedLanguage] = useLocalStorageString(
    "quranLanguage",
    "en"
  );

  const trimmedQuery = query.trim();
  const searchEnabled = trimmedQuery.length >= 3;

  const { data: languageData } = useQuery({
    queryKey: ["quranLanguages"],
    queryFn: getLanguages,
  });

  const languages = useMemo<QuranLanguage[]>(
    () => languageData?.languages ?? [],
    [languageData?.languages]
  );

  const currentLanguageLabel = useMemo(() => {
    const match = languages.find((language) => language.code === selectedLanguage);
    return match?.nativeName ?? selectedLanguage.toUpperCase();
  }, [languages, selectedLanguage]);

  const {
    data: searchData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["quranSearch", trimmedQuery, selectedLanguage],
    queryFn: () => searchQuran(trimmedQuery, selectedLanguage),
    enabled: searchEnabled,
  });

  const results = useMemo(() => searchData?.results ?? [], [searchData?.results]);

  return (
    <AmbientBackground>
      <View style={styles.container}>
        <BackButton onPress={() => router.back()} label="Back to Quran" />

        <View style={styles.header}>
          <Text style={styles.title}>Search Quran</Text>
          <Text style={styles.subtitle}>
            Search verses by meaning or keywords across translations.
          </Text>
        </View>

        <View style={styles.filtersRow}>
          <View style={styles.searchInputWrap}>
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search for mercy, prayer, guidance..."
              placeholderTextColor="#6B7280"
              style={styles.searchInput}
              autoCapitalize="none"
            />
            {query ? (
              <Pressable onPress={() => setQuery("")}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </Pressable>
            ) : null}
          </View>

          <GlassPill
            label={currentLanguageLabel}
            icon="globe-outline"
            size="md"
            onPress={() => setIsLanguageModalOpen(true)}
          />
        </View>

        {!searchEnabled ? (
          <View style={styles.stateContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="search-outline" size={28} color="#86EFAC" />
            </View>
            <Text style={styles.stateTitle}>Type to Search</Text>
            <Text style={styles.stateSubtitle}>Enter at least 3 characters to begin</Text>
          </View>
        ) : isLoading ? (
          <View style={styles.skeletonList}>
            {Array.from({ length: 4 }).map((_, index) => (
              <GlassCard key={`skeleton-${index}`} style={styles.skeletonCard}>
                <SkeletonLine style={styles.skeletonLine} />
                <SkeletonLine style={styles.skeletonLineWide} />
              </GlassCard>
            ))}
          </View>
        ) : error ? (
          <View style={styles.stateContainer}>
            <Text style={styles.stateText}>Unable to load search results.</Text>
            <Pressable onPress={() => refetch()} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Try again</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={results}
            keyExtractor={(item) => `${item.surah.id}-${item.verses[0]?.id ?? "0"}`}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            onScroll={({ nativeEvent }) => {
              setShowScrollTop(nativeEvent.contentOffset.y > 300);
            }}
            scrollEventThrottle={16}
            ListEmptyComponent={
              <View style={styles.stateContainer}>
                <Text style={styles.stateTitle}>No Results Found</Text>
                <Text style={styles.stateSubtitle}>Try different keywords or check spelling</Text>
              </View>
            }
            renderItem={({ item }) => (
              <GlassCard style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <View>
                    <Text style={styles.resultTitle}>{item.surah.transliteration}</Text>
                    <Text style={styles.resultSubtitle}>{item.surah.translation}</Text>
                  </View>
                  <Pressable
                    style={styles.openButton}
                    onPress={() =>
                      router.push({
                        pathname: "/quran/[id]",
                        params: { id: item.surah.id.toString() },
                      })
                    }
                  >
                    <Text style={styles.openButtonText}>Open Surah</Text>
                    <Ionicons name="arrow-forward" size={14} color="#86EFAC" />
                  </Pressable>
                </View>

                <View style={styles.surahTagRow}>
                  <Text style={styles.arabicNameText}>{item.surah.name}</Text>
                </View>

                <View style={styles.verseList}>
                  {item.verses.slice(0, 2).map((verse) => (
                    <View key={verse.id} style={styles.verseRow}>
                      <View style={styles.verseNumberBadge}>
                        <Text style={styles.verseNumberText}>#{verse.id}</Text>
                      </View>
                      <View style={styles.verseTextWrap}>
                        <Text style={styles.verseArabic}>{verse.text}</Text>
                        <Text style={styles.verseTranslation}>{verse.translation}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </GlassCard>
            )}
          />
        )}

        <ScrollToTopButton
          visible={showScrollTop}
          onPress={() => listRef.current?.scrollToOffset({ offset: 0, animated: true })}
        />

        <Modal
          visible={isLanguageModalOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsLanguageModalOpen(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setIsLanguageModalOpen(false)}
          >
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Select Quran Translation</Text>
              {languages.map((lang) => (
                <Pressable
                  key={lang.code}
                  onPress={() => {
                    setSelectedLanguage(lang.code);
                    setIsLanguageModalOpen(false);
                  }}
                  style={[
                    styles.languageOption,
                    selectedLanguage === lang.code && styles.languageOptionActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.languageOptionText,
                      selectedLanguage === lang.code && styles.languageOptionTextActive,
                    ]}
                  >
                    {lang.nativeName} ({lang.code.toUpperCase()})
                  </Text>
                  {selectedLanguage === lang.code ? (
                    <Ionicons name="checkmark-circle" size={18} color="#86EFAC" />
                  ) : null}
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>
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
  header: {
    marginTop: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: Fonts.size.xxl,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: Fonts.size.sm,
    color: "#9CA3AF",
    marginTop: 2,
  },
  filtersRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 14,
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 14,
    paddingHorizontal: 12,
    gap: 8,
    minHeight: 44,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: Fonts.size.sm,
    paddingVertical: 8,
  },
  stateContainer: {
    marginTop: 48,
    alignItems: "center",
    gap: 8,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(72, 161, 17, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(72, 161, 17, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  stateTitle: {
    fontSize: Fonts.size.lg,
    fontWeight: "700",
    color: "#F3F4F6",
  },
  stateSubtitle: {
    fontSize: Fonts.size.sm,
    color: "#9CA3AF",
  },
  stateText: {
    fontSize: Fonts.size.text,
    color: "#9CA3AF",
    textAlign: "center",
  },
  skeletonList: {
    gap: 12,
    marginTop: 8,
  },
  skeletonCard: {
    padding: 16,
    gap: 10,
  },
  skeletonLine: {
    width: "60%",
    height: 14,
    borderRadius: 7,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  skeletonLineWide: {
    width: "90%",
    height: 14,
    borderRadius: 7,
    backgroundColor: "rgba(255, 255, 255, 0.07)",
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#25671E",
    marginTop: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 90,
    gap: 12,
  },
  resultCard: {
    padding: 16,
    gap: 10,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  resultTitle: {
    fontSize: Fonts.size.lg,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  resultSubtitle: {
    fontSize: Fonts.size.xs,
    color: "#9CA3AF",
    marginTop: 2,
  },
  openButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(72, 161, 17, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(72, 161, 17, 0.35)",
  },
  openButtonText: {
    fontSize: Fonts.size.xs,
    fontWeight: "600",
    color: "#86EFAC",
  },
  surahTagRow: {
    alignSelf: "flex-start",
  },
  arabicNameText: {
    fontSize: Fonts.size.md,
    color: "#FDE68A",
    fontWeight: "700",
  },
  verseList: {
    gap: 10,
    marginTop: 4,
  },
  verseRow: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  verseNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(242, 181, 11, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(242, 181, 11, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  verseNumberText: {
    fontSize: Fonts.size.xxs,
    fontWeight: "700",
    color: "#FDE68A",
  },
  verseTextWrap: {
    flex: 1,
    gap: 4,
  },
  verseArabic: {
    fontSize: Fonts.size.md,
    color: "#FFFFFF",
    textAlign: "right",
    lineHeight: 24,
  },
  verseTranslation: {
    fontSize: Fonts.size.xs,
    color: "#D1D5DB",
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: "#111812",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    gap: 8,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: Fonts.size.lg,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
  languageOptionActive: {
    backgroundColor: "rgba(72, 161, 17, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(72, 161, 17, 0.4)",
  },
  languageOptionText: {
    fontSize: Fonts.size.sm,
    color: "#D1D5DB",
  },
  languageOptionTextActive: {
    color: "#86EFAC",
    fontWeight: "700",
  },
});
