import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";

type WhiteDays = {
    status?: string;
    days?: {
        "13th"?: string;
        "14th"?: string;
        "15th"?: string;
    };
};

type WhiteDaysCardProps = {
    whiteDays?: WhiteDays;
};

const dayLabels = [
    { key: "13th", label: "13th", color: "#DBEAFE" },
    { key: "14th", label: "14th", color: "#DCFCE7" },
    { key: "15th", label: "15th", color: "#FEF3C7" },
] as const;

const formatReadableDate = (value?: string) => {
    if (!value) {
        return "";
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return value;
    }
    return parsed.toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const formatMonthLabel = (value?: string) => {
    if (!value) {
        return "";
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return value;
    }
    return parsed.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
    });
};

export const WhiteDaysCard = ({ whiteDays }: WhiteDaysCardProps) => {
    const days = whiteDays?.days;
    const hasDays = Boolean(days?.["13th"] || days?.["14th"] || days?.["15th"]);
    const monthLabel = formatMonthLabel(days?.["13th"] ?? days?.["14th"] ?? days?.["15th"]);

    if (!hasDays) {
        return null;
    }

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <View style={styles.headerTitleRow}>
                    <Ionicons name="calendar" size={18} color={Colors.light.primary} />
                    <Text style={styles.title}>White Days</Text>
                </View>
                {monthLabel ? <Text style={styles.monthLabel}>{monthLabel}</Text> : null}
            </View>

            <View style={styles.listCard}>
                {dayLabels.map((item) => {
                    const dateValue = days?.[item.key];
                    if (!dateValue) {
                        return null;
                    }
                    return (
                        <View key={item.key} style={styles.dayRow}>
                            <View style={[styles.dayBadge, { backgroundColor: item.color }]}>
                                <Text style={styles.dayBadgeText}>{item.label}</Text>
                            </View>
                            <Text style={styles.dayInfoText}>{formatReadableDate(dateValue)}</Text>
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
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#F0F0F0",
        padding: 16,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    headerTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        color: Colors.light.text,
    },
    monthLabel: {
        fontSize: 12,
        color: Colors.light.icon,
    },
    listCard: {
        backgroundColor: "#F8FAFC",
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        gap: 10,
    },
    dayRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    dayBadge: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    dayBadgeText: {
        fontSize: 13,
        fontWeight: "700",
        color: Colors.light.text,
    },
    dayInfoText: {
        flex: 1,
        fontSize: 13,
        color: Colors.light.text,
    },
});
