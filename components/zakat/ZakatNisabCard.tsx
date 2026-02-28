import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { Theme } from "../../constants/Theme";
import type { ZakatNisabResponse } from "../../lib/api/zakat/getZakatNisab";

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
    if (!value) {
        return "";
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return value;
    }
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
        <View style={styles.card}>
        <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
            <Ionicons name="cash" size={22} color={Colors.light.primary} />
            <Text style={styles.headerTitle}>Zakat Nisab</Text>
            </View>
            <View style={styles.badgeRow}>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>{currency}</Text>
            </View>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>{data.calculation_standard}</Text>
            </View>
            </View>
        </View>
        <Text style={styles.subText}>Updated: {formatUpdatedAt(data.updated_at)}</Text>
        {data.data.notes ? <Text style={styles.noteText}>{data.data.notes}</Text> : null}

        <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Gold Nisab</Text>
            <Text style={styles.sectionAmount}>{formatCurrency(gold.nisab_amount, currency)}</Text>
            </View>
            <Text style={styles.sectionLine}>Weight: {gold.weight} {unitLabel}</Text>
            <Text style={styles.sectionLine}>
            Gold price: {formatCurrency(gold.unit_price, currency)} per {unitLabel}
            </Text>
        </View>

        <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Silver Nisab</Text>
            <Text style={styles.sectionAmount}>{formatCurrency(silver.nisab_amount, currency)}</Text>
            </View>
            <Text style={styles.sectionLine}>Weight: {silver.weight} {unitLabel}</Text>
            <Text style={styles.sectionLine}>
            Silver price: {formatCurrency(silver.unit_price, currency)} per {unitLabel}
            </Text>
        </View>

        <View style={styles.rateRow}>
            <Text style={styles.rateLabel}>Zakat rate</Text>
            <Text style={styles.rateValue}>{data.data.zakat_rate}</Text>
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginTop: 12,
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.radius.lg,
        borderWidth: 1,
        borderColor: Theme.colors.borderLight,
        padding: 16,
        gap: 12,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: Colors.light.text,
    },
    badgeRow: {
        flexDirection: "row",
        gap: 6,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: Theme.radius.pill,
        backgroundColor: Theme.colors.surfaceSoft,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: "600",
        color: Colors.light.primary,
        textTransform: "capitalize",
    },
    subText: {
        fontSize: 12,
        color: Colors.light.icon,
    },
    noteText: {
        fontSize: 12,
        color: Colors.light.icon,
    },
    sectionCard: {
        borderRadius: Theme.radius.md,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        backgroundColor: Theme.colors.surfaceMuted,
        padding: 12,
        gap: 6,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: "700",
        color: Colors.light.text,
    },
    sectionAmount: {
        fontSize: 15,
        fontWeight: "700",
        color: Colors.light.text,
    },
    sectionLine: {
        fontSize: 12,
        color: Colors.light.icon,
    },
    rateRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 6,
        borderTopWidth: 1,
        borderTopColor: Theme.colors.border,
    },
    rateLabel: {
        fontSize: 12,
        color: Colors.light.icon,
    },
    rateValue: {
        fontSize: 14,
        fontWeight: "700",
        color: Colors.light.text,
    },
});
