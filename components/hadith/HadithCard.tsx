import Ionicons from "@expo/vector-icons/Ionicons";
import { memo } from "react";
import { Pressable, Share, StyleSheet, Text, View } from "react-native";
import { Fonts } from "../../constants/Fonts";
import type { HadithEntry } from "../../lib/api/hadith/getHadiths";
import { GlassCard } from "../glass/GlassCard";

type HadithCardProps = {
    hadith: HadithEntry;
};

function HadithCard({ hadith }: HadithCardProps) {
    const handleShare = async () => {
        try {
            await Share.share({
                title: `Hadith #${hadith.hadithNumber}`,
                message: `${hadith.hadithArabic ? `${hadith.hadithArabic}\n\n` : ""}${hadith.englishNarrator ? `${hadith.englishNarrator}: ` : ""}${hadith.hadithEnglish}\n\n[Hadith #${hadith.hadithNumber} · ${hadith.status ?? "Authentic"}] - Shared via Deen Daily`,
            });
        } catch {
            // ignore
        }
    };

    const isSahih = hadith.status?.toLowerCase().includes("sahih");

    return (
        <GlassCard style={styles.card} contentStyle={styles.cardContent}>

            <View style={styles.topRow}>
                <View style={styles.numberRow}>
                    <View style={styles.numberBadge}>
                        <Text style={styles.numberText}>#{hadith.hadithNumber}</Text>
                    </View>
                    {hadith.status ? (
                        <View style={[styles.statusBadge, isSahih ? styles.sahihBadge : styles.otherBadge]}>
                            <Text style={[styles.statusText, isSahih ? styles.sahihText : styles.otherText]}>
                                {hadith.status}
                            </Text>
                        </View>
                    ) : null}
                </View>

                <Pressable onPress={handleShare} style={styles.shareBtn}>
                    <Ionicons name="share-outline" size={16} color="#9CA3AF" />
                </Pressable>
            </View>


            {hadith.hadithArabic ? (
                <Text style={styles.hadithArabic}>{hadith.hadithArabic}</Text>
            ) : null}


            {hadith.englishNarrator ? (
                <Text style={styles.narrator}>Narrated: {hadith.englishNarrator}</Text>
            ) : null}


            <Text style={styles.hadithEnglish}>{hadith.hadithEnglish}</Text>


            <View style={styles.metaRow}>
                {hadith.bookSlug ? (
                    <Text style={styles.metaItem}>Book: {hadith.bookSlug}</Text>
                ) : null}
                {hadith.chapterId ? (
                    <Text style={styles.metaItem}>Chapter: {hadith.chapterId}</Text>
                ) : null}
                {hadith.volume ? (
                    <Text style={styles.metaItem}>Vol: {hadith.volume}</Text>
                ) : null}
            </View>
        </GlassCard>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
    },
    cardContent: {
        padding: 18,
    },
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
    },
    numberRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    numberBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: "rgba(242, 181, 11, 0.15)",
        borderWidth: 1,
        borderColor: "rgba(242, 181, 11, 0.35)",
    },
    numberText: {
        fontSize: Fonts.size.xs,
        fontWeight: "700",
        color: "#F2B50B",
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        borderWidth: 1,
    },
    sahihBadge: {
        backgroundColor: "rgba(37, 103, 30, 0.35)",
        borderColor: "rgba(72, 161, 17, 0.4)",
    },
    otherBadge: {
        backgroundColor: "rgba(255, 255, 255, 0.06)",
        borderColor: "rgba(255, 255, 255, 0.12)",
    },
    statusText: {
        fontSize: Fonts.size.xxs,
        fontWeight: "700",
        letterSpacing: 0.3,
    },
    sahihText: {
        color: "#48A111",
    },
    otherText: {
        color: "#9CA3AF",
    },
    shareBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        alignItems: "center",
        justifyContent: "center",
    },
    hadithArabic: {
        fontSize: Fonts.size.xl,
        lineHeight: 34,
        color: "#FFFFFF",
        textAlign: "right",
        marginBottom: 12,
    },
    narrator: {
        fontSize: Fonts.size.xs,
        fontWeight: "600",
        color: "#48A111",
        marginBottom: 6,
    },
    hadithEnglish: {
        fontSize: Fonts.size.text,
        lineHeight: 22,
        color: "#D1D5DB",
    },
    metaRow: {
        marginTop: 14,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.06)",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    metaItem: {
        fontSize: Fonts.size.xxs,
        color: "#9CA3AF",
    },
});

export const MemoizedHadithCard = memo(HadithCard);
export default MemoizedHadithCard;
export { MemoizedHadithCard as HadithCard };
