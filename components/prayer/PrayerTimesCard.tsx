import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { timeEntries } from "./prayerTimesUtils";

type PrayerTimesCardProps = {
    isLoading: boolean;
    error?: Error | null;
    times: Record<string, string>;
};


export const PrayerTimesCard = ({ isLoading, error, times }: PrayerTimesCardProps) => {
    const entries = useMemo(
        () => timeEntries.filter(({ key }) => Boolean(times[key])),
        [times]
    );

    return (
        <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Today’s prayer times</Text>
            {isLoading ? (
                <View style={styles.statusRow}>
                    <ActivityIndicator color={Colors.light.primary} />
                    <Text style={styles.statusText}>Loading prayer times...</Text>
                </View>
            ) : error ? (
                <Text style={styles.statusText}>Unable to load prayer times.</Text>
            ) : entries.length ? (
                <View style={styles.timesGrid}>
                    {entries.map(({ key, label, icon }) => (
                        <View key={key} style={styles.timeItem}>
                            <View style={styles.timeLabelRow}>
                                <Ionicons name={icon} size={18} color={Colors.light.primary} />
                                <Text style={styles.timeLabel}>{label}</Text>
                            </View>
                            <Text style={styles.timeValue}>{times[key]}</Text>
                        </View>
                    ))}
                </View>
            ) : (
                <Text style={styles.statusText}>No prayer times available yet.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    sectionCard: {
        marginTop: 16,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#F0F0F0",
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: Colors.light.text,
        marginBottom: 12,
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    statusText: {
        fontSize: 14,
        color: Colors.light.icon,
    },
    timeItem: {
        width: "48%",
        borderRadius: 12,
        backgroundColor: "#F9FAFB",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    timeLabelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 6,
    },
    timeLabel: {
        fontSize: 12,
        color: Colors.light.icon,
    },
    timeValue: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.light.text,
    },
    timesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
});
