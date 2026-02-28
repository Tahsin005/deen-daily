import { InfiniteData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { HadithCard } from "../../components/hadith/HadithCard";
import { Colors } from "../../constants/Colors";
import { HadithAPISettings } from "../../constants/settings/hadithAPISettings";
import { getHadithBooks } from "../../lib/api/hadith/getHadithBooks";
import { getHadiths, HadithEntry } from "../../lib/api/hadith/getHadiths";

const PAGE_SIZE = 25;
const ALL_BOOKS = "all";
const ALL_STATUS = "all";

const useDebouncedValue = <T,>(value: T, delay = 500) => {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const handle = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(handle);
    }, [value, delay]);

    return debounced;
};

export default function HadithSearchScreen() {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [selectedBook, setSelectedBook] = useState(ALL_BOOKS);
    const [selectedStatus, setSelectedStatus] = useState(ALL_STATUS);
    const [bookMenuOpen, setBookMenuOpen] = useState(false);
    const [statusMenuOpen, setStatusMenuOpen] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const listRef = useRef<FlatList<HadithEntry>>(null);

    const debouncedSearch = useDebouncedValue(searchText.trim(), 600);

    const { data: bookData } = useQuery({
        queryKey: ["hadithBooks"],
        queryFn: getHadithBooks,
    });

    const books = useMemo(() => bookData ?? [], [bookData]);

    const statusOptions = useMemo(
        () => [
            { label: "All Status", value: ALL_STATUS },
            ...HadithAPISettings.hadiths.status,
        ],
        []
    );

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
        ["hadithSearch", string, string, string],
        number
    >({
        queryKey: ["hadithSearch", debouncedSearch, selectedBook, selectedStatus],
        queryFn: ({ pageParam = 1 }) =>
            getHadiths({
                searchText: debouncedSearch,
                bookSlug: selectedBook === ALL_BOOKS ? undefined : selectedBook,
                status: selectedStatus === ALL_STATUS ? undefined : selectedStatus,
                page: pageParam,
                paginate: PAGE_SIZE,
            }),
        enabled: debouncedSearch.length > 0 || selectedBook !== ALL_BOOKS || selectedStatus !== ALL_STATUS,
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
        lastPage.current_page < lastPage.last_page ? lastPage.current_page + 1 : undefined,
    });

    const hadiths = useMemo(
        () => data?.pages.flatMap((page: Awaited<ReturnType<typeof getHadiths>>) => page.data) ?? [],
        [data]
    );

    const totalCount = data?.pages?.[0]?.total ?? 0;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Search Hadiths</Text>
            <Text style={styles.subtitle}>Search through thousands of authentic Hadiths</Text>
            <View style={styles.searchSummaryCard}>
                <View style={styles.searchSummaryRow}>
                    <View style={styles.searchSummaryTextWrap}>
                        <Text style={styles.searchSummaryLabel}>Filters</Text>
                        <Text style={styles.searchSummaryValue} numberOfLines={1}>
                            {searchText ? `“${searchText}”` : "Any text"} · {selectedBook === ALL_BOOKS
                                ? "All books"
                                : books.find((book) => book.bookSlug === selectedBook)?.bookName ?? "All books"} · {selectedStatus === ALL_STATUS
                                ? "All status"
                                : statusOptions.find((status) => status.value === selectedStatus)?.label ?? "All status"}
                        </Text>
                    </View>
                    <Pressable
                        style={styles.filterButton}
                        onPress={() => {
                            setBookMenuOpen(false);
                            setStatusMenuOpen(false);
                            setFiltersOpen(true);
                        }}
                    >
                        <Text style={styles.filterButtonText}>Open Filters</Text>
                    </Pressable>
                </View>
            </View>

            <Text style={styles.resultCount}>Found {totalCount} hadiths</Text>

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
                    renderItem={({ item }) => <HadithCard hadith={item} />}
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
                    ListEmptyComponent={
                        <View style={styles.stateContainer}>
                            <Text style={styles.stateText}>No hadiths found.</Text>
                        </View>
                    }
                />
            )}

            <ScrollToTopButton
                visible={showScrollTop}
                onPress={() => listRef.current?.scrollToOffset({ offset: 0, animated: true })}
            />
            <Modal
                visible={filtersOpen}
                animationType="fade"
                transparent
                onRequestClose={() => setFiltersOpen(false)}
            >
                <Pressable style={styles.modalBackdrop} onPress={() => setFiltersOpen(false)}>
                    <Pressable style={styles.modalCard} onPress={() => null}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Search Filters</Text>
                            <Pressable onPress={() => setFiltersOpen(false)}>
                                <Text style={styles.modalCloseText}>Close</Text>
                            </Pressable>
                        </View>

                        <Text style={styles.filterLabel}>Search Text</Text>
                        <TextInput
                            value={searchText}
                            onChangeText={setSearchText}
                            placeholder="Search in English..."
                            placeholderTextColor={Colors.light.icon}
                            style={styles.searchInput}
                            autoCapitalize="none"
                        />

                        <Text style={styles.filterLabel}>Book</Text>
                        <Pressable
                            onPress={() => setBookMenuOpen((prev) => !prev)}
                            style={styles.dropdownTrigger}
                        >
                            <Text style={styles.dropdownText}>
                                {selectedBook === ALL_BOOKS
                                    ? "All Books"
                                    : books.find((book) => book.bookSlug === selectedBook)?.bookName ?? "All Books"}
                            </Text>
                        </Pressable>
                        {bookMenuOpen && (
                            <View style={styles.dropdownMenu}>
                                <Pressable
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        setSelectedBook(ALL_BOOKS);
                                        setBookMenuOpen(false);
                                    }}
                                >
                                    <Text style={styles.dropdownItemText}>All Books</Text>
                                </Pressable>
                                {books.map((book) => (
                                    <Pressable
                                        key={book.bookSlug}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setSelectedBook(book.bookSlug);
                                            setBookMenuOpen(false);
                                        }}
                                    >
                                        <Text style={styles.dropdownItemText}>{book.bookName}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}

                        <Text style={styles.filterLabel}>Status</Text>
                        <Pressable
                            onPress={() => setStatusMenuOpen((prev) => !prev)}
                            style={styles.dropdownTrigger}
                        >
                            <Text style={styles.dropdownText}>
                                {selectedStatus === ALL_STATUS
                                    ? "All Status"
                                    : statusOptions.find((status) => status.value === selectedStatus)?.label ?? "All Status"}
                            </Text>
                        </Pressable>
                        {statusMenuOpen && (
                            <View style={styles.dropdownMenu}>
                                {statusOptions.map((status) => (
                                    <Pressable
                                        key={status.value}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setSelectedStatus(status.value);
                                            setStatusMenuOpen(false);
                                        }}
                                    >
                                        <Text style={styles.dropdownItemText}>{status.label}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}

                        <View style={styles.modalFooter}>
                            <Pressable
                                style={styles.modalSecondaryButton}
                                onPress={() => {
                                    setSearchText("");
                                    setSelectedBook(ALL_BOOKS);
                                    setSelectedStatus(ALL_STATUS);
                                    setBookMenuOpen(false);
                                    setStatusMenuOpen(false);
                                }}
                            >
                                <Text style={styles.modalSecondaryButtonText}>Clear Filters</Text>
                            </Pressable>
                            <Pressable style={styles.modalPrimaryButton} onPress={() => setFiltersOpen(false)}>
                                <Text style={styles.modalPrimaryButtonText}>Done</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
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
        textAlign: "center",
    },
    subtitle: {
        marginTop: 6,
        fontSize: 14,
        color: Colors.light.icon,
        textAlign: "center",
        marginBottom: 20,
    },
    searchSummaryCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: "#F0F0F0",
        marginBottom: 16,
    },
    searchSummaryRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    searchSummaryTextWrap: {
        flex: 1,
    },
    searchSummaryLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: Colors.light.icon,
        marginBottom: 4,
    },
    searchSummaryValue: {
        fontSize: 13,
        color: Colors.light.text,
    },
    filterButton: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 999,
        backgroundColor: Colors.light.primary,
    },
    filterButtonText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "700",
    },
    filterLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: Colors.light.icon,
        marginTop: 12,
        marginBottom: 6,
    },
    searchInput: {
        minHeight: 44,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E4E4E7",
        paddingHorizontal: 12,
        backgroundColor: "#FFFFFF",
        color: Colors.light.text,
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
    dropdownText: {
        fontSize: 13,
        color: Colors.light.text,
    },
    dropdownMenu: {
        marginTop: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E4E4E7",
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    dropdownItemText: {
        fontSize: 13,
        color: Colors.light.text,
    },
    resultCount: {
        fontSize: 12,
        color: Colors.light.icon,
        marginBottom: 10,
    },
    listContent: {
        paddingBottom: 32,
        gap: 12,
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
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#F0F0F0",
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
    footerSkeleton: {
        width: 120,
        height: 10,
        borderRadius: 5,
        alignSelf: "center",
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
    footerLoader: {
        paddingVertical: 16,
        alignItems: "center",
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(15, 23, 42, 0.45)",
        justifyContent: "center",
        paddingHorizontal: 16,
    },
    modalCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 18,
        maxHeight: "85%",
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: Colors.light.text,
    },
    modalCloseText: {
        fontSize: 13,
        fontWeight: "600",
        color: Colors.light.primary,
    },
    modalFooter: {
        marginTop: 16,
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 12,
    },
    modalSecondaryButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 999,
        backgroundColor: "#F3F4F6",
        borderWidth: 1,
        borderColor: "#E4E4E7",
    },
    modalSecondaryButtonText: {
        color: Colors.light.text,
        fontWeight: "600",
        fontSize: 13,
    },
    modalPrimaryButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 999,
        backgroundColor: Colors.light.primary,
    },
    modalPrimaryButtonText: {
        color: "#FFFFFF",
        fontWeight: "700",
    },
});
