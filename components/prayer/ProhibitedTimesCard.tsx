import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";

export type ProhibitedTimes = {
    sunrise: { start: string; end: string };
    noon: { start: string; end: string };
    sunset: { start: string; end: string };
};

type ProhibitedTimesCardProps = {
    times?: ProhibitedTimes;
};

export const ProhibitedTimesCard = ({ times }: ProhibitedTimesCardProps) => {
    return (
        <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Prohibited Times</Text>
            {times ? (
                <View style={styles.prohibitedList}>
                {([
                    { label: "Sunrise", value: times.sunrise },
                    { label: "Noon", value: times.noon },
                    { label: "Sunset", value: times.sunset },
                ] as const).map((item) => (
                    <View key={item.label} style={styles.prohibitedRow}>
                        <Ionicons name="warning" size={18} color="#F97316" />
                        <Text style={styles.prohibitedLabel}>{item.label}</Text>
                        <Text style={styles.prohibitedValue}>
                            {item.value.start} - {item.value.end}
                        </Text>
                    </View>
                ))}
                </View>
            ) : (
                <Text style={styles.statusText}>Prohibited times will appear once loaded.</Text>
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
    statusText: {
        fontSize: 14,
        color: Colors.light.icon,
    },
    prohibitedList: {
        gap: 10,
    },
    prohibitedRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#FFF7ED",
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    prohibitedLabel: {
        flex: 1,
        fontSize: 13,
        fontWeight: "600",
        color: "#9A3412",
    },
    prohibitedValue: {
        fontSize: 13,
        fontWeight: "600",
        color: "#9A3412",
    },
});
