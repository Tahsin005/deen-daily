import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { ScrollToTopButton } from "../../components/common/ScrollToTopButton";
import { SkeletonLine } from "../../components/common/Skeleton";
import { BackButton } from "../../components/quran/BackButton";
import { Colors } from "../../constants/Colors";
import { Fonts } from "../../constants/Fonts";
import { Theme } from "../../constants/Theme";
import { getLanguages } from "../../lib/api/quranV2/getLanguages";
import { searchQuran } from "../../lib/api/quranV2/searchQuran";
import type { QuranLanguage, QuranSearchResult } from "../../lib/api/quranV2/types";
import { useLocalStorageString } from "../../lib/storage/useLocalStorageString";

export default function QuranSearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const listRef = useRef<FlatList<QuranSearchResult>>(null);
  const [selectedLanguage, setSelectedLanguage] = useLocalStorageString("quranLanguage", "en");

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
    <View style={styles.container}>
      <BackButton onPress={() => router.back()} label="Back to Quran" />
      <Text style={styles.title}>Search Quran</Text>
      <Text style={styles.subtitle}>Search by meaning or keyword (min 3 characters).</Text>

      <View style={styles.filtersRow}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search for mercy, prayer, guidance..."
          placeholderTextColor={Colors.light.icon}
          style={styles.searchInput}
          autoCapitalize="none"
        />

        <View style={styles.dropdownWrapper}>
          <Pressable
            onPress={() => setIsLanguageMenuOpen((prev) => !prev)}
            style={({ pressed }) => [
              styles.dropdownTrigger,
              pressed && styles.dropdownTriggerPressed,
            ]}
          >
            <Text style={styles.dropdownTriggerText}>{currentLanguageLabel}</Text>
          </Pressable>
          {isLanguageMenuOpen && languages.length > 0 ? (
            <View style={styles.dropdownMenu}>
              {languages.map((language) => (
                <Pressable
                  key={language.code}
                  onPress={() => {
                    setSelectedLanguage(language.code);
                    setIsLanguageMenuOpen(false);
                  }}
                  style={({ pressed }) => [
                    styles.dropdownItem,
                    pressed && styles.dropdownItemPressed,
                    language.code === selectedLanguage && styles.dropdownItemActive,
                  ]}
                >
                  <Text style={styles.dropdownItemText}>
                    {language.nativeName} ({language.code.toUpperCase()})
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>
      </View>

      {!searchEnabled ? (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>Start typing to search the Quran.</Text>
        </View>
      ) : isLoading ? (
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
      ) : error ? (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>Unable to search right now.</Text>
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
          onScroll={({ nativeEvent }) => {
            setShowScrollTop(nativeEvent.contentOffset.y > 300);
          }}
          scrollEventThrottle={16}
          ListEmptyComponent={
            <View style={styles.stateContainer}>
              <Text style={styles.stateText}>No results found.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.resultCard}>
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
                  <Text style={styles.openButtonText}>Open</Text>
                </Pressable>
              </View>
              <Text style={styles.resultMeta}>{item.surah.name}</Text>
              <View style={styles.verseList}>
                {item.verses.slice(0, 2).map((verse) => (
                  <View key={verse.id} style={styles.verseRow}>
                    <Text style={styles.verseNumber}>{verse.id}</Text>
                    <View style={styles.verseTextWrap}>
                      <Text style={styles.verseArabic}>{verse.text}</Text>
                      <Text style={styles.verseTranslation}>{verse.translation}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        />
      )}

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
  title: {
    fontSize: Fonts.size.mega,
    fontWeight: "700",
    color: Colors.light.text,
    marginTop: 8,
  },
  subtitle: {
    marginTop: 4,
    fontSize: Fonts.size.text,
    color: Colors.light.icon,
  },
  filtersRow: {
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "flex-start",
    zIndex: 10,
  },
  searchInput: {
    flex: 1,
    minHeight: 44,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    paddingHorizontal: 12,
    backgroundColor: Theme.colors.surface,
    color: Colors.light.text,
  },
  dropdownWrapper: {
    width: 160,
    position: "relative",
  },
  dropdownTrigger: {
    minHeight: 44,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    paddingHorizontal: 12,
    justifyContent: "center",
    backgroundColor: Theme.colors.surface,
  },
  dropdownTriggerPressed: {
    opacity: 0.8,
  },
  dropdownTriggerText: {
    fontSize: Fonts.size.md,
    color: Colors.light.text,
  },
  dropdownMenu: {
    position: "absolute",
    top: 48,
    left: 0,
    right: 0,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.surface,
    overflow: "hidden",
    zIndex: 20,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownItemPressed: {
    backgroundColor: Theme.colors.surfaceMuted,
  },
  dropdownItemActive: {
    backgroundColor: Theme.colors.surfaceSoft,
  },
  dropdownItemText: {
    fontSize: Fonts.size.md,
    color: Colors.light.text,
  },
  stateContainer: {
    marginTop: 32,
    alignItems: "center",
    gap: 10,
  },
  stateText: {
    fontSize: Fonts.size.text,
    color: Colors.light.icon,
    textAlign: "center",
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
  listContent: {
    paddingVertical: 16,
    gap: 12,
    paddingBottom: 32,
  },
  resultCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    padding: 16,
    gap: 10,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  resultTitle: {
    fontSize: Fonts.size.xl,
    fontWeight: "700",
    color: Colors.light.text,
  },
  resultSubtitle: {
    fontSize: Fonts.size.sm,
    color: Colors.light.icon,
    marginTop: 2,
  },
  resultMeta: {
    fontSize: Fonts.size.md,
    color: Colors.light.primary,
  },
  openButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Theme.radius.pill,
    backgroundColor: Theme.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  openButtonText: {
    fontSize: Fonts.size.sm,
    fontWeight: "600",
    color: Colors.light.primary,
  },
  verseList: {
    gap: 10,
  },
  verseRow: {
    flexDirection: "row",
    gap: 10,
  },
  verseNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Theme.colors.surfaceSoft,
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "700",
    color: Theme.colors.primary,
  },
  verseTextWrap: {
    flex: 1,
    gap: 4,
  },
  verseArabic: {
    fontSize: Fonts.size.xl,
    color: Colors.light.text,
    textAlign: "right",
  },
  verseTranslation: {
    fontSize: Fonts.size.text,
    color: Colors.light.icon,
  },
});
