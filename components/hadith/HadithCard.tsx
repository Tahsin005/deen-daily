import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";
import type { HadithEntry } from "../../lib/api/hadith/getHadiths";

type HadithCardProps = {
    hadith: HadithEntry;
};

function HadithCard({ hadith }: HadithCardProps) {
    return (
        <View style={styles.card}>
            {hadith.headingEnglish ? (
                <Text style={styles.heading}>{hadith.headingEnglish}</Text>
            ) : null}
            {hadith.headingArabic ? (
                <Text style={styles.headingArabic}>{hadith.headingArabic}</Text>
            ) : null}
            <Text style={styles.narrator}>{hadith.englishNarrator ?? "Narrated"}</Text>
            <Text style={styles.hadithEnglish}>{hadith.hadithEnglish}</Text>
            {hadith.hadithArabic ? (
                <Text style={styles.hadithArabic}>{hadith.hadithArabic}</Text>
            ) : null}
            <View style={styles.metaRow}
            >
                <Text style={styles.metaText}>Hadith #{hadith.hadithNumber}</Text>
                {hadith.status ? <Text style={styles.metaText}>{hadith.status}</Text> : null}
                {hadith.volume ? <Text style={styles.metaText}>Vol {hadith.volume}</Text> : null}
                {hadith.bookSlug ? <Text style={styles.metaText}>{hadith.bookSlug}</Text> : null}
                {hadith.chapterId ? <Text style={styles.metaText}>Ch {hadith.chapterId}</Text> : null}
            </View>
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
    heading: {
        fontSize: 13,
        fontWeight: "700",
        color: Colors.light.primary,
        marginBottom: 8,
    },
    headingArabic: {
        fontSize: 18,
        lineHeight: 26,
        color: Colors.light.text,
        textAlign: "right",
        marginBottom: 6,
    },
    narrator: {
        fontSize: 12,
        fontWeight: "600",
        color: Colors.light.icon,
        marginBottom: 8,
    },
    hadithEnglish: {
        fontSize: 18,
        lineHeight: 26,
        color: Colors.light.text,
    },
    hadithArabic: {
        marginTop: 10,
        fontSize: 24,
        lineHeight: 34,
        color: Colors.light.text,
        textAlign: "right",
    },
    metaRow: {
        marginTop: 12,
        flexDirection: "row",
        gap: 12,
        flexWrap: "wrap",
    },
    metaText: {
        fontSize: 11,
        color: Colors.light.icon,
    },
});

const MemoizedHadithCard = memo(HadithCard);
export default MemoizedHadithCard;
export { MemoizedHadithCard as HadithCard };
