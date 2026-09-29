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
import { ScrollToTopButton } from "../../../components/common/ScrollToTopButton";
import { AmbientBackground } from "../../../components/glass/AmbientBackground";
import { GlassCard } from "../../../components/glass/GlassCard";
import { HadithCard } from "../../../components/hadith/HadithCard";
import { BackButton } from "../../../components/quran/BackButton";
import { Fonts } from "../../../constants/Fonts";
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
        <AmbientBackground>
            <View style={styles.container}>
                <BackButton onPress={() => router.back()} label="Back to Chapters" />
                <View style={styles.header}>
                    <Text style={styles.title}>Hadith Narrations</Text>
                    <Text style={styles.subtitle}>
                        {bookSlug.replace(/-/g, " ")} · Chapter {chapter}
                    </Text>
                </View>

                {isLoading ? (
                    <View style={styles.skeletonContainer}>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <GlassCard key={`sk-${index}`} style={styles.skeletonCard} />
                        ))}
                    </View>
                ) : error ? (
                    <View style={styles.stateContainer}>
                        <Text style={styles.stateText}>Could not load Hadiths.</Text>
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
        gap: 12,
    },
    skeletonCard: {
        height: 140,
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
