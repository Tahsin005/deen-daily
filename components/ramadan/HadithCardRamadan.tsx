import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Share, StyleSheet, Text, View } from "react-native";
import { Fonts } from "../../constants/Fonts";
import { GlassCard } from "../glass/GlassCard";

type HadithCardRamadanProps = {
    arabic?: string;
    english?: string;
    source?: string;
    grade?: string;
};

export const HadithCardRamadan = ({ arabic, english, source, grade }: HadithCardRamadanProps) => {
    if (!arabic && !english) {
        return null;
    }

    const handleShare = async () => {
        try {
            const message = [arabic, english, source ? `— ${source}` : null]
                .filter(Boolean)
                .join("\n\n");
            await Share.share({
                message: `${message}\n\nShared via Deen Daily`,
            });
        } catch {
            // ignore
        }
    };

    return (
        <GlassCard style={styles.card}>
            <View style={styles.headerRow}>
                <View style={styles.headerTagWrap}>
                    <Ionicons name="book-outline" size={16} color="#F2B50B" />
                    <Text style={styles.headerTag}>HADITH OF THE DAY</Text>
                </View>
                <Pressable onPress={handleShare} style={styles.shareBtn}>
                    <Ionicons name="share-outline" size={17} color="#9CA3AF" />
                </Pressable>
            </View>

            {arabic ? <Text style={styles.arabic}>{arabic}</Text> : null}
            {english ? <Text style={styles.translation}>{english}</Text> : null}

            <View style={styles.footerRow}>
                {source ? <Text style={styles.reference}>{source}</Text> : <View />}
                {grade ? (
                    <View style={styles.gradeBadge}>
                        <Text style={styles.gradeText}>{grade}</Text>
                    </View>
                ) : null}
            </View>
        </GlassCard>
    );
};

const styles = StyleSheet.create({
    card: {
        marginTop: 14,
        padding: 16,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    headerTagWrap: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    headerTag: {
        fontSize: Fonts.size.xxs,
        fontWeight: "700",
        color: "#FDE68A",
        letterSpacing: 0.8,
        textTransform: "uppercase",
    },
    shareBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        alignItems: "center",
        justifyContent: "center",
    },
    arabic: {
        fontSize: Fonts.size.lg,
        color: "#FFFFFF",
        textAlign: "right",
        lineHeight: 28,
        marginBottom: 10,
    },
    translation: {
        fontSize: Fonts.size.sm,
        color: "#D1D5DB",
        lineHeight: 20,
        marginBottom: 12,
    },
    footerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.06)",
        paddingTop: 10,
    },
    reference: {
        fontSize: Fonts.size.xs,
        color: "#9CA3AF",
        fontStyle: "italic",
    },
    gradeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        backgroundColor: "rgba(72, 161, 17, 0.2)",
        borderWidth: 1,
        borderColor: "rgba(72, 161, 17, 0.35)",
    },
    gradeText: {
        fontSize: Fonts.size.xxs,
        color: "#86EFAC",
        fontWeight: "700",
    },
});
