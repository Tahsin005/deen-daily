import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";
import type { HadithChapter } from "../../lib/api/hadith/getHadithChapters";

type ChapterCardProps = {
    chapter: HadithChapter;
};

function ChapterCard({ chapter }: ChapterCardProps) {
    return (
        <View style={styles.card}>
            <Text style={styles.number}>Chapter {chapter.chapterNumber}</Text>
            <Text style={styles.title}>{chapter.chapterEnglish}</Text>
            <Text style={styles.subtitle}>{chapter.chapterArabic}</Text>
            <Text style={styles.subSubtitle}>{chapter.chapterUrdu}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#F0F0F0",
    },
    number: {
        fontSize: 12,
        fontWeight: "600",
        color: Colors.light.primary,
    },
    title: {
        marginTop: 6,
        fontSize: 16,
        fontWeight: "700",
        color: Colors.light.text,
    },
    subtitle: {
        marginTop: 4,
        fontSize: 14,
        color: Colors.light.text,
    },
    subSubtitle: {
        marginTop: 4,
        fontSize: 12,
        color: Colors.light.icon,
    },
});

const MemoizedChapterCard = memo(ChapterCard);
export default MemoizedChapterCard;
export { MemoizedChapterCard as ChapterCard };
