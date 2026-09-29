import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GlassCard } from "../glass/GlassCard";
import { Fonts } from "../../constants/Fonts";
import { timeEntries } from "./prayerTimesUtils";

type PrayerTimesCardProps = {
    isLoading: boolean;
    error?: Error | null;
    times: Record<string, string>;
};

export const PrayerTimesCard = ({ isLoading, error, times }: PrayerTimesCardProps) => {
    const entries = useMemo(
        () => timeEntries.filter(({ key }) => Boolean(times[key])),
        [times]
    );

    return (
        <GlassCard style={styles.card}>
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.sectionCategory}>SCHEDULE</Text>
                    <Text style={styles.sectionTitle}>Today's Prayer Times</Text>
                </View>
                <View style={styles.tag}>
                    <Text style={styles.tagText}>Daily</Text>
                </View>
            </View>

            {isLoading ? (
                <View style={styles.skeletonGrid}>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <View key={`skeleton-${index}`} style={styles.skeletonItem} />
                    ))}
                </View>
            ) : error ? (
                <Text style={styles.statusText}>Unable to load prayer times.</Text>
            ) : entries.length ? (
                <View style={styles.timesGrid}>
                    {entries.map(({ key, label, icon }) => (
                        <View key={key} style={styles.timeItem}>
                            <View style={styles.timeLabelRow}>
                                <Ionicons name={icon} size={16} color="#48A111" />
                                <Text style={styles.timeLabel}>{label}</Text>
                            </View>
                            <Text style={styles.timeValue}>{times[key]}</Text>
                        </View>
                    ))}
                </View>
            ) : (
                <Text style={styles.statusText}>No prayer times available yet.</Text>
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
        marginBottom: 16,
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
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        backgroundColor: "rgba(37, 103, 30, 0.3)",
        borderWidth: 1,
        borderColor: "rgba(72, 161, 17, 0.3)",
    },
    tagText: {
        fontSize: Fonts.size.xxs,
        fontWeight: "700",
        color: "#48A111",
    },
    timesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    timeItem: {
        width: "48%",
        borderRadius: 14,
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.08)",
        borderTopColor: "rgba(255, 255, 255, 0.16)",
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    timeLabelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 6,
    },
    timeLabel: {
        fontSize: Fonts.size.xs,
        color: "#9CA3AF",
        fontWeight: "500",
    },
    timeValue: {
        fontSize: Fonts.size.lg,
        fontWeight: "700",
        color: "#F3F4F6",
    },
    statusText: {
        fontSize: Fonts.size.text,
        color: "#9CA3AF",
        textAlign: "center",
        paddingVertical: 16,
    },
    skeletonGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    skeletonItem: {
        width: "48%",
        height: 60,
        borderRadius: 14,
        backgroundColor: "rgba(255, 255, 255, 0.04)",
    },
});
export default PrayerTimesCard;
