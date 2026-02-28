import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Theme } from "../../constants/Theme";
import { SkeletonLine } from "../common/Skeleton";

type PrayerHeaderProps = {
    gregorianDay?: string;
    gregorianMonth?: string;
    readableDate?: string;
    hijriReadable?: string;
    weekdayLabel?: string;
    weekdayArabic?: string;
    timezoneLine?: string;
    statusMessage: string;
    formattedTime: string;
    isLoading: boolean;
    onRefresh: () => void;
    qiblaDegrees?: number;
    qiblaDirectionFrom?: string;
    qiblaDistanceValue?: number;
    qiblaDistanceUnit?: string;
};

export const PrayerHeader = ({
    gregorianDay,
    gregorianMonth,
    readableDate,
    hijriReadable,
    weekdayLabel,
    weekdayArabic,
    timezoneLine,
    statusMessage,
    formattedTime,
    isLoading,
    onRefresh,
    qiblaDegrees,
    qiblaDirectionFrom,
    qiblaDistanceValue,
    qiblaDistanceUnit,
}: PrayerHeaderProps) => {
    const hasQibla =
        typeof qiblaDegrees === "number" &&
        typeof qiblaDistanceValue === "number" &&
        Boolean(qiblaDirectionFrom) &&
        Boolean(qiblaDistanceUnit);

    return (
        <View style={styles.headerCard}>
            <View style={styles.headerTopRow}>
                <View style={styles.dateBadge}>
                    <Text style={styles.dateBadgeDay}>{gregorianDay ?? "--"}</Text>
                    <Text style={styles.dateBadgeMonth}>{gregorianMonth ?? ""}</Text>
                </View>
                <View style={styles.headerTextWrap}>
                    <Text style={styles.headerDateText}>{readableDate ?? "Loading..."}</Text>
                    <Text style={styles.headerHijriText}>{hijriReadable || "Hijri date"}</Text>
                    <Text style={styles.headerWeekdayText}>
                        {weekdayLabel} {weekdayArabic ? `| ${weekdayArabic}` : ""}
                    </Text>
                </View>
            
                <Pressable style={styles.headerRefreshButton} onPress={onRefresh}>
                    <Ionicons name="locate" size={18} color={Theme.colors.onPrimary} />
                    <Text style={styles.headerRefreshText}>Update</Text>
                </Pressable>
            </View>
            <View style={styles.headerTimezoneRow}>
                <Text style={styles.headerTimezoneText}>{timezoneLine || statusMessage}</Text>
                <View style={styles.headerTimezoneRight}>
                    <View style={styles.headerClockWrap}>
                        <Text style={styles.headerClockLabel}>Now</Text>
                        <Text style={styles.headerClockValue}>{formattedTime}</Text>
                    </View>
                    {isLoading ? <SkeletonLine style={styles.skeletonDot} /> : null}
                </View>
            </View>
            {hasQibla ? (
                <View style={styles.headerQiblaRow}>
                    <Ionicons name="compass" size={16} color="rgba(255, 255, 255, 0.85)" />
                    <Text style={styles.headerQiblaText}>
                        {qiblaDegrees?.toFixed(1)}° from {qiblaDirectionFrom}
                    </Text>
                    <Text style={styles.headerQiblaText}>·</Text>
                    <Text style={styles.headerQiblaText}>
                        {qiblaDistanceValue?.toFixed(1)} {qiblaDistanceUnit}
                    </Text>
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    headerCard: {
    backgroundColor: "#097969",
        borderRadius: Theme.radius.xl,
        padding: 16,
        shadowColor: Theme.colors.text,
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 2,
    },
    headerTopRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    dateBadge: {
        width: 58,
        borderRadius: Theme.radius.md,
        backgroundColor: Theme.colors.surface,
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 6,
    },
    dateBadgeDay: {
        fontSize: 20,
        fontWeight: "700",
        color: Theme.colors.text,
        lineHeight: 24,
    },
    dateBadgeMonth: {
        fontSize: 11,
        fontWeight: "600",
        color: Theme.colors.textMuted,
    },
    headerTextWrap: {
        flex: 1,
    },
    headerClockWrap: {
        alignItems: "flex-end",
    },
    headerClockLabel: {
        fontSize: 10,
        color: "rgba(255, 255, 255, 0.8)",
    },
    headerClockValue: {
        fontSize: 16,
        fontWeight: "700",
        color: Theme.colors.onPrimary,
        marginTop: 2,
    },
    headerDateText: {
        fontSize: 16,
        fontWeight: "700",
        color: Theme.colors.onPrimary,
    },
    headerHijriText: {
        fontSize: 13,
        color: "rgba(255, 255, 255, 0.85)",
        marginTop: 4,
    },
    headerWeekdayText: {
        fontSize: 12,
        color: "rgba(255, 255, 255, 0.85)",
        marginTop: 2,
    },
    headerRefreshButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: Theme.radius.pill,
    },
    headerRefreshText: {
        color: Theme.colors.onPrimary,
        fontSize: 12,
        fontWeight: "600",
    },
    headerTimezoneRow: {
        marginTop: 14,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.2)",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTimezoneRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    headerTimezoneText: {
        fontSize: 12,
        color: "rgba(255, 255, 255, 0.8)",
        flex: 1,
        marginRight: 10,
    },
    headerQiblaRow: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.2)",
    },
    headerQiblaText: {
        fontSize: 11,
        color: "rgba(255, 255, 255, 0.8)",
    },
    skeletonDot: {
        width: 28,
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
    },
});
