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
import { ScrollToTopButton } from "../../../components/common/ScrollToTopButton";
import { SkeletonLine } from "../../../components/common/Skeleton";
import { HadithCard } from "../../../components/hadith/HadithCard";
import { BackButton } from "../../../components/quran/BackButton";
import { Colors } from "../../../constants/Colors";
import { Theme } from "../../../constants/Theme";
import { getHadiths, HadithEntry } from "../../../lib/api/hadith/getHadiths";

const PAGE_SIZE = 25;

export default function HadithsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ slug?: string; chapter?: string }>();
    const [showScrollTop, setShowScrollTop] = useState(false);
    const listRef = useRef<FlatList<HadithEntry>>(null);

    const bookSlug = useMemo(() => {
        const raw = Array.isArray(params.slug) ? params.slug[0] : params.slug;
        return raw ?? "";
    }, [params.slug]);

    const chapter = useMemo(() => {
        const raw = Array.isArray(params.chapter) ? params.chapter[0] : params.chapter;
        return raw ?? "";
    }, [params.chapter]);

    const {
        data,
        isLoading,
        error,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<
        Awaited<ReturnType<typeof getHadiths>>,
        Error,
        InfiniteData<Awaited<ReturnType<typeof getHadiths>>, number>,
        ["hadiths", string, string],
        number
    >({
        queryKey: ["hadiths", bookSlug, chapter],
        queryFn: ({ pageParam = 1 }) =>
            getHadiths({ bookSlug, chapter, page: pageParam, paginate: PAGE_SIZE }),
        enabled: Boolean(bookSlug && chapter),
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
        lastPage.current_page < lastPage.last_page ? lastPage.current_page + 1 : undefined,
    });

    const hadiths = useMemo(
        () => data?.pages.flatMap((page: Awaited<ReturnType<typeof getHadiths>>) => page.data) ?? [],
        [data]
    );

  const renderItem = useCallback(({ item }: { item: HadithEntry }) => <HadithCard hadith={item} />, []);

    return (
        <View style={styles.container}>
            <BackButton onPress={() => router.back()} label="Back to Chapters" />
            <Text style={styles.title}>Hadiths</Text>
            <Text style={styles.subtitle}>Chapter {chapter}</Text>
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
                    <Text style={styles.stateText}>Could not load hadiths.</Text>
                    <Pressable onPress={() => refetch()} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>Try again</Text>
                    </Pressable>
                </View>
            ) : (
                <FlatList
                ref={listRef}
                data={hadiths}
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
