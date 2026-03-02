import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { Theme } from "../../constants/Theme";

type TodayFastingCardProps = {
    dateLabel?: string;
    hijriLabel?: string;
    sahur?: string;
    iftar?: string;
    duration?: string;
};

const parseTimeToDate = (value?: string) => {
    if (!value) {
        return null;
    }
    const trimmed = value.trim();
    const match = trimmed.match(/(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i);
    if (!match) {
        return null;
    }
    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const meridiem = match[3]?.toUpperCase();
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
        return null;
    }
    if (meridiem === "AM" && hours === 12) {
        hours = 0;
    }
    if (meridiem === "PM" && hours < 12) {
        hours += 12;
    }
    const target = new Date();
    target.setHours(hours, minutes, 0, 0);
    return target;
};

const formatRemaining = (diffMs: number) => {
    if (diffMs <= 0) {
        return "00:00:00";
    }
    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export const TodayFastingCard = ({
    dateLabel,
    hijriLabel,
    sahur,
    iftar,
    duration,
}: TodayFastingCardProps) => {
    const hasData = Boolean(sahur && iftar);
    const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
    const [remainingLabel, setRemainingLabel] = useState<string | null>(null);
    const iftarTime = useMemo(() => parseTimeToDate(iftar), [iftar]);
    const sahurTime = useMemo(() => parseTimeToDate(sahur), [sahur]);

    useEffect(() => {
        if (!hasData || !iftarTime || !sahurTime) {
            setTimeRemaining(null);
            setRemainingLabel(null);
            return;
        }

        const updateRemaining = () => {
            const now = new Date();
            let target = iftarTime;
            let label = "Time remaining";

            if (now.getTime() < sahurTime.getTime()) {
                target = sahurTime;
                label = "Starts in";
            } else if (now.getTime() >= iftarTime.getTime()) {
                const nextSahur = new Date(sahurTime);
                nextSahur.setDate(nextSahur.getDate() + 1);
                target = nextSahur;
                label = "Starts in";
            }

            setRemainingLabel(label);
            setTimeRemaining(formatRemaining(target.getTime() - now.getTime()));
        };

        updateRemaining();
        const interval = setInterval(updateRemaining, 1000);
        return () => clearInterval(interval);
    }, [hasData, iftarTime, sahurTime]);

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Today’s Fasting</Text>
            <View style={styles.dateRow}>
                <Text style={styles.dateText}>{dateLabel ?? ""}</Text>
                <Text style={styles.dateDivider}>|</Text>
                <Text style={styles.dateText}>{hijriLabel ?? ""}</Text>
            </View>

            {hasData ? (
                <View style={styles.fastingPanel}>
                    <View style={styles.timeColumn}>
                        <View style={styles.timeLabelRow}>
                            <Ionicons name="moon" size={18} color={Theme.colors.primary} />
                            <Text style={styles.timeLabel}>Sahur</Text>
                        </View>
                        <Text style={styles.timeValue}>{sahur}</Text>
                    </View>

                    <View style={styles.centerColumn}>
                        <View style={styles.durationBadge}>
                            <Ionicons name="time" size={18} color={Colors.light.primary} />
                            <Text style={styles.durationText}>{duration ?? ""}</Text>
                        </View>
                        {timeRemaining && remainingLabel ? (
                            <Text style={styles.remainingText}>
                                {remainingLabel}: {timeRemaining}
                            </Text>
                        ) : null}
                    </View>

                    <View style={styles.timeColumn}>
                        <View style={styles.timeLabelRow}>
                            <Ionicons name="sunny" size={18} color={Theme.colors.accent} />
                            <Text style={styles.timeLabel}>Iftar</Text>
                        </View>
                        <Text style={styles.timeValue}>{iftar}</Text>
                    </View>
                </View>
            ) : (
                <Text style={styles.emptyText}>No fasting data available for today.</Text>
            )}
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
    title: {
        fontSize: 16,
        fontWeight: "700",
        color: Colors.light.text,
        marginBottom: 10,
    },
    dateRow: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 6,
        marginBottom: 12,
    },
    dateText: {
        fontSize: 13,
        color: Colors.light.text,
    },
    dateDivider: {
        color: Colors.light.icon,
    },
    fastingPanel: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: Theme.colors.surfaceMuted,
        borderRadius: Theme.radius.md,
        padding: 12,
        borderWidth: 1,
        borderColor: Theme.colors.border,
    },
    timeColumn: {
        alignItems: "center",
        flex: 1,
        gap: 6,
    },
    timeLabelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    timeLabel: {
        fontSize: 12,
        color: Colors.light.icon,
    },
    timeValue: {
        fontSize: 18,
        fontWeight: "700",
        color: Colors.light.text,
    },
    centerColumn: {
        alignItems: "center",
        flex: 1,
    },
    durationBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: Theme.colors.surface,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: Theme.radius.pill,
        borderWidth: 1,
        borderColor: Theme.colors.border,
    },
    durationText: {
        fontSize: 12,
        fontWeight: "600",
        color: Colors.light.text,
    },
    remainingText: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: "600",
        color: Colors.light.icon,
        textAlign: "center",
    },
    emptyText: {
        fontSize: 13,
        color: Colors.light.icon,
    },
});
