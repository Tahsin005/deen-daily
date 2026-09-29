import Ionicons from "@expo/vector-icons/Ionicons";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GlassCard } from "../glass/GlassCard";
import { Fonts } from "../../constants/Fonts";
import type { HadithBook } from "../../lib/api/hadith/getHadithBooks";

type BookCardProps = {
    book: HadithBook;
};

function BookCard({ book }: BookCardProps) {
    return (
        <GlassCard style={styles.card} contentStyle={styles.cardContent}>
            <View style={styles.leftRow}>
                <View style={styles.iconBadge}>
                    <Ionicons name="book" size={20} color="#48A111" />
                </View>
                <View style={styles.textGroup}>
                    <Text style={styles.title}>{book.bookName}</Text>
                    <Text style={styles.subtitle}>{book.writerName}</Text>
                    <View style={styles.metaRow}>
                        <View style={styles.metaPill}>
                            <Text style={styles.metaPillText}>
                                {book.hadiths_count} Hadiths
                            </Text>
                        </View>
                        <View style={[styles.metaPill, styles.metaPillAlt]}>
                            <Text style={[styles.metaPillText, { color: "#FDE68A" }]}>
                                {book.chapters_count} Chapters
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </GlassCard>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 10,
    },
    cardContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
    },
    leftRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        flex: 1,
    },
    iconBadge: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(37, 103, 30, 0.35)",
        borderWidth: 1,
        borderColor: "rgba(72, 161, 17, 0.35)",
        alignItems: "center",
        justifyContent: "center",
    },
    textGroup: {
        flex: 1,
    },
    title: {
        fontSize: Fonts.size.lg,
        fontWeight: "700",
        color: "#F3F4F6",
        letterSpacing: -0.2,
    },
    subtitle: {
        marginTop: 2,
        fontSize: Fonts.size.xs,
        color: "#9CA3AF",
    },
    metaRow: {
        marginTop: 8,
        flexDirection: "row",
        gap: 8,
    },
    metaPill: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.09)",
    },
    metaPillAlt: {
        backgroundColor: "rgba(242, 181, 11, 0.12)",
        borderColor: "rgba(242, 181, 11, 0.25)",
    },
    metaPillText: {
        fontSize: 10,
        fontWeight: "600",
        color: "#D1D5DB",
    },
});

export const MemoizedBookCard = memo(BookCard);
export default MemoizedBookCard;
export { MemoizedBookCard as BookCard };
