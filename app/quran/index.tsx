import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ScrollToTopButton } from "../../components/common/ScrollToTopButton";
import { SurahListItem } from "../../components/quran/SurahListItem";
import { Colors } from "../../constants/Colors";
import { getSurahs, SurahSummary } from "../../lib/api/quran/getSurahs";

const ALL_TYPES = "All";

export default function QuranScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState(ALL_TYPES);
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const listRef = useRef<FlatList<SurahSummary>>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["surahs"],
    queryFn: getSurahs,
  });

  const types = useMemo(() => {
    if (!data) {
      return [ALL_TYPES];
    }

    const uniqueTypes = Array.from(new Set(data.map((surah) => surah.type))).sort();
    return [ALL_TYPES, ...uniqueTypes];
  }, [data]);

  const filteredSurahs = useMemo(() => {
    if (!data) {
      return [];
    }

    const normalizedSearch = searchText.trim().toLowerCase();
    const normalizedType = selectedType.toLowerCase();

    return data.filter((surah) => {
      const matchesTitle = normalizedSearch
        ? surah.title.toLowerCase().includes(normalizedSearch)
        : true;
      const matchesType =
        selectedType === ALL_TYPES ? true : surah.type.toLowerCase() === normalizedType;

      return matchesTitle && matchesType;
    });
  }, [data, searchText, selectedType]);

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
            onPress={() => setIsTypeMenuOpen((prev) => !prev)}
            style={({ pressed }) => [
              styles.dropdownTrigger,
              pressed && styles.dropdownTriggerPressed,
            ]}
          >
            <Text style={styles.dropdownTriggerText}>Type: {selectedType}</Text>
          </Pressable>
          {isTypeMenuOpen && (
            <View style={styles.dropdownMenu}>
              {types.map((type) => (
                <Pressable
                  key={type}
                  onPress={() => {
                    setSelectedType(type);
                    setIsTypeMenuOpen(false);
                  }}
                  style={({ pressed }) => [
                    styles.dropdownItem,
                    pressed && styles.dropdownItemPressed,
                    type === selectedType && styles.dropdownItemActive,
                  ]}
                >
                  <Text style={styles.dropdownItemText}>{type}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>

      {isLoading ? (
        <View style={styles.stateContainer}>
          <ActivityIndicator color={Colors.light.primary} />
          <Text style={styles.stateText}>Loading surahs...</Text>
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
          keyExtractor={(item) => item.index}
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
    fontSize: 24,
    fontWeight: "700",
    color: Colors.light.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: Colors.light.icon,
  },
  filtersRow: {
    marginTop: 16,
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    zIndex: 10,
  },
  searchInput: {
    flex: 1,
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    color: Colors.light.text,
  },
  dropdownWrapper: {
    width: 140,
    position: "relative",
  },
  dropdownTrigger: {
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    paddingHorizontal: 12,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  dropdownTriggerPressed: {
    opacity: 0.8,
  },
  dropdownTriggerText: {
    fontSize: 13,
    color: Colors.light.text,
  },
  dropdownMenu: {
    position: "absolute",
    top: 48,
    left: 0,
    right: 0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    zIndex: 20,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownItemPressed: {
    backgroundColor: "#F4F4F5",
  },
  dropdownItemActive: {
    backgroundColor: "#E8F5E2",
  },
  dropdownItemText: {
    fontSize: 13,
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
    fontSize: 14,
    color: Colors.light.icon,
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
