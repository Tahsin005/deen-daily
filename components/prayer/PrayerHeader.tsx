import Ionicons from "@expo/vector-icons/Ionicons";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

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
}: PrayerHeaderProps) => {
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
                    <Ionicons name="locate" size={18} color="#FFFFFF" />
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
                    {isLoading ? <ActivityIndicator color="#FFFFFF" size="small" /> : null}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerCard: {
        backgroundColor: "#4B9B7D",
        borderRadius: 22,
        padding: 16,
        shadowColor: "#1F2937",
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
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 6,
    },
    dateBadgeDay: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1F2937",
        lineHeight: 24,
    },
    dateBadgeMonth: {
        fontSize: 11,
        fontWeight: "600",
        color: "#6B7280",
    },
    headerTextWrap: {
        flex: 1,
    },
    headerClockWrap: {
        alignItems: "flex-end",
    },
    headerClockLabel: {
        fontSize: 10,
        color: "#E4F4EC",
    },
    headerClockValue: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FFFFFF",
        marginTop: 2,
    },
    headerDateText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    headerHijriText: {
        fontSize: 13,
        color: "#E4F4EC",
        marginTop: 4,
    },
    headerWeekdayText: {
        fontSize: 12,
        color: "#D1FAE5",
        marginTop: 2,
    },
    headerRefreshButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 999,
    },
    headerRefreshText: {
        color: "#FFFFFF",
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
        color: "#E4F4EC",
        flex: 1,
        marginRight: 10,
    },
});
