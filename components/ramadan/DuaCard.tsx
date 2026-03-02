import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { Fonts } from "../../constants/Fonts";
import { Theme } from "../../constants/Theme";

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
        backgroundColor: Theme.colors.surfaceSoft,
        borderRadius: Theme.radius.lg,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        padding: 16,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
    },
    headerText: {
        fontSize: Fonts.size.text,
        fontWeight: "700",
        color: Colors.light.text,
    },
    title: {
        fontSize: Fonts.size.text,
        fontWeight: "600",
        color: Colors.light.text,
        marginBottom: 6,
    },
    arabic: {
        fontSize: Fonts.size.xl,
        color: Colors.light.text,
        marginBottom: 6,
    },
    translation: {
        fontSize: Fonts.size.md,
        color: Colors.light.icon,
        marginBottom: 8,
    },
    reference: {
        fontSize: Fonts.size.sm,
        color: Colors.light.icon,
        textAlign: "right",
    },
});
