import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import { Fonts } from "../../constants/Fonts";
import { GlassCard } from "../glass/GlassCard";

type RamadanBannerProps = {
    yearLabel?: string;
    dateRange?: string;
};

export const RamadanBanner = ({ yearLabel, dateRange }: RamadanBannerProps) => {
    return (
        <GlassCard style={styles.banner}>
            <View style={styles.iconBadge}>
                <Ionicons name="moon" size={18} color="#F2B50B" />
            </View>
            <View style={styles.textWrap}>
                <Text style={styles.title}>{yearLabel ?? "Ramadan Mubarak"}</Text>
                {dateRange ? <Text style={styles.subtitle}>{dateRange}</Text> : null}
            </View>
            <Ionicons name="sparkles" size={18} color="#F2B50B" />
        </GlassCard>
    );
};

const styles = StyleSheet.create({
    banner: {
        marginTop: 14,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: "rgba(37, 103, 30, 0.25)",
        borderColor: "rgba(72, 161, 17, 0.4)",
        borderTopColor: "rgba(134, 239, 172, 0.6)",
    },
    iconBadge: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "rgba(242, 181, 11, 0.15)",
        borderWidth: 1,
        borderColor: "rgba(242, 181, 11, 0.35)",
        alignItems: "center",
        justifyContent: "center",
    },
    textWrap: {
        flex: 1,
    },
    title: {
        fontSize: Fonts.size.md,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    subtitle: {
        fontSize: Fonts.size.xs,
        color: "#86EFAC",
        marginTop: 2,
    },
});
