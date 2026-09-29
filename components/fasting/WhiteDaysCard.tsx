import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import { Fonts } from "../../constants/Fonts";
import { GlassCard } from "../glass/GlassCard";

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
    { key: "13th", label: "13th", color: "rgba(37, 103, 30, 0.4)", text: "#86EFAC" },
    { key: "14th", label: "14th", color: "rgba(72, 161, 17, 0.4)", text: "#BBF7D0" },
    { key: "15th", label: "15th", color: "rgba(242, 181, 11, 0.35)", text: "#FDE68A" },
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
        <GlassCard style={styles.card}>
            <View style={styles.headerRow}>
                <View style={styles.headerTitleRow}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="calendar" size={16} color="#86EFAC" />
                    </View>
                    <View>
                        <Text style={styles.title}>White Days</Text>
                        <Text style={styles.sunnahBadge}>Sunnah Fasting</Text>
                    </View>
                </View>
                {monthLabel ? <Text style={styles.monthLabel}>{monthLabel}</Text> : null}
            </View>

            <View style={styles.listContainer}>
                {dayLabels.map((item) => {
                    const dateValue = days?.[item.key];
                    if (!dateValue) {
                        return null;
                    }
                    return (
                        <View key={item.key} style={styles.dayRow}>
                            <View style={[styles.dayBadge, { backgroundColor: item.color }]}>
                                <Text style={[styles.dayBadgeText, { color: item.text }]}>{item.label}</Text>
                            </View>
                            <View style={styles.dayInfoWrap}>
                                <Text style={styles.dayInfoText}>{formatReadableDate(dateValue)}</Text>
                                <Text style={styles.daySubText}>Hijri 13-15 Fasting</Text>
                            </View>
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
        backgroundColor: "rgba(37, 103, 30, 0.3)",
        borderWidth: 1,
        borderColor: "rgba(72, 161, 17, 0.4)",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: Fonts.size.lg,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    sunnahBadge: {
        fontSize: Fonts.size.xxs,
        color: "#FDE68A",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    monthLabel: {
        fontSize: Fonts.size.xs,
        color: "#9CA3AF",
        fontWeight: "500",
    },
    listContainer: {
        gap: 10,
    },
    dayRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        borderRadius: 14,
        padding: 10,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.07)",
    },
    dayBadge: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    dayBadgeText: {
        fontSize: Fonts.size.sm,
        fontWeight: "700",
    },
    dayInfoWrap: {
        flex: 1,
    },
    dayInfoText: {
        fontSize: Fonts.size.sm,
        fontWeight: "600",
        color: "#F3F4F6",
    },
    daySubText: {
        fontSize: Fonts.size.xs,
        color: "#9CA3AF",
        marginTop: 2,
    },
});
