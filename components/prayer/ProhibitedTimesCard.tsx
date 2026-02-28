import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { Theme } from "../../constants/Theme";

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
                        { label: "Sunset", value: times.sunset, icon: "partly-sunny" as IconName },
                    ] as const).map((item) => (
                        <View key={item.label} style={styles.prohibitedCard}>
                            <View style={styles.cardTopRow}>
                                <View style={styles.iconBadge}>
                                    <Ionicons name={item.icon} size={16} color={Theme.colors.accent} />
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
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.radius.lg,
        borderWidth: 1,
        borderColor: Theme.colors.borderLight,
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
        backgroundColor: Theme.colors.surfaceAccent,
        borderRadius: Theme.radius.md,
        padding: 10,
        borderWidth: 1,
        borderColor: Theme.colors.accent,
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
        borderRadius: Theme.radius.md,
        backgroundColor: Theme.colors.surfaceAccent,
        alignItems: "center",
        justifyContent: "center",
    },
    prohibitedLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: Theme.colors.text,
        textAlign: "center",
    },
    timePill: {
        alignSelf: "center",
        backgroundColor: Theme.colors.surface,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: Theme.radius.pill,
        borderWidth: 1,
        borderColor: Theme.colors.accent,
    },
    prohibitedValue: {
        fontSize: 12,
        fontWeight: "600",
        color: Theme.colors.text,
        textAlign: "center",
    },
});
