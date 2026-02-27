import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";

type QiblaCardProps = {
    degrees?: number;
    directionFrom?: string;
    distanceValue?: number;
    distanceUnit?: string;
};

export const QiblaCard = ({
    degrees,
    directionFrom,
    distanceValue,
    distanceUnit,
}: QiblaCardProps) => {
    const hasData =
        typeof degrees === "number" &&
        typeof distanceValue === "number" &&
        Boolean(distanceUnit) &&
        Boolean(directionFrom);

    return (
        <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Qibla Direction</Text>
            {hasData ? (
                <View style={styles.qiblaRow}>
                    <View style={styles.qiblaIconWrap}>
                        <Ionicons name="compass" size={30} color={Colors.light.primary} />
                    </View>
                    <View style={styles.qiblaInfo}>
                        <Text style={styles.qiblaValue}>
                            {degrees?.toFixed(1)}° from {directionFrom}
                        </Text>
                        <Text style={styles.qiblaSubValue}>
                            Distance: {distanceValue?.toFixed(1)} {distanceUnit}
                        </Text>
                    </View>
                </View>
            ) : (
                <Text style={styles.statusText}>Qibla details will appear once loaded.</Text>
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
    qiblaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: "#F3F4F6",
        borderRadius: 12,
        padding: 12,
    },
    qiblaIconWrap: {
        height: 52,
        width: 52,
        borderRadius: 26,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },
    qiblaInfo: {
        flex: 1,
    },
    qiblaValue: {
        fontSize: 15,
        fontWeight: "600",
        color: Colors.light.text,
    },
    qiblaSubValue: {
        fontSize: 13,
        color: Colors.light.icon,
        marginTop: 4,
    },
});
