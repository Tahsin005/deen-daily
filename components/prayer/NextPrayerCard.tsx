import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { Theme } from "../../constants/Theme";
import { SkeletonCircle, SkeletonLine } from "../common/Skeleton";
import { mainPrayerKeys, parseTimeToMinutes, timeEntries } from "./prayerTimesUtils";

type NextPrayerCardProps = {
    isLoading: boolean;
    error?: Error | null;
    times: Record<string, string>;
    now: Date;
    title?: string;
    actionLabel?: string;
    onActionPress?: () => void;
    footerText?: string;
    footerActionLabel?: string;
    onFooterActionPress?: () => void;
    emptyStateText?: string;
};

export const NextPrayerCard = ({
    isLoading,
    error,
    times,
    now,
    title = "Next Prayer",
    actionLabel,
    onActionPress,
    footerText,
        footerActionLabel,
        onFooterActionPress,
    emptyStateText = "No prayer times available yet.",
}: NextPrayerCardProps) => {
    const nextPrayer = useMemo(() => {
        const nowMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
        const ordered = timeEntries
            .filter(({ key }) => mainPrayerKeys.includes(key) && Boolean(times[key]))
            .map((entry) => ({
                ...entry,
                minutes: parseTimeToMinutes(times[entry.key] ?? "") ?? 0,
            }))
            .sort((a, b) => a.minutes - b.minutes);

        if (!ordered.length) {
            return null;
        }

        const upcoming = ordered.find((entry) => entry.minutes > nowMinutes);
        return upcoming ?? ordered[0];
    }, [now, times]);

    return (
        <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>{title}</Text>
                {actionLabel && onActionPress ? (
                    <Pressable style={styles.seeMoreButton} onPress={onActionPress}>
                        <Text style={styles.seeMoreText}>{actionLabel}</Text>
                    </Pressable>
                ) : null}
            </View>
            {isLoading ? (
                <View style={styles.skeletonRow}>
                    <SkeletonCircle style={styles.skeletonIcon} />
                    <View style={styles.skeletonTextGroup}>
                        <SkeletonLine style={styles.skeletonLine} />
                        <SkeletonLine style={styles.skeletonLineShort} />
                    </View>
                </View>
            ) : error ? (
                <Text style={styles.statusText}>Unable to load prayer times.</Text>
            ) : nextPrayer ? (
                <View style={styles.nextPrayerCard}>
                    <View style={styles.nextPrayerRow}>
                        <Ionicons name={nextPrayer.icon} size={22} color={Colors.light.primary} />
                        <View style={styles.nextPrayerInfo}>
                            <Text style={styles.nextPrayerLabel}>{nextPrayer.label}</Text>
                            <Text style={styles.nextPrayerMeta}>Upcoming prayer</Text>
                        </View>
                        <Text style={styles.nextPrayerTime}>{times[nextPrayer.key]}</Text>
                    </View>
                </View>
            ) : (
                <Text style={styles.statusText}>{emptyStateText}</Text>
            )}
                    {footerText || (footerActionLabel && onFooterActionPress) ? (
                        <View style={styles.footerRow}>
                            {footerText ? <Text style={styles.footerText}>{footerText}</Text> : <View />}
                            {footerActionLabel && onFooterActionPress ? (
                                <Pressable style={styles.footerAction} onPress={onFooterActionPress}>
                                    <Text style={styles.footerActionText}>{footerActionLabel}</Text>
                                </Pressable>
                            ) : null}
                        </View>
                    ) : null}
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
    sectionHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    seeMoreButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: Theme.radius.pill,
        backgroundColor: Theme.colors.surfaceSoft,
    },
    seeMoreText: {
        fontSize: 12,
        fontWeight: "600",
        color: Colors.light.primary,
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    skeletonRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    skeletonIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    skeletonTextGroup: {
        flex: 1,
        gap: 8,
    },
    skeletonLine: {
        width: "70%",
        height: 12,
        borderRadius: 6,
    },
    skeletonLineShort: {
        width: "40%",
        height: 12,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 14,
        color: Colors.light.icon,
    },
    nextPrayerCard: {
        backgroundColor: Theme.colors.surfaceMuted,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        borderRadius: Theme.radius.md,
        padding: 14,
    },
    nextPrayerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    nextPrayerInfo: {
        flex: 1,
    },
    nextPrayerLabel: {
        fontSize: 15,
        fontWeight: "700",
        color: Colors.light.text,
    },
    nextPrayerMeta: {
        fontSize: 12,
        color: Colors.light.icon,
        marginTop: 4,
    },
    nextPrayerTime: {
        fontSize: 18,
        fontWeight: "700",
        color: Colors.light.text,
    },
    footerText: {
        marginTop: 10,
        fontSize: 13,
        fontWeight: "600",
        color: Colors.light.primary,
    },
        footerRow: {
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        footerAction: {
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: Theme.radius.pill,
            borderWidth: 1,
            borderColor: Theme.colors.border,
            backgroundColor: Theme.colors.surfaceMuted,
        },
        footerActionText: {
            fontSize: 12,
            fontWeight: "600",
            color: Colors.light.primary,
        },
});
