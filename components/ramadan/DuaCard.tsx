import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Share, StyleSheet, Text, View } from "react-native";
import { Fonts } from "../../constants/Fonts";
import { GlassCard } from "../glass/GlassCard";

type DuaCardProps = {
    title?: string;
    arabic?: string;
    translation?: string;
    reference?: string;
};

export const DuaCard = ({ title, arabic, translation, reference }: DuaCardProps) => {
    if (!title && !arabic && !translation) {
        return null;
    }

    const handleShare = async () => {
        try {
            const message = [title, arabic, translation, reference ? `— ${reference}` : null]
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
                    <Ionicons name="sparkles" size={16} color="#86EFAC" />
                    <Text style={styles.headerTag}>DUA OF THE DAY</Text>
                </View>
                <Pressable onPress={handleShare} style={styles.shareBtn}>
                    <Ionicons name="share-outline" size={17} color="#9CA3AF" />
                </Pressable>
            </View>

            {title ? <Text style={styles.title}>{title}</Text> : null}
            {arabic ? <Text style={styles.arabic}>{arabic}</Text> : null}
            {translation ? <Text style={styles.translation}>{translation}</Text> : null}
            {reference ? (
                <View style={styles.footerRow}>
                    <Text style={styles.reference}>Source: {reference}</Text>
                </View>
            ) : null}
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
        marginBottom: 10,
    },
    headerTagWrap: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    headerTag: {
        fontSize: Fonts.size.xxs,
        fontWeight: "700",
        color: "#86EFAC",
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
    title: {
        fontSize: Fonts.size.md,
        fontWeight: "700",
        color: "#FDE68A",
        marginBottom: 8,
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
        marginBottom: 10,
    },
    footerRow: {
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.06)",
        paddingTop: 8,
    },
    reference: {
        fontSize: Fonts.size.xs,
        color: "#9CA3AF",
        fontStyle: "italic",
    },
});
