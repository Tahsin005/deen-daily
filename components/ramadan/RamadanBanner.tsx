import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

type RamadanBannerProps = {
    yearLabel?: string;
    dateRange?: string;
};

export const RamadanBanner = ({ yearLabel, dateRange }: RamadanBannerProps) => {
    return (
        <View style={styles.banner}>
            <View style={styles.iconBadge}>
                <Ionicons name="moon" size={20} color="#0F766E" />
            </View>
            <View style={styles.textWrap}>
                <Text style={styles.title}>{yearLabel ?? "Ramadan"}</Text>
                {dateRange ? <Text style={styles.subtitle}>{dateRange}</Text> : null}
            </View>
            <Ionicons name="sparkles" size={18} color="#E0F2FE" />
        </View>
    );
};

const styles = StyleSheet.create({
    banner: {
        backgroundColor: "#4B9B7D",
        borderRadius: 20,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginTop: 16,
    },
    iconBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#ECFEFF",
        alignItems: "center",
        justifyContent: "center",
    },
    textWrap: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    subtitle: {
        fontSize: 12,
        color: "#D1FAE5",
        marginTop: 2,
  },
});
