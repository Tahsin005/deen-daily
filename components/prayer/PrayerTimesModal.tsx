import Ionicons from "@expo/vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Fonts } from "../../constants/Fonts";
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
                <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
                <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>

                    <View style={styles.topRimLight} pointerEvents="none" />

                    <View style={styles.modalHeader}>
                        <View>
                            <Text style={styles.modalTitle}>Prayer Times</Text>
                            <Text style={styles.modalSubtitle}>Today's schedule</Text>
                        </View>
                        <Pressable onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={20} color="#9CA3AF" />
                        </Pressable>
                    </View>

                    {entries.length ? (
                        <View style={styles.modalGrid}>
                            {entries.map(({ key, label, icon }) => (
                                <View key={key} style={styles.modalItem}>
                                    <View style={styles.timeLabelRow}>
                                        <Ionicons name={icon} size={16} color="#48A111" />
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
    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    modalCard: {
        width: "100%",
        maxWidth: 380,
        backgroundColor: "rgba(22, 28, 24, 0.92)",
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.12)",
        borderTopColor: "rgba(255, 255, 255, 0.25)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.6,
        shadowRadius: 28,
        elevation: 10,
        position: "relative",
    },
    topRimLight: {
        position: "absolute",
        top: 0,
        left: 24,
        right: 24,
        height: 1,
        backgroundColor: "rgba(255, 255, 255, 0.25)",
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: Fonts.size.xl,
        fontWeight: "700",
        color: "#F3F4F6",
    },
    modalSubtitle: {
        fontSize: Fonts.size.xs,
        color: "#9CA3AF",
        marginTop: 2,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        alignItems: "center",
        justifyContent: "center",
    },
    modalGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    modalItem: {
        width: "48%",
        borderRadius: 14,
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.08)",
        borderTopColor: "rgba(255, 255, 255, 0.15)",
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    timeLabelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 4,
    },
    timeLabel: {
        fontSize: Fonts.size.xs,
        color: "#9CA3AF",
        fontWeight: "500",
    },
    timeValue: {
        fontSize: Fonts.size.lg,
        fontWeight: "700",
        color: "#F3F4F6",
    },
    statusText: {
        fontSize: Fonts.size.text,
        color: "#9CA3AF",
        textAlign: "center",
        paddingVertical: 20,
    },
});
export default PrayerTimesModal;
