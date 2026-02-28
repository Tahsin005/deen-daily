import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Theme } from "../../constants/Theme";
import { SkeletonLine } from "../common/Skeleton";

type FastingHeaderProps = {
    gregorianDay?: string;
    gregorianMonth?: string;
    readableDate?: string;
    hijriReadable?: string;
    weekdayLabel?: string;
    weekdayArabic?: string;
    timezoneLine?: string;
    statusMessage: string;
    isLoading: boolean;
    onRefresh: () => void;
};

export const FastingHeader = ({
    gregorianDay,
    gregorianMonth,
    readableDate,
    hijriReadable,
    weekdayLabel,
    weekdayArabic,
    timezoneLine,
    statusMessage,
    isLoading,
    onRefresh,
}: FastingHeaderProps) => {
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
                {isLoading ? <SkeletonLine style={styles.skeletonDot} /> : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerCard: {
    backgroundColor: Theme.colors.secondary,
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
    headerTimezoneText: {
        fontSize: 12,
        color: "rgba(255, 255, 255, 0.8)",
        flex: 1,
        marginRight: 10,
    },
    skeletonDot: {
        width: 28,
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
    },
});
