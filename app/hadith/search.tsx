import Ionicons from "@expo/vector-icons/Ionicons";
import { InfiniteData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { ScrollToTopButton } from "../../components/common/ScrollToTopButton";
import { AmbientBackground } from "../../components/glass/AmbientBackground";
import { GlassCard } from "../../components/glass/GlassCard";
import { GlassPill } from "../../components/glass/GlassPill";
import { HadithCard } from "../../components/hadith/HadithCard";
import { BackButton } from "../../components/quran/BackButton";
import { Fonts } from "../../constants/Fonts";
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
    const router = useRouter();
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [hadithNumber, setHadithNumber] = useState("");
    const [chapterNumber, setChapterNumber] = useState("");
    const [selectedBook, setSelectedBook] = useState(ALL_BOOKS);
    const [selectedStatus, setSelectedStatus] = useState(ALL_STATUS);
    const [bookMenuOpen, setBookMenuOpen] = useState(false);
    const [statusMenuOpen, setStatusMenuOpen] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const listRef = useRef<FlatList<HadithEntry>>(null);

    const debouncedSearch = useDebouncedValue(searchText.trim(), 600);
    const debouncedHadithNumber = useDebouncedValue(hadithNumber.trim(), 600);
    const debouncedChapterNumber = useDebouncedValue(chapterNumber.trim(), 600);

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
        ["hadithSearch", string, string, string, string, string],
        number
    >({
        queryKey: [
            "hadithSearch",
            debouncedSearch,
            debouncedHadithNumber,
            debouncedChapterNumber,
            selectedBook,
            selectedStatus,
        ],
        queryFn: ({ pageParam = 1 }) =>
            getHadiths({
                searchText: debouncedSearch,
                hadithNumber: debouncedHadithNumber || undefined,
                chapter: debouncedChapterNumber || undefined,
                bookSlug: selectedBook === ALL_BOOKS ? undefined : selectedBook,
                status: selectedStatus === ALL_STATUS ? undefined : selectedStatus,
                page: pageParam,
                paginate: PAGE_SIZE,
            }),
        enabled:
            debouncedSearch.length > 0 ||
            debouncedHadithNumber.length > 0 ||
            debouncedChapterNumber.length > 0 ||
            selectedBook !== ALL_BOOKS ||
            selectedStatus !== ALL_STATUS,
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
        <AmbientBackground>
            <View style={styles.container}>
                <BackButton onPress={() => router.back()} label="Back to Books" />
                <View style={styles.header}>
                    <Text style={styles.title}>Search Hadiths</Text>
                    <Text style={styles.subtitle}>Search through authentic Hadith narrations.</Text>
                </View>


                <GlassCard style={styles.searchSummaryCard} contentStyle={styles.searchSummaryContent}>
                    <View style={styles.searchSummaryTextWrap}>
                        <Text style={styles.searchSummaryLabel}>ACTIVE FILTERS</Text>
                        <Text style={styles.searchSummaryValue} numberOfLines={1}>
                            {searchText ? `“${searchText}”` : "Any keyword"}
                            {hadithNumber ? ` · #${hadithNumber}` : ""}
                            {chapterNumber ? ` · Ch ${chapterNumber}` : ""} ·{" "}
                            {selectedBook === ALL_BOOKS
                                ? "All books"
                                : books.find((b) => b.bookSlug === selectedBook)?.bookName ?? "All books"}{" "}
                            · {selectedStatus === ALL_STATUS ? "All status" : selectedStatus}
                        </Text>
                    </View>
                    <GlassPill
                        label="Filters"
                        icon="options-outline"
                        size="sm"
                        variant="primary"
                        onPress={() => {
                            setBookMenuOpen(false);
                            setStatusMenuOpen(false);
                            setFiltersOpen(true);
                        }}
                    />
                </GlassCard>

                <Text style={styles.resultCount}>Found {totalCount} authentic hadiths</Text>

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
                        renderItem={({ item }) => <HadithCard hadith={item} />}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
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
                                    <ActivityIndicator size="small" color="#48A111" />
                                </View>
                            ) : null
                        }
                        ListEmptyComponent={
                            <View style={styles.stateContainer}>
                                <Text style={styles.stateText}>
                                    {debouncedSearch || debouncedHadithNumber
                                        ? "No hadiths match your query."
                                        : "Tap 'Filters' to search by topic or number."}
                                </Text>
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
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={styles.modalKeyboard}
                        >
                            <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View style={styles.modalHeader}>
                                        <Text style={styles.modalTitle}>Search Filters</Text>
                                        <Pressable onPress={() => setFiltersOpen(false)}>
                                            <Ionicons name="close" size={20} color="#9CA3AF" />
                                        </Pressable>
                                    </View>

                                    <Text style={styles.filterLabel}>Search Text</Text>
                                    <TextInput
                                        value={searchText}
                                        onChangeText={setSearchText}
                                        placeholder="Keywords in English..."
                                        placeholderTextColor="#6B7280"
                                        style={styles.modalInput}
                                        autoCapitalize="none"
                                    />

                                    <Text style={styles.filterLabel}>Hadith Number</Text>
                                    <TextInput
                                        value={hadithNumber}
                                        onChangeText={setHadithNumber}
                                        placeholder="e.g. 42"
                                        placeholderTextColor="#6B7280"
                                        style={styles.modalInput}
                                        keyboardType="number-pad"
                                    />

                                    <Text style={styles.filterLabel}>Chapter Number</Text>
                                    <TextInput
                                        value={chapterNumber}
                                        onChangeText={setChapterNumber}
                                        placeholder="e.g. 1"
                                        placeholderTextColor="#6B7280"
                                        style={styles.modalInput}
                                        keyboardType="number-pad"
                                    />

                                    <Text style={styles.filterLabel}>Book Collection</Text>
                                    <Pressable
                                        onPress={() => setBookMenuOpen((p) => !p)}
                                        style={styles.dropdownTrigger}
                                    >
                                        <Text style={styles.dropdownText}>
                                            {selectedBook === ALL_BOOKS
                                                ? "All Books"
                                                : books.find((b) => b.bookSlug === selectedBook)?.bookName ?? "All Books"}
                                        </Text>
                                        <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
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
                                            {books.map((b) => (
                                                <Pressable
                                                    key={b.bookSlug}
                                                    style={styles.dropdownItem}
                                                    onPress={() => {
                                                        setSelectedBook(b.bookSlug);
                                                        setBookMenuOpen(false);
                                                    }}
                                                >
                                                    <Text style={styles.dropdownItemText}>{b.bookName}</Text>
                                                </Pressable>
                                            ))}
                                        </View>
                                    )}

                                    <Text style={styles.filterLabel}>Authenticity Status</Text>
                                    <Pressable
                                        onPress={() => setStatusMenuOpen((p) => !p)}
                                        style={styles.dropdownTrigger}
                                    >
                                        <Text style={styles.dropdownText}>
                                            {selectedStatus === ALL_STATUS
                                                ? "All Status"
                                                : statusOptions.find((s) => s.value === selectedStatus)?.label ?? "All Status"}
                                        </Text>
                                        <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
                                    </Pressable>
                                    {statusMenuOpen && (
                                        <View style={styles.dropdownMenu}>
                                            {statusOptions.map((s) => (
                                                <Pressable
                                                    key={s.value}
                                                    style={styles.dropdownItem}
                                                    onPress={() => {
                                                        setSelectedStatus(s.value);
                                                        setStatusMenuOpen(false);
                                                    }}
                                                >
                                                    <Text style={styles.dropdownItemText}>{s.label}</Text>
                                                </Pressable>
                                            ))}
                                        </View>
                                    )}

                                    <View style={styles.modalFooter}>
                                        <Pressable
                                            style={styles.clearBtn}
                                            onPress={() => {
                                                setSearchText("");
                                                setHadithNumber("");
                                                setChapterNumber("");
                                                setSelectedBook(ALL_BOOKS);
                                                setSelectedStatus(ALL_STATUS);
                                                setBookMenuOpen(false);
                                                setStatusMenuOpen(false);
                                            }}
                                        >
                                            <Text style={styles.clearBtnText}>Clear</Text>
                                        </Pressable>
                                        <Pressable
                                            style={styles.doneBtn}
                                            onPress={() => setFiltersOpen(false)}
                                        >
                                            <Text style={styles.doneBtnText}>Apply</Text>
                                        </Pressable>
                                    </View>
                                </ScrollView>
                            </Pressable>
                        </KeyboardAvoidingView>
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
        marginBottom: 12,
    },
    title: {
        fontSize: Fonts.size.mega,
        fontWeight: "700",
        color: "#F3F4F6",
        letterSpacing: -0.4,
    },
    subtitle: {
        fontSize: Fonts.size.sm,
        color: "#9CA3AF",
        marginTop: 2,
    },
    searchSummaryCard: {
        marginBottom: 12,
    },
    searchSummaryContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 14,
    },
    searchSummaryTextWrap: {
        flex: 1,
        marginRight: 10,
    },
    searchSummaryLabel: {
        fontSize: 10,
        fontWeight: "700",
        color: "#6B7280",
        letterSpacing: 1,
    },
    searchSummaryValue: {
        fontSize: Fonts.size.xs,
        color: "#D1D5DB",
        marginTop: 2,
    },
    resultCount: {
        fontSize: Fonts.size.xs,
        color: "#6B7280",
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    listContent: {
        paddingBottom: 110,
    },
    skeletonContainer: {
        gap: 12,
    },
    skeletonCard: {
        height: 120,
    },
    footerLoader: {
        paddingVertical: 16,
        alignItems: "center",
    },
    stateContainer: {
        marginTop: 40,
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 20,
    },
    stateText: {
        fontSize: Fonts.size.md,
        color: "#9CA3AF",
        textAlign: "center",
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
    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    modalKeyboard: {
        width: "100%",
        maxWidth: 380,
    },
    modalCard: {
        backgroundColor: "rgba(22, 28, 24, 0.96)",
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.12)",
        borderTopColor: "rgba(255, 255, 255, 0.25)",
        maxHeight: 520,
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
    },
    modalTitle: {
        fontSize: Fonts.size.lg,
        fontWeight: "700",
        color: "#F3F4F6",
    },
    filterLabel: {
        fontSize: Fonts.size.xs,
        fontWeight: "600",
        color: "#9CA3AF",
        marginTop: 10,
        marginBottom: 6,
    },
    modalInput: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 42,
        color: "#F3F4F6",
        fontSize: Fonts.size.sm,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.08)",
    },
    dropdownTrigger: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 42,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.08)",
    },
    dropdownText: {
        fontSize: Fonts.size.sm,
        color: "#F3F4F6",
    },
    dropdownMenu: {
        backgroundColor: "rgba(14, 18, 15, 0.95)",
        borderRadius: 12,
        marginTop: 6,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
        maxHeight: 180,
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    dropdownItemText: {
        fontSize: Fonts.size.sm,
        color: "#D1D5DB",
    },
    modalFooter: {
        marginTop: 18,
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
    },
    clearBtn: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: "rgba(255, 255, 255, 0.06)",
    },
    clearBtnText: {
        color: "#9CA3AF",
        fontWeight: "600",
        fontSize: Fonts.size.sm,
    },
    doneBtn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: "#25671E",
        borderWidth: 1,
        borderColor: "rgba(72, 161, 17, 0.4)",
    },
    doneBtnText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: Fonts.size.sm,
    },
});
