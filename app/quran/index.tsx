import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { ScrollToTopButton } from "../../components/common/ScrollToTopButton";
import { SkeletonLine } from "../../components/common/Skeleton";
import { SurahListItem } from "../../components/quran/SurahListItem";
import { Colors } from "../../constants/Colors";
import { Fonts } from "../../constants/Fonts";
import { Theme } from "../../constants/Theme";
import { getLanguages } from "../../lib/api/quranV2/getLanguages";
import { getSurahs } from "../../lib/api/quranV2/getSurahs";
import type { QuranLanguage, SurahSummary } from "../../lib/api/quranV2/types";
import { useLocalStorageString } from "../../lib/storage/useLocalStorageString";

export default function QuranScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const listRef = useRef<FlatList<SurahSummary>>(null);
  const [selectedLanguage, setSelectedLanguage] = useLocalStorageString(
    "quranLanguage",
    "en"
  );

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["surahs", selectedLanguage],
    queryFn: () => getSurahs(selectedLanguage),
  });

  const { data: languageData } = useQuery({
    queryKey: ["quranLanguages"],
    queryFn: getLanguages,
  });

  const languages = useMemo<QuranLanguage[]>(
    () => languageData?.languages ?? data?.available_languages ?? [],
    [data?.available_languages, languageData?.languages]
  );

  const currentLanguageLabel = useMemo(() => {
    const match = languages.find((language) => language.code === selectedLanguage);
    return match?.nativeName ?? selectedLanguage.toUpperCase();
  }, [languages, selectedLanguage]);

  const filteredSurahs = useMemo(() => {
    if (!data?.surahs) {
      return [];
    }

    const normalizedSearch = searchText.trim().toLowerCase();

    return data.surahs.filter((surah) => {
      const matchesTitle = normalizedSearch
        ? surah.transliteration.toLowerCase().includes(normalizedSearch) ||
          surah.translation.toLowerCase().includes(normalizedSearch) ||
          surah.name.toLowerCase().includes(normalizedSearch)
        : true;
      return matchesTitle;
    });
  }, [data, searchText]);

  const handlePressSurah = useCallback(
    (index: number) => {
      router.push({
        pathname: "/quran/[id]",
        params: { id: index.toString() },
      });
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item }: { item: SurahSummary }) => (
      <SurahListItem surah={item} onPress={handlePressSurah} />
    ),
    [handlePressSurah]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Surahs</Text>
      <Text style={styles.subtitle}>Explore the Quran chapter list.</Text>

      <View style={styles.filtersRow}>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search by title"
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

      {isLoading ? (
        <View style={styles.stateContainer}>
          <View style={styles.skeletonList}>
            {Array.from({ length: 8 }).map((_, index) => (
              <View key={`skeleton-${index}`} style={styles.skeletonRow}>
                <SkeletonLine style={styles.skeletonLine} />
                <SkeletonLine style={styles.skeletonLineShort} />
              </View>
            ))}
          </View>
        </View>
      ) : error ? (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>Could not load surahs.</Text>
          <Pressable onPress={() => refetch()} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={filteredSurahs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          onScroll={({ nativeEvent }) => {
            setShowScrollTop(nativeEvent.contentOffset.y > 300);
          }}
          scrollEventThrottle={16}
          ListEmptyComponent={
            <View style={styles.stateContainer}>
              <Text style={styles.stateText}>No surahs found.</Text>
            </View>
          }
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
    width: 140,
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
  listContent: {
    paddingVertical: 16,
    gap: 12,
    paddingBottom: 32,
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
    width: "80%",
    height: 12,
    borderRadius: 6,
  },
  skeletonLineShort: {
    width: "40%",
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
