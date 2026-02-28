import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { ScrollToTopButton } from "../../components/common/ScrollToTopButton";
import { SkeletonLine } from "../../components/common/Skeleton";
import { ChapterCard } from "../../components/hadith/ChapterCard";
import { BackButton } from "../../components/quran/BackButton";
import { Colors } from "../../constants/Colors";
import { Theme } from "../../constants/Theme";
import {
    getHadithChapters,
    HadithChapter,
} from "../../lib/api/hadith/getHadithChapters";

const PAGE_SIZE = 25;

export default function HadithChaptersScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ slug?: string }>();
    const [showScrollTop, setShowScrollTop] = useState(false);
    const listRef = useRef<FlatList<HadithChapter>>(null);

    const bookSlug = useMemo(() => {
        const raw = Array.isArray(params.slug) ? params.slug[0] : params.slug;
        return raw ?? "";
    }, [params.slug]);

    const {
        data,
        isLoading,
        error,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<
        Awaited<ReturnType<typeof getHadithChapters>>,
        Error,
        InfiniteData<Awaited<ReturnType<typeof getHadithChapters>>, number>,
        ["hadithChapters", string],
        number
    >({
        queryKey: ["hadithChapters", bookSlug],
            queryFn: ({ pageParam = 1 }) =>
        getHadithChapters({ bookSlug, page: pageParam, paginate: PAGE_SIZE }),
        enabled: Boolean(bookSlug),
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
        lastPage.current_page < lastPage.last_page ? lastPage.current_page + 1 : undefined,
    });

    const chapters = useMemo(
        () => data?.pages.flatMap((page: Awaited<ReturnType<typeof getHadithChapters>>) => page.data) ?? [],
        [data]
    );

  const renderItem = useCallback(
    ({ item }: { item: HadithChapter }) => (
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/hadith/[slug]/[chapter]",
            params: { slug: bookSlug, chapter: item.chapterNumber },
          })
        }
      >
        <ChapterCard chapter={item} />
      </Pressable>
    ),
    [bookSlug, router]
  );

  return (
    <View style={styles.container}>
      <BackButton onPress={() => router.back()} label="Back to Books" />
      <Text style={styles.title}>Chapters</Text>
      <Text style={styles.subtitle}>{bookSlug.replace(/-/g, " ")}</Text>
      <View style={{ height: 16 }} />

      {isLoading ? (
        <View style={styles.stateContainer}>
          <View style={styles.skeletonList}>
            {Array.from({ length: 6 }).map((_, index) => (
              <View key={`skeleton-${index}`} style={styles.skeletonRow}>
                <SkeletonLine style={styles.skeletonLine} />
                <SkeletonLine style={styles.skeletonLineShort} />
              </View>
            ))}
          </View>
        </View>
      ) : error ? (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>Could not load chapters.</Text>
          <Pressable onPress={() => refetch()} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={chapters}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onScroll={({ nativeEvent }) => setShowScrollTop(nativeEvent.contentOffset.y > 300)}
          scrollEventThrottle={16}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            isFetchingNextPage ? (
                <View style={styles.footerLoader}>
                    <SkeletonLine style={styles.footerSkeleton} />
                </View>
            ) : null
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
    textTransform: "capitalize",
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
    width: "50%",
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
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },
  footerSkeleton: {
    width: 120,
    height: 10,
    borderRadius: 5,
  },
});
