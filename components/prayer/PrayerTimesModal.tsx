import Ionicons from "@expo/vector-icons/Ionicons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { timeEntries } from "./prayerTimesUtils";

type PrayerTimesModalProps = {
    visible: boolean;
    onClose: () => void;
    times: Record<string, string>;
};

export const PrayerTimesModal = ({ visible, onClose, times }: PrayerTimesModalProps) => {
    const entries = timeEntries.filter(({ key }) => Boolean(times[key]));

    return (
        <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
            <Pressable style={styles.modalBackdrop} onPress={onClose}>
                <Pressable style={styles.modalCard} onPress={() => null}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Prayer Times</Text>
                        <Pressable onPress={onClose}>
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
    );
};

const styles = StyleSheet.create({
    statusText: {
        fontSize: 14,
        color: Colors.light.icon,
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
});
