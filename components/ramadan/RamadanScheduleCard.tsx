import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import { Fonts } from "../../constants/Fonts";
import { RamadanDay } from "../../lib/api/ramadan/getRamadanTimes";
import { GlassCard } from "../glass/GlassCard";

type RamadanScheduleCardProps = {
    days: RamadanDay[];
};

const formatDate = (value: string) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return value;
    }
    return parsed.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
    });
};

export const RamadanScheduleCard = ({ days }: RamadanScheduleCardProps) => {
    if (!days.length) {
        return null;
    }

    const today = new Date();
    const todayKey = today.toDateString();

    return (
        <GlassCard style={styles.card}>
            <View style={styles.headerRow}>
                <View style={styles.headerTitleRow}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="moon" size={16} color="#F2B50B" />
                    </View>
                    <View>
                        <Text style={styles.title}>Fasting Calendar</Text>
                        <Text style={styles.subtitle}>{days.length} Days Schedule</Text>
                    </View>
                </View>
            </View>

            <View style={styles.calendarGrid}>
                {days.map((day) => {
                    const dayKey = new Date(day.date).toDateString();
                    const isToday = dayKey === todayKey;
                    return (
                        <View
                            key={day.date}
                            style={[styles.calendarCell, isToday && styles.calendarCellToday]}
                        >
                            <View style={styles.cellHeader}>
                                <Text style={[styles.cellDay, isToday && styles.cellDayToday]}>
                                    {day.hijri_readable.split(" ")[0]}
                                </Text>
                                <Text style={styles.cellWeekday}>{day.day.slice(0, 3)}</Text>
                            </View>
                            <Text style={styles.cellDate}>{formatDate(day.date)}</Text>
                            <View style={styles.cellTimes}>
                                <View style={styles.cellTimeRow}>
                                    <Ionicons name="moon-outline" size={11} color="#86EFAC" />
                                    <Text style={styles.cellTimeText}>{day.time.sahur}</Text>
                                </View>
                                <View style={styles.cellTimeRow}>
                                    <Ionicons name="sunny-outline" size={11} color="#FDE68A" />
                                    <Text style={styles.cellTimeText}>{day.time.iftar}</Text>
                                </View>
                            </View>
                            {isToday ? (
                                <View style={styles.todayBadgeWrap}>
                                    <Text style={styles.todayBadgeText}>TODAY</Text>
                                </View>
                            ) : null}
                        </View>
                    );
                })}
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
        marginBottom: 14,
    },
    headerTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    iconCircle: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "rgba(242, 181, 11, 0.15)",
        borderWidth: 1,
        borderColor: "rgba(242, 181, 11, 0.3)",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: Fonts.size.lg,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    subtitle: {
        fontSize: Fonts.size.xs,
        color: "#9CA3AF",
        marginTop: 1,
    },
    calendarGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    calendarCell: {
        width: "31.5%",
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.07)",
        padding: 8,
    },
    calendarCellToday: {
        borderColor: "rgba(72, 161, 17, 0.7)",
        backgroundColor: "rgba(37, 103, 30, 0.25)",
    },
    cellHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 2,
    },
    cellDay: {
        fontSize: Fonts.size.sm,
        fontWeight: "700",
        color: "#F3F4F6",
    },
    cellDayToday: {
        color: "#86EFAC",
    },
    cellWeekday: {
        fontSize: Fonts.size.xxs,
        color: "#9CA3AF",
        fontWeight: "500",
    },
    cellDate: {
        fontSize: Fonts.size.xxs,
        color: "#6B7280",
        marginBottom: 6,
    },
    cellTimes: {
        gap: 4,
    },
    cellTimeRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    cellTimeText: {
        fontSize: Fonts.size.xxs,
        fontWeight: "600",
        color: "#E5E7EB",
    },
    todayBadgeWrap: {
        marginTop: 6,
        paddingVertical: 2,
        borderRadius: 6,
        backgroundColor: "rgba(72, 161, 17, 0.3)",
        alignItems: "center",
    },
    todayBadgeText: {
        fontSize: 9,
        fontWeight: "700",
        color: "#86EFAC",
        letterSpacing: 0.5,
    },
});
