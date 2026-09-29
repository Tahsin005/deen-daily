import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GlassCard } from "../glass/GlassCard";
import { Fonts } from "../../constants/Fonts";

type TodayFastingCardProps = {
    dateLabel?: string;
    hijriLabel?: string;
    sahur?: string;
    iftar?: string;
    duration?: string;
};

const parseTimeToDate = (value?: string) => {
    if (!value) return null;
    const trimmed = value.trim();
    const match = trimmed.match(/(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i);
    if (!match) return null;
    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const meridiem = match[3]?.toUpperCase();
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
    if (meridiem === "AM" && hours === 12) hours = 0;
    if (meridiem === "PM" && hours < 12) hours += 12;
    const target = new Date();
    target.setHours(hours, minutes, 0, 0);
    return target;
};

const formatRemaining = (diffMs: number) => {
    if (diffMs <= 0) return "00:00:00";
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
        <GlassCard style={styles.card}>
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.sectionCategory}>TODAY'S FAST</Text>
                    <Text style={styles.title}>Sahur & Iftar Schedule</Text>
                </View>
                {timeRemaining && remainingLabel ? (
                    <View style={styles.countdownBadge}>
                        <Ionicons name="hourglass-outline" size={12} color="#F2B50B" />
                        <Text style={styles.countdownText}>
                            {remainingLabel}: {timeRemaining}
                        </Text>
                    </View>
                ) : null}
            </View>

            <View style={styles.dateRow}>
                <Text style={styles.dateText}>{dateLabel ?? ""}</Text>
                {hijriLabel ? (
                    <>
                        <Text style={styles.dateDivider}>·</Text>
                        <Text style={[styles.dateText, { color: "#48A111" }]}>{hijriLabel}</Text>
                    </>
                ) : null}
            </View>

            {hasData ? (
                <View style={styles.fastingPanel}>
                    <View style={styles.timeColumn}>
                        <View style={styles.timeLabelRow}>
                            <Ionicons name="moon" size={16} color="#48A111" />
                            <Text style={styles.timeLabel}>Sahur (Dawn)</Text>
                        </View>
                        <Text style={styles.timeValue}>{sahur}</Text>
                    </View>

                    <View style={styles.centerDivider}>
                        {duration ? (
                            <View style={styles.durationBadge}>
                                <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                                <Text style={styles.durationText}>{duration}</Text>
                            </View>
                        ) : null}
                    </View>

                    <View style={styles.timeColumn}>
                        <View style={styles.timeLabelRow}>
                            <Ionicons name="sunny" size={16} color="#F2B50B" />
                            <Text style={styles.timeLabel}>Iftar (Sunset)</Text>
                        </View>
                        <Text style={styles.timeValue}>{iftar}</Text>
                    </View>
                </View>
            ) : (
                <Text style={styles.emptyText}>No fasting data available for today.</Text>
            )}
        </GlassCard>
    );
};

const styles = StyleSheet.create({
    card: {
        marginTop: 14,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 8,
    },
    sectionCategory: {
        fontSize: 10,
        fontWeight: "700",
        color: "#6B7280",
        letterSpacing: 1,
    },
    title: {
        fontSize: Fonts.size.xl,
        fontWeight: "700",
        color: "#F3F4F6",
        letterSpacing: -0.3,
    },
    countdownBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: "rgba(242, 181, 11, 0.15)",
        borderWidth: 1,
        borderColor: "rgba(242, 181, 11, 0.3)",
    },
    countdownText: {
        fontSize: Fonts.size.xxs,
        fontWeight: "700",
        color: "#FDE68A",
    },
    dateRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 4,
        marginBottom: 16,
    },
    dateText: {
        fontSize: Fonts.size.xs,
        color: "#9CA3AF",
    },
    dateDivider: {
        color: "rgba(255, 255, 255, 0.2)",
    },
    fastingPanel: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.08)",
        borderTopColor: "rgba(255, 255, 255, 0.15)",
    },
    timeColumn: {
        flex: 1,
        alignItems: "center",
    },
    timeLabelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 6,
    },
    timeLabel: {
        fontSize: Fonts.size.xs,
        fontWeight: "500",
        color: "#9CA3AF",
    },
    timeValue: {
        fontSize: Fonts.size.xxl,
        fontWeight: "700",
        color: "#F3F4F6",
    },
    centerDivider: {
        paddingHorizontal: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    durationBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        backgroundColor: "rgba(255, 255, 255, 0.06)",
    },
    durationText: {
        fontSize: Fonts.size.xxs,
        color: "#D1D5DB",
        fontWeight: "600",
    },
    emptyText: {
        fontSize: Fonts.size.sm,
        color: "#9CA3AF",
        textAlign: "center",
        paddingVertical: 14,
    },
});
export default TodayFastingCard;
