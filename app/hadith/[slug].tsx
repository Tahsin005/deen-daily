import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { AmbientBackground } from "../../components/glass/AmbientBackground";
import { GlassCard } from "../../components/glass/GlassCard";
import { ChapterCard } from "../../components/hadith/ChapterCard";
import { BackButton } from "../../components/quran/BackButton";
import { Fonts } from "../../constants/Fonts";
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
        <AmbientBackground>
            <View style={styles.container}>
                <BackButton onPress={() => router.back()} label="Back to Books" />
                <View style={styles.header}>
                    <Text style={styles.title}>Chapters</Text>
                    <Text style={styles.subtitle}>{bookSlug.replace(/-/g, " ")}</Text>
                </View>

                {isLoading ? (
                    <View style={styles.skeletonContainer}>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <GlassCard key={`sk-${index}`} style={styles.skeletonCard} />
                        ))}
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
                        keyExtractor={(item) => `${item.chapterNumber}-${item.id}`}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        onScroll={({ nativeEvent }) => setShowScrollTop(nativeEvent.contentOffset.y > 300)}
                        scrollEventThrottle={16}
                        onEndReached={() => {
                            if (hasNextPage && !isFetchingNextPage) {
                                fetchNextPage();
                            }
                        }}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={
                            isFetchingNextPage ? (
                                <View style={styles.footerLoader}>
                                    <ActivityIndicator size="small" color="#48A111" />
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
    },
    title: {
        fontSize: Fonts.size.mega,
        fontWeight: "700",
        color: "#F3F4F6",
        letterSpacing: -0.4,
    },
    subtitle: {
        fontSize: Fonts.size.sm,
        color: "#48A111",
        fontWeight: "600",
        textTransform: "capitalize",
        marginTop: 2,
    },
    listContent: {
        paddingBottom: 110,
    },
    skeletonContainer: {
        gap: 10,
    },
    skeletonCard: {
        height: 72,
    },
    footerLoader: {
        paddingVertical: 16,
        alignItems: "center",
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
