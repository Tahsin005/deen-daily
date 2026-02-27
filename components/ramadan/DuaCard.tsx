import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";

type DuaCardProps = {
    title?: string;
    arabic?: string;
    translation?: string;
    reference?: string;
};

export const DuaCard = ({ title, arabic, translation, reference }: DuaCardProps) => {
    if (!title && !arabic && !translation) {
        return null;
    }

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <Ionicons name="book" size={18} color={Colors.light.primary} />
                <Text style={styles.headerText}>Dua of the Day</Text>
            </View>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {arabic ? <Text style={styles.arabic}>{arabic}</Text> : null}
            {translation ? <Text style={styles.translation}>{translation}</Text> : null}
            {reference ? <Text style={styles.reference}>{reference}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginTop: 16,
        backgroundColor: "#F0FDF4",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#DCFCE7",
        padding: 16,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
    },
    headerText: {
        fontSize: 14,
        fontWeight: "700",
        color: Colors.light.text,
    },
    title: {
        fontSize: 14,
        fontWeight: "600",
        color: Colors.light.text,
        marginBottom: 6,
    },
    arabic: {
        fontSize: 16,
        color: Colors.light.text,
        marginBottom: 6,
    },
    translation: {
        fontSize: 13,
        color: Colors.light.icon,
        marginBottom: 8,
    },
    reference: {
        fontSize: 12,
        color: Colors.light.icon,
        textAlign: "right",
    },
});
