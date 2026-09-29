import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import { GlassCard } from "../glass/GlassCard";
import { Fonts } from "../../constants/Fonts";

type IconName = keyof typeof Ionicons.glyphMap;

export type ProhibitedTimes = {
    sunrise: { start: string; end: string };
    noon: { start: string; end: string };
    sunset: { start: string; end: string };
};

type ProhibitedTimesCardProps = {
    times?: ProhibitedTimes;
};

export const ProhibitedTimesCard = ({ times }: ProhibitedTimesCardProps) => {
    return (
        <GlassCard style={styles.card}>
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.sectionCategory}>ATTENTION</Text>
                    <Text style={styles.sectionTitle}>Prohibited Times</Text>
                </View>
                <Text style={styles.headerHint}>Avoid Salat</Text>
            </View>
            {times ? (
                <View style={styles.prohibitedGrid}>
                    {([
                        { label: "Sunrise", value: times.sunrise, icon: "sunny" as IconName },
                        { label: "Noon (Zawal)", value: times.noon, icon: "sunny-outline" as IconName },
                        { label: "Sunset", value: times.sunset, icon: "partly-sunny" as IconName },
                    ] as const).map((item) => (
                        <View key={item.label} style={styles.prohibitedCard}>
                            <View style={styles.cardTopRow}>
                                <Ionicons name={item.icon} size={18} color="#F2B50B" />
                                <Text style={styles.prohibitedLabel}>{item.label}</Text>
                            </View>
                            <View style={styles.timePill}>
                                <Text style={styles.prohibitedValue}>
                                    {item.value.start} - {item.value.end}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            ) : (
                <Text style={styles.statusText}>Prohibited times will appear once loaded.</Text>
            )}
        </GlassCard>
    );
};

const styles = StyleSheet.create({
    card: {
        marginTop: 16,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
    },
    sectionCategory: {
        fontSize: 10,
        fontWeight: "700",
        color: "#6B7280",
        letterSpacing: 1,
    },
    sectionTitle: {
        fontSize: Fonts.size.xl,
        fontWeight: "700",
        color: "#F3F4F6",
        letterSpacing: -0.3,
    },
    headerHint: {
        fontSize: Fonts.size.xs,
        color: "#EF4444",
        fontWeight: "600",
    },
    statusText: {
        fontSize: Fonts.size.sm,
        color: "#9CA3AF",
        textAlign: "center",
        paddingVertical: 12,
    },
    prohibitedGrid: {
        flexDirection: "row",
        gap: 8,
    },
    prohibitedCard: {
        flex: 1,
        backgroundColor: "rgba(242, 181, 11, 0.08)",
        borderRadius: 14,
        padding: 10,
        borderWidth: 1,
        borderColor: "rgba(242, 181, 11, 0.2)",
        borderTopColor: "rgba(242, 181, 11, 0.35)",
        alignItems: "center",
    },
    cardTopRow: {
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        marginBottom: 8,
    },
    prohibitedLabel: {
        fontSize: Fonts.size.xs,
        fontWeight: "600",
        color: "#FDE68A",
        textAlign: "center",
    },
    timePill: {
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(242, 181, 11, 0.25)",
    },
    prohibitedValue: {
        fontSize: Fonts.size.xxs,
        fontWeight: "600",
        color: "#F3F4F6",
        textAlign: "center",
    },
});
export default ProhibitedTimesCard;
