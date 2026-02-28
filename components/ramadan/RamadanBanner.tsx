import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import { Theme } from "../../constants/Theme";

type RamadanBannerProps = {
    yearLabel?: string;
    dateRange?: string;
};

export const RamadanBanner = ({ yearLabel, dateRange }: RamadanBannerProps) => {
    return (
        <View style={styles.banner}>
            <View style={styles.iconBadge}>
                <Ionicons name="moon" size={20} color={Theme.colors.primary} />
            </View>
            <View style={styles.textWrap}>
                <Text style={styles.title}>{yearLabel ?? "Ramadan"}</Text>
                {dateRange ? <Text style={styles.subtitle}>{dateRange}</Text> : null}
            </View>
            <Ionicons name="sparkles" size={18} color={Theme.colors.surface} />
        </View>
    );
};

const styles = StyleSheet.create({
    banner: {
        backgroundColor: Theme.colors.primary,
        borderRadius: Theme.radius.lg,
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
        backgroundColor: Theme.colors.surface,
        alignItems: "center",
        justifyContent: "center",
    },
    textWrap: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
                color: Theme.colors.onPrimary,
    },
    subtitle: {
        fontSize: 12,
                color: Theme.colors.surfaceSoft,
        marginTop: 2,
  },
});
