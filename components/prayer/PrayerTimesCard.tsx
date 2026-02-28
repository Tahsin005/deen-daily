import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { Theme } from "../../constants/Theme";
import { SkeletonLine } from "../common/Skeleton";
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
        <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Today’s prayer times</Text>
            {isLoading ? (
                <View style={styles.skeletonGrid}>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <View key={`skeleton-${index}`} style={styles.skeletonItem}>
                            <SkeletonLine style={styles.skeletonLine} />
                            <SkeletonLine style={styles.skeletonLineShort} />
                        </View>
                    ))}
                </View>
            ) : error ? (
                <Text style={styles.statusText}>Unable to load prayer times.</Text>
            ) : entries.length ? (
                <View style={styles.timesGrid}>
                    {entries.map(({ key, label, icon }) => (
                        <View key={key} style={styles.timeItem}>
                            <View style={styles.timeLabelRow}>
                                <Ionicons name={icon} size={18} color={Colors.light.primary} />
                                <Text style={styles.timeLabel}>{label}</Text>
                            </View>
                            <Text style={styles.timeValue}>{times[key]}</Text>
                        </View>
                    ))}
                </View>
            ) : (
                <Text style={styles.statusText}>No prayer times available yet.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    sectionCard: {
        marginTop: 16,
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.radius.lg,
        borderWidth: 1,
        borderColor: Theme.colors.borderLight,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: Colors.light.text,
        marginBottom: 12,
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    skeletonGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    skeletonItem: {
        width: "48%",
        borderRadius: Theme.radius.md,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        backgroundColor: Theme.colors.surfaceMuted,
        paddingVertical: 12,
        paddingHorizontal: 12,
        gap: 8,
    },
    skeletonLine: {
        width: "70%",
        height: 12,
        borderRadius: 6,
    },
    skeletonLineShort: {
        width: "40%",
        height: 14,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 14,
        color: Colors.light.icon,
    },
    timeItem: {
        width: "48%",
        borderRadius: Theme.radius.md,
        backgroundColor: Theme.colors.surfaceMuted,
        borderWidth: 1,
        borderColor: Theme.colors.border,
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
        fontSize: 12,
        color: Colors.light.icon,
    },
    timeValue: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.light.text,
    },
    timesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
});
