import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollToTopButton } from "../../components/common/ScrollToTopButton";
import { SkeletonLine } from "../../components/common/Skeleton";
import { AmbientBackground } from "../../components/glass/AmbientBackground";
import { GlassCard } from "../../components/glass/GlassCard";
import { GlassPill } from "../../components/glass/GlassPill";
import { BookCard } from "../../components/hadith/BookCard";
import { Fonts } from "../../constants/Fonts";
import { getHadithBooks, HadithBook } from "../../lib/api/hadith/getHadithBooks";

export default function HadithScreen() {
  const router = useRouter();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const listRef = useRef<FlatList<HadithBook>>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["hadithBooks"],
    queryFn: getHadithBooks,
  });

  const books = useMemo(() => data ?? [], [data]);

  const renderItem = useCallback(
    ({ item }: { item: HadithBook }) => (
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/hadith/[slug]",
            params: { slug: item.bookSlug },
          })
        }
      >
        <BookCard book={item} />
      </Pressable>
    ),
    [router]
  );

  return (
    <AmbientBackground>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Hadith Collections</Text>
            <Text style={styles.subtitle}>Authentic prophetic traditions.</Text>
          </View>
          <GlassPill
            label="Search"
            icon="search"
            variant="primary"
            size="md"
            onPress={() => router.push("/hadith/search")}
          />
        </View>

        {isLoading ? (
          <View style={styles.skeletonContainer}>
            {Array.from({ length: 6 }).map((_, index) => (
              <GlassCard key={`sk-${index}`} style={styles.skeletonCard}>
                <SkeletonLine style={{ width: "50%", height: 16 }} />
                <SkeletonLine style={{ width: "75%", height: 12, marginTop: 8 }} />
              </GlassCard>
            ))}
          </View>
        ) : error ? (
          <View style={styles.stateContainer}>
            <Text style={styles.stateText}>Could not load Hadith books.</Text>
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
            showsVerticalScrollIndicator={false}
            onScroll={({ nativeEvent }) =>
              setShowScrollTop(nativeEvent.contentOffset.y > 300)
            }
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
    </AmbientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: Fonts.size.mega,
    fontWeight: "700",
    color: "#F3F4F6",
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 2,
    fontSize: Fonts.size.sm,
    color: "#9CA3AF",
  },
  listContent: {
    paddingBottom: 110,
  },
  skeletonContainer: {
    gap: 10,
  },
  skeletonCard: {
    padding: 16,
  },
  stateContainer: {
    marginTop: 40,
    alignItems: "center",
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
