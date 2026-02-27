import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo, useState } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";

type IconName = keyof typeof Ionicons.glyphMap;

type PrayerTimesCardProps = {
    isLoading: boolean;
    error?: Error | null;
    times: Record<string, string>;
    now: Date;
};

const timeEntries = [
    { key: "Fajr", label: "Fajr", icon: "moon" as IconName },
    { key: "Imsak", label: "Imsak", icon: "moon-outline" as IconName },
    { key: "Sunrise", label: "Sunrise", icon: "sunny" as IconName },
    { key: "Dhuhr", label: "Dhuhr", icon: "sunny-outline" as IconName },
    { key: "Asr", label: "Asr", icon: "partly-sunny" as IconName },
    { key: "Maghrib", label: "Maghrib", icon: "sunset" as IconName },
    { key: "Isha", label: "Isha", icon: "moon" as IconName },
    { key: "Midnight", label: "Midnight", icon: "moon" as IconName },
    { key: "Firstthird", label: "1st Third", icon: "moon-outline" as IconName },
    { key: "Lastthird", label: "Last Third", icon: "moon-outline" as IconName },
] as { key: string; label: string; icon: IconName }[];

const mainPrayerKeys = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

const parseTimeToMinutes = (value: string | undefined) => {
    if (!value) {
        return null;
    }
    const trimmed = value.trim();
    const timeMatch = trimmed.match(/(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i);
    if (!timeMatch) {
        return null;
    }
    const hoursRaw = Number(timeMatch[1]);
    const minutes = Number(timeMatch[2]);
    const meridiem = timeMatch[3]?.toUpperCase();
    if (Number.isNaN(hoursRaw) || Number.isNaN(minutes)) {
        return null;
    }
    let hours = hoursRaw;
    if (meridiem === "AM" && hours === 12) {
        hours = 0;
    }
    if (meridiem === "PM" && hours < 12) {
        hours += 12;
    }
    return hours * 60 + minutes;
};

export const PrayerTimesCard = ({ isLoading, error, times, now }: PrayerTimesCardProps) => {
    const [modalOpen, setModalOpen] = useState(false);

    const entries = useMemo(
        () => timeEntries.filter(({ key }) => Boolean(times[key])),
        [times]
    );

    const nextPrayer = useMemo(() => {
        const nowMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
        const ordered = timeEntries
            .filter(({ key }) => mainPrayerKeys.includes(key) && Boolean(times[key]))
            .map((entry) => ({
                ...entry,
                minutes: parseTimeToMinutes(times[entry.key] ?? "") ?? 0,
            }))
            .sort((a, b) => a.minutes - b.minutes);

        if (!ordered.length) {
            return null;
        }

        const upcoming = ordered.find((entry) => entry.minutes > nowMinutes);
        return upcoming ?? ordered[0];
    }, [now, times]);

    return (
        <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Next Prayer</Text>
                <Pressable style={styles.seeMoreButton} onPress={() => setModalOpen(true)}>
                    <Text style={styles.seeMoreText}>See more</Text>
                </Pressable>
            </View>
            {isLoading ? (
                <View style={styles.statusRow}>
                    <ActivityIndicator color={Colors.light.primary} />
                    <Text style={styles.statusText}>Loading prayer times...</Text>
                </View>
            ) : error ? (
                <Text style={styles.statusText}>Unable to load prayer times.</Text>
            ) : nextPrayer ? (
                <View style={styles.nextPrayerCard}>
                    <View style={styles.nextPrayerRow}>
                        <Ionicons name={nextPrayer.icon} size={22} color={Colors.light.primary} />
                        <View style={styles.nextPrayerInfo}>
                            <Text style={styles.nextPrayerLabel}>{nextPrayer.label}</Text>
                            <Text style={styles.nextPrayerMeta}>Upcoming prayer</Text>
                        </View>
                        <Text style={styles.nextPrayerTime}>{times[nextPrayer.key]}</Text>
                    </View>
                </View>
            ) : (
                <Text style={styles.statusText}>No prayer times available yet.</Text>
            )}

            <Modal
                visible={modalOpen}
                animationType="fade"
                transparent
                onRequestClose={() => setModalOpen(false)}
            >
                <Pressable style={styles.modalBackdrop} onPress={() => setModalOpen(false)}>
                    <Pressable style={styles.modalCard} onPress={() => null}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Prayer Times</Text>
                            <Pressable onPress={() => setModalOpen(false)}>
                                <Text style={styles.modalCloseText}>Close</Text>
                            </Pressable>
                        </View>
                        {entries.length ? (
                            <View style={styles.modalGrid}>
                                {entries.map(({ key, label, icon }) => (
                                    <View key={key} style={styles.modalItem}>
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
                    </Pressable>
                </Pressable>
            </Modal>
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
    sectionHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    seeMoreButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: "#EEF2FF",
    },
    seeMoreText: {
        fontSize: 12,
        fontWeight: "600",
        color: Colors.light.primary,
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
    timesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    nextPrayerCard: {
        backgroundColor: "#F9FAFB",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 14,
        padding: 14,
    },
    nextPrayerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    nextPrayerInfo: {
        flex: 1,
    },
    nextPrayerLabel: {
        fontSize: 15,
        fontWeight: "700",
        color: Colors.light.text,
    },
    nextPrayerMeta: {
        fontSize: 12,
        color: Colors.light.icon,
        marginTop: 4,
    },
    nextPrayerTime: {
        fontSize: 18,
        fontWeight: "700",
        color: Colors.light.text,
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
    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(15, 23, 42, 0.45)",
        justifyContent: "center",
        paddingHorizontal: 16,
    },
    modalCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 18,
        maxHeight: "85%",
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: Colors.light.text,
    },
    modalCloseText: {
        fontSize: 13,
        fontWeight: "600",
        color: Colors.light.primary,
    },
    modalGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    modalItem: {
        width: "48%",
        borderRadius: 12,
        backgroundColor: "#F9FAFB",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
});
