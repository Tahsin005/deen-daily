import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";

type IconName = keyof typeof Ionicons.glyphMap;

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
            <View style={styles.headerRow}>
                <View style={styles.headerTitleRow}>
                    <Text style={styles.sectionTitle}>Prohibited Times</Text>
                </View>
                <Text style={styles.headerHint}>Avoid praying</Text>
            </View>
            {times ? (
                <View style={styles.prohibitedGrid}>
                    {([
                        { label: "Sunrise", value: times.sunrise, icon: "sunny" as IconName },
                        { label: "Noon", value: times.noon, icon: "sunny-outline" as IconName },
                        { label: "Sunset", value: times.sunset, icon: "sunset" as IconName },
                    ] as const).map((item) => (
                        <View key={item.label} style={styles.prohibitedCard}>
                            <View style={styles.cardTopRow}>
                                <View style={styles.iconBadge}>
                                    <Ionicons name={item.icon} size={16} color="#F97316" />
                                </View>
                                <Text style={styles.prohibitedLabel}>{item.label}</Text>
                            </View>
                            <View style={styles.timePill}>
                                <Text style={styles.prohibitedValue}>
                                    {item.value.start} - {item.value.end}
                                </Text>
                            </View>
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
        marginTop: 12,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#F0F0F0",
        padding: 12,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    headerTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    headerHint: {
        fontSize: 10,
        color: Colors.light.icon,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: Colors.light.text,
    },
    statusText: {
        fontSize: 12,
        color: Colors.light.icon,
    },
    prohibitedGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 8,
    },
    prohibitedCard: {
        flex: 1,
        backgroundColor: "#FFF7ED",
        borderRadius: 12,
        padding: 10,
        borderWidth: 1,
        borderColor: "#FED7AA",
    },
    cardTopRow: {
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        marginBottom: 6,
    },
    iconBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#FFEDD5",
        alignItems: "center",
        justifyContent: "center",
    },
    prohibitedLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: "#9A3412",
        textAlign: "center",
    },
    timePill: {
        alignSelf: "center",
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#FECACA",
    },
    prohibitedValue: {
        fontSize: 12,
        fontWeight: "600",
        color: "#9A3412",
        textAlign: "center",
    },
});
