import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
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
import { SurahListItem } from "../../components/quran/SurahListItem";
import { Fonts } from "../../constants/Fonts";
import { getLanguages } from "../../lib/api/quranV2/getLanguages";
import { getSurahs } from "../../lib/api/quranV2/getSurahs";
import type { QuranLanguage, SurahSummary } from "../../lib/api/quranV2/types";
import { useLocalStorageString } from "../../lib/storage/useLocalStorageString";

export default function QuranScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
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
    if (!data?.surahs) return [];
    const normalizedSearch = searchText.trim().toLowerCase();
    return data.surahs.filter((surah) => {
      if (!normalizedSearch) return true;
      return (
        surah.transliteration.toLowerCase().includes(normalizedSearch) ||
        surah.translation.toLowerCase().includes(normalizedSearch) ||
        surah.name.toLowerCase().includes(normalizedSearch) ||
        surah.id.toString() === normalizedSearch
      );
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
    <AmbientBackground>
      <View style={styles.container}>

        <View style={styles.header}>
          <Text style={styles.title}>The Holy Quran</Text>
          <Text style={styles.subtitle}>Browse and recite all 114 Surahs.</Text>
        </View>


        <View style={styles.searchRow}>
          <View style={styles.searchInputWrap}>
            <Ionicons name="search" size={16} color="#9CA3AF" />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search by Surah name or number..."
              placeholderTextColor="#6B7280"
              style={styles.searchInput}
              autoCapitalize="none"
            />
            {searchText ? (
              <Pressable onPress={() => setSearchText("")}>
                <Ionicons name="close-circle" size={16} color="#9CA3AF" />
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


        {isLoading ? (
          <View style={styles.skeletonContainer}>
            {Array.from({ length: 7 }).map((_, index) => (
              <GlassCard key={`skeleton-${index}`} style={styles.skeletonCard}>
                <SkeletonLine style={{ width: "45%", height: 16 }} />
                <SkeletonLine style={{ width: "70%", height: 12, marginTop: 8 }} />
              </GlassCard>
            ))}
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Could not load Surahs.</Text>
            <Pressable onPress={() => refetch()} style={styles.retryButton}>
              <Text style={styles.retryText}>Try again</Text>
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
            showsVerticalScrollIndicator={false}
            onScroll={({ nativeEvent }) => {
              setShowScrollTop(nativeEvent.contentOffset.y > 300);
            }}
            scrollEventThrottle={16}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No Surahs found matching "{searchText}".</Text>
              </View>
            }
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
              <FlatList
                data={languages}
                keyExtractor={(item) => item.code}
                style={{ maxHeight: 380 }}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setSelectedLanguage(item.code);
                      setIsLanguageModalOpen(false);
                    }}
                    style={[
                      styles.languageItem,
                      item.code === selectedLanguage && styles.languageItemActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.languageName,
                        item.code === selectedLanguage && styles.languageNameActive,
                      ]}
                    >
                      {item.nativeName} ({item.code.toUpperCase()})
                    </Text>
                    {item.code === selectedLanguage ? (
                      <Ionicons name="checkmark-circle" size={18} color="#48A111" />
                    ) : null}
                  </Pressable>
                )}
              />
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
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: Fonts.size.mega,
    fontWeight: "700",
    color: "#F3F4F6",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: Fonts.size.sm,
    color: "#9CA3AF",
    marginTop: 2,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.09)",
  },
  searchInput: {
    flex: 1,
    color: "#F3F4F6",
    fontSize: Fonts.size.sm,
  },
  listContent: {
    paddingBottom: 110,
  },
  skeletonContainer: {
    gap: 10,
  },
  skeletonCard: {
    padding: 18,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 12,
  },
  errorText: {
    fontSize: Fonts.size.md,
    color: "#9CA3AF",
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(37, 103, 30, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(72, 161, 17, 0.4)",
  },
  retryText: {
    fontSize: Fonts.size.sm,
    fontWeight: "600",
    color: "#48A111",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: Fonts.size.sm,
    color: "#9CA3AF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "rgba(22, 28, 24, 0.95)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderTopColor: "rgba(255, 255, 255, 0.25)",
  },
  modalTitle: {
    fontSize: Fonts.size.lg,
    fontWeight: "700",
    color: "#F3F4F6",
    marginBottom: 14,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    marginBottom: 6,
  },
  languageItemActive: {
    backgroundColor: "rgba(37, 103, 30, 0.35)",
    borderColor: "rgba(72, 161, 17, 0.4)",
    borderWidth: 1,
  },
  languageName: {
    fontSize: Fonts.size.sm,
    color: "#D1D5DB",
    fontWeight: "500",
  },
  languageNameActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
