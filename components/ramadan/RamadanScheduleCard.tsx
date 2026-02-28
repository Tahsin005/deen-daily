import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { Theme } from "../../constants/Theme";
import { RamadanDay } from "../../lib/api/ramadan/getRamadanTimes";

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
        year: "numeric",
    });
};

export const RamadanScheduleCard = ({ days }: RamadanScheduleCardProps) => {
    if (!days.length) {
        return null;
    }

    const today = new Date();
    const todayKey = today.toDateString();

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Fasting Schedule</Text>
                <Text style={styles.subtitle}>Today · {days.length} days</Text>
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
                            <Text style={styles.cellDay}>{day.hijri_readable.split(" ")[0]}</Text>
                            <Text style={styles.cellWeekday}>{day.day}</Text>
                        </View>
                        <Text style={styles.cellDate}>{formatDate(day.date)}</Text>
                        <View style={styles.cellTimes}>
                            <View style={styles.cellTimeRow}>
                                <Ionicons name="moon" size={12} color={Theme.colors.primary} />
                                <Text style={styles.cellTimeText}>{day.time.sahur}</Text>
                            </View>
                            <View style={styles.cellTimeRow}>
                                <Ionicons name="sunny" size={12} color={Theme.colors.accent} />
                                <Text style={styles.cellTimeText}>{day.time.iftar}</Text>
                            </View>
                        </View>
                        {isToday ? <Text style={styles.todayBadge}>Today</Text> : null}
                    </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginTop: 16,
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.radius.lg,
        borderWidth: 1,
        borderColor: Theme.colors.borderLight,
        padding: 16,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        color: Colors.light.text,
    },
    subtitle: {
        fontSize: 12,
        color: Colors.light.icon,
    },
    calendarGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    calendarCell: {
        width: "31%",
        backgroundColor: Theme.colors.surfaceMuted,
        borderRadius: Theme.radius.md,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        padding: 8,
    },
    calendarCellToday: {
        borderColor: Colors.light.primary,
        backgroundColor: Theme.colors.surfaceSoft,
    },
    cellHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    cellDay: {
        fontSize: 13,
        fontWeight: "700",
        color: Colors.light.text,
    },
    cellWeekday: {
        fontSize: 10,
        color: Colors.light.icon,
    },
    cellDate: {
        fontSize: 10,
        color: Colors.light.icon,
        marginBottom: 8,
    },
    cellTimes: {
        gap: 6,
    },
    cellTimeRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    cellTimeText: {
        fontSize: 11,
        fontWeight: "600",
        color: Colors.light.text,
    },
    todayBadge: {
        marginTop: 6,
        fontSize: 10,
        fontWeight: "700",
        color: Colors.light.primary,
        textAlign: "center",
    },
});
