import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";

type HadithCardRamadanProps = {
    arabic?: string;
    english?: string;
    source?: string;
    grade?: string;
};

export const HadithCardRamadan = ({ arabic, english, source, grade }: HadithCardRamadanProps) => {
    if (!arabic && !english) {
        return null;
    }

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <Ionicons name="bookmarks" size={18} color={Colors.light.primary} />
                <Text style={styles.headerText}>Hadith of the Day</Text>
            </View>
            {arabic ? <Text style={styles.arabic}>{arabic}</Text> : null}
            {english ? <Text style={styles.translation}>{english}</Text> : null}
            <View style={styles.footerRow}>
                {source ? <Text style={styles.reference}>{source}</Text> : null}
                {grade ? <Text style={styles.grade}>{grade}</Text> : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginTop: 16,
        backgroundColor: "#F8FAFC",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E2E8F0",
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
    arabic: {
        fontSize: 16,
        color: Colors.light.text,
        marginBottom: 6,
    },
    translation: {
        fontSize: 13,
        color: Colors.light.icon,
        marginBottom: 10,
    },
    footerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
    },
    reference: {
        fontSize: 12,
        color: Colors.light.icon,
    },
    grade: {
        fontSize: 12,
        color: Colors.light.primary,
        fontWeight: "600",
    },
});
