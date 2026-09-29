import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import { Fonts } from "../../constants/Fonts";
import type { ZakatNisabResponse } from "../../lib/api/zakat/getZakatNisab";
import { GlassCard } from "../glass/GlassCard";

const formatCurrency = (amount: number, currency: string) => {
    try {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: currency.toUpperCase(),
            maximumFractionDigits: 2,
        }).format(amount);
    } catch {
        return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
    }
};

const formatUpdatedAt = (value?: string) => {
    if (!value) return "";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

type ZakatNisabCardProps = {
    data: ZakatNisabResponse;
};

export const ZakatNisabCard = ({ data }: ZakatNisabCardProps) => {
    const gold = data.data.nisab_thresholds.gold;
    const silver = data.data.nisab_thresholds.silver;
    const unitLabel = data.weight_unit === "oz" ? "oz" : "g";
    const currency = data.currency.toUpperCase();

    return (
        <GlassCard style={styles.card}>
            <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                    <Ionicons name="cash-outline" size={22} color="#F2B50B" />
                    <View>
                        <Text style={styles.sectionCategory}>TREASURY</Text>
                        <Text style={styles.headerTitle}>Zakat Nisab Thresholds</Text>
                    </View>
                </View>
                <View style={styles.badgeRow}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{currency}</Text>
                    </View>
                    <View style={[styles.badge, styles.badgeAlt]}>
                        <Text style={[styles.badgeText, { color: "#FDE68A" }]}>
                            {data.calculation_standard}
                        </Text>
                    </View>
                </View>
            </View>

            <Text style={styles.subText}>Updated: {formatUpdatedAt(data.updated_at)}</Text>


            <View style={styles.nisabItem}>
                <View style={styles.itemHeader}>
                    <View style={styles.metalTitleRow}>
                        <View style={[styles.metalDot, { backgroundColor: "#F2B50B" }]} />
                        <Text style={styles.metalName}>Gold Nisab</Text>
                    </View>
                    <Text style={styles.metalAmount}>
                        {formatCurrency(gold.nisab_amount, currency)}
                    </Text>
                </View>
                <View style={styles.metaRow}>
                    <Text style={styles.metaText}>Weight: {gold.weight} {unitLabel}</Text>
                    <Text style={styles.metaText}>·</Text>
                    <Text style={styles.metaText}>
                        Rate: {formatCurrency(gold.unit_price, currency)}/{unitLabel}
                    </Text>
                </View>
            </View>


            <View style={[styles.nisabItem, { marginTop: 10 }]}>
                <View style={styles.itemHeader}>
                    <View style={styles.metalTitleRow}>
                        <View style={[styles.metalDot, { backgroundColor: "#9CA3AF" }]} />
                        <Text style={styles.metalName}>Silver Nisab</Text>
                    </View>
                    <Text style={styles.metalAmount}>
                        {formatCurrency(silver.nisab_amount, currency)}
                    </Text>
                </View>
                <View style={styles.metaRow}>
                    <Text style={styles.metaText}>Weight: {silver.weight} {unitLabel}</Text>
                    <Text style={styles.metaText}>·</Text>
                    <Text style={styles.metaText}>
                        Rate: {formatCurrency(silver.unit_price, currency)}/{unitLabel}
                    </Text>
                </View>
            </View>

            <View style={styles.rateRow}>
                <Text style={styles.rateLabel}>Obligatory Zakat Rate</Text>
                <View style={styles.rateBadge}>
                    <Text style={styles.rateValue}>{data.data.zakat_rate}</Text>
                </View>
            </View>
        </GlassCard>
    );
};

const styles = StyleSheet.create({
    card: {
        marginTop: 14,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    sectionCategory: {
        fontSize: 10,
        fontWeight: "700",
        color: "#6B7280",
        letterSpacing: 1,
    },
    headerTitle: {
        fontSize: Fonts.size.xl,
        fontWeight: "700",
        color: "#F3F4F6",
        letterSpacing: -0.3,
    },
    badgeRow: {
        flexDirection: "row",
        gap: 6,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.15)",
    },
    badgeAlt: {
        backgroundColor: "rgba(242, 181, 11, 0.15)",
        borderColor: "rgba(242, 181, 11, 0.3)",
    },
    badgeText: {
        fontSize: Fonts.size.xxs,
        fontWeight: "700",
        color: "#F3F4F6",
    },
    subText: {
        fontSize: Fonts.size.xs,
        color: "#9CA3AF",
        marginBottom: 14,
    },
    nisabItem: {
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.08)",
        borderTopColor: "rgba(255, 255, 255, 0.15)",
    },
    itemHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    metalTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    metalDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    metalName: {
        fontSize: Fonts.size.md,
        fontWeight: "700",
        color: "#F3F4F6",
    },
    metalAmount: {
        fontSize: Fonts.size.lg,
        fontWeight: "700",
        color: "#48A111",
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    metaText: {
        fontSize: Fonts.size.xs,
        color: "#9CA3AF",
    },
    rateRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 14,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.08)",
    },
    rateLabel: {
        fontSize: Fonts.size.sm,
        color: "#D1D5DB",
        fontWeight: "500",
    },
    rateBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: "rgba(37, 103, 30, 0.35)",
        borderWidth: 1,
        borderColor: "rgba(72, 161, 17, 0.4)",
    },
    rateValue: {
        fontSize: Fonts.size.sm,
        fontWeight: "700",
        color: "#48A111",
    },
});
export default ZakatNisabCard;
