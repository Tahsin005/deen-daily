import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScrollToTopButton } from "../../components/common/ScrollToTopButton";
import { BookCard } from "../../components/hadith/BookCard";
import { Colors } from "../../constants/Colors";
import { getHadithBooks, HadithBook } from "../../lib/api/hadith/getHadithBooks";

export default function HadithScreen() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const listRef = useRef<FlatList<HadithBook>>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["hadithBooks"],
    queryFn: getHadithBooks,
  });

  const books = useMemo(() => data ?? [], [data]);

  const renderItem = useCallback(({ item }: { item: HadithBook }) => <BookCard book={item} />, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hadith Books</Text>
      <Text style={styles.subtitle}>Discover collections of Hadith.</Text>

      {isLoading ? (
        <View style={styles.stateContainer}>
          <ActivityIndicator color={Colors.light.primary} />
          <Text style={styles.stateText}>Loading books...</Text>
        </View>
      ) : error ? (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>Could not load books.</Text>
          <Pressable onPress={() => refetch()} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={books}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onScroll={({ nativeEvent }) => setShowScrollTop(nativeEvent.contentOffset.y > 300)}
          scrollEventThrottle={16}
          ListEmptyComponent={
            <View style={styles.stateContainer}>
              <Text style={styles.stateText}>No books found.</Text>
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
