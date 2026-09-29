import Ionicons from "@expo/vector-icons/Ionicons";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GlassCard } from "../glass/GlassCard";
import { Fonts } from "../../constants/Fonts";
import type { HadithChapter } from "../../lib/api/hadith/getHadithChapters";

type ChapterCardProps = {
    chapter: HadithChapter;
};

function ChapterCard({ chapter }: ChapterCardProps) {
    return (
        <GlassCard style={styles.card} contentStyle={styles.cardContent}>
            <View style={styles.left}>
                <View style={styles.badge}>
                    <Text style={styles.number}>#{chapter.chapterNumber}</Text>
                </View>
                <View style={styles.textWrap}>
                    <Text style={styles.title}>{chapter.chapterEnglish}</Text>
                    {chapter.chapterArabic ? (
                        <Text style={styles.arabic}>{chapter.chapterArabic}</Text>
                    ) : null}
                    {chapter.chapterUrdu ? (
                        <Text style={styles.urdu}>{chapter.chapterUrdu}</Text>
                    ) : null}
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
    left: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
        flex: 1,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: "rgba(37, 103, 30, 0.35)",
        borderWidth: 1,
        borderColor: "rgba(72, 161, 17, 0.35)",
        marginTop: 2,
    },
    number: {
        fontSize: Fonts.size.xs,
        fontWeight: "700",
        color: "#48A111",
    },
    textWrap: {
        flex: 1,
    },
    title: {
        fontSize: Fonts.size.md,
        fontWeight: "700",
        color: "#F3F4F6",
        letterSpacing: -0.2,
    },
    arabic: {
        marginTop: 4,
        fontSize: Fonts.size.lg,
        color: "#FDE68A",
        textAlign: "right",
    },
    urdu: {
        marginTop: 2,
        fontSize: Fonts.size.xs,
        color: "#9CA3AF",
        textAlign: "right",
    },
});

export const MemoizedChapterCard = memo(ChapterCard);
export default MemoizedChapterCard;
export { MemoizedChapterCard as ChapterCard };
