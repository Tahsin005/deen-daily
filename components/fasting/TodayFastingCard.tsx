import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";

type TodayFastingCardProps = {
    dateLabel?: string;
    hijriLabel?: string;
    sahur?: string;
    iftar?: string;
    duration?: string;
};

export const TodayFastingCard = ({
    dateLabel,
    hijriLabel,
    sahur,
    iftar,
    duration,
}: TodayFastingCardProps) => {
    const hasData = Boolean(sahur && iftar);

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
                            <Ionicons name="moon" size={18} color="#3B82F6" />
                            <Text style={styles.timeLabel}>Sahur</Text>
                        </View>
                        <Text style={styles.timeValue}>{sahur}</Text>
                    </View>

                    <View style={styles.centerColumn}>
                        <View style={styles.durationBadge}>
                            <Ionicons name="time" size={18} color={Colors.light.primary} />
                            <Text style={styles.durationText}>{duration ?? ""}</Text>
                        </View>
                    </View>

                    <View style={styles.timeColumn}>
                        <View style={styles.timeLabelRow}>
                            <Ionicons name="sunny" size={18} color="#F59E0B" />
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
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#F0F0F0",
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
        backgroundColor: "#F8FAFC",
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
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
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    durationText: {
        fontSize: 12,
        fontWeight: "600",
        color: Colors.light.text,
    },
    emptyText: {
        fontSize: 13,
        color: Colors.light.icon,
    },
});
