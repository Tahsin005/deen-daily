import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo, useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { Fonts } from "../../constants/Fonts";
import { Theme } from "../../constants/Theme";
import { fetchJson } from "../../lib/api/fetchJson";
import { SkeletonLine } from "../common/Skeleton";
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

const formatDateLabel = (value?: string) => {
    if (!value || value === "latest") {
        return new Date().toLocaleDateString(undefined, {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return value;
    }
    return parsed.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const isValidDate = (value?: string) => {
    if (!value) {
        return true;
    }
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
};

const getExchangeRate = async (
    fromCurrency: string,
    toCurrency: string,
    date?: string
): Promise<number> => {
    const today = new Date().toISOString().split("T")[0];
    const apiDate = !date || date === today ? "latest" : date;
    const from = fromCurrency.toLowerCase();
    const to = toCurrency.toLowerCase();

    const primaryUrl = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${apiDate}/v1/currencies/${from}.json`;
    const fallbackUrl = `https://${apiDate}.currency-api.pages.dev/v1/currencies/${from}.json`;

    try {
        const data = await fetchJson<Record<string, Record<string, number>>>(primaryUrl);
        if (data[from] && data[from][to]) {
            return data[from][to];
        }
    } catch {
        // ignore and fallback below
    }

    try {
        const data = await fetchJson<Record<string, Record<string, number>>>(fallbackUrl);
        if (data[from] && data[from][to]) {
            return data[from][to];
        }
    } catch {
        return 1;
    }

    return 1;
};

type AssetItem = {
    id: string;
    type: string;
    amount: number;
    currency: string;
};

type LiabilityItem = {
    id: string;
    type: string;
    amount: number;
    currency: string;
};

type GoldItem = {
    id: string;
    carat: number;
    weight: number;
    pureGold: number;
    zakatableGold: number;
};

type SilverItem = {
    id: string;
    weight: number;
    zakatableSilver: number;
};

type ZakatResult = {
    totalCash: number;
    totalLiabilities: number;
    netZakatableAssets: number;
    totalZakatCash: number;
    totalPureGoldWeight: number;
    totalZakatableGoldWeight: number;
    totalSilverWeight: number;
    totalZakatableSilverWeight: number;
    currency: string;
    dateLabel: string;
};

type ZakatCalculatorCardProps = {
    defaultCurrency: string;
};

export const ZakatCalculatorCard = ({ defaultCurrency }: ZakatCalculatorCardProps) => {
    const [assets, setAssets] = useState<AssetItem[]>([]);
    const [liabilities, setLiabilities] = useState<LiabilityItem[]>([]);
    const [goldItems, setGoldItems] = useState<GoldItem[]>([]);
    const [silverItems, setSilverItems] = useState<SilverItem[]>([]);
    const [assetType, setAssetType] = useState("");
    const [assetAmount, setAssetAmount] = useState("");
    const [liabilityType, setLiabilityType] = useState("");
    const [liabilityAmount, setLiabilityAmount] = useState("");
    const [goldCarat, setGoldCarat] = useState("");
    const [goldWeight, setGoldWeight] = useState("");
    const [silverWeight, setSilverWeight] = useState("");
    const [exchangeDate, setExchangeDate] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [result, setResult] = useState<ZakatResult | null>(null);

    const effectiveCurrency = useMemo(() => defaultCurrency.toUpperCase(), [defaultCurrency]);

    const resetErrors = () => setErrorMessage(null);

    const addAsset = () => {
        const amount = Number.parseFloat(assetAmount);
        if (!assetType.trim() || !Number.isFinite(amount) || amount <= 0) {
            setErrorMessage("Please enter a valid asset type and amount.");
            return;
        }
    const currency = effectiveCurrency;
        setAssets((prev) => [
            ...prev,
            { id: `${Date.now()}-${prev.length}`, type: assetType.trim(), amount, currency },
        ]);
        setAssetType("");
        setAssetAmount("");
        resetErrors();
    };

    const addLiability = () => {
        const amount = Number.parseFloat(liabilityAmount);
        if (!liabilityType.trim() || !Number.isFinite(amount) || amount <= 0) {
            setErrorMessage("Please enter a valid liability type and amount.");
            return;
        }
    const currency = effectiveCurrency;
        setLiabilities((prev) => [
            ...prev,
            { id: `${Date.now()}-${prev.length}`, type: liabilityType.trim(), amount, currency },
        ]);
        setLiabilityType("");
        setLiabilityAmount("");
        resetErrors();
    };

    const addGold = () => {
        const carat = Number.parseInt(goldCarat, 10);
        const weight = Number.parseFloat(goldWeight);
        if (!Number.isFinite(carat) || !Number.isFinite(weight) || weight <= 0 || carat <= 0) {
            setErrorMessage("Please enter a valid gold carat and weight.");
            return;
        }
        const pureGold = (weight * carat) / 24;
        const zakatableGold = pureGold * 0.025;
        setGoldItems((prev) => [
            ...prev,
            {
                id: `${Date.now()}-${prev.length}`,
                carat,
                weight,
                pureGold,
                zakatableGold,
            },
        ]);
        setGoldCarat("");
        setGoldWeight("");
        resetErrors();
    };

    const addSilver = () => {
        const weight = Number.parseFloat(silverWeight);
        if (!Number.isFinite(weight) || weight <= 0) {
            setErrorMessage("Please enter a valid silver weight.");
            return;
        }
        const zakatableSilver = weight * 0.025;
        setSilverItems((prev) => [
            ...prev,
            { id: `${Date.now()}-${prev.length}`, weight, zakatableSilver },
        ]);
        setSilverWeight("");
        resetErrors();
    };

    const calculateZakat = async () => {
        if (assets.length === 0 && goldItems.length === 0 && silverItems.length === 0) {
            setErrorMessage("Add assets, gold, or silver before calculating.");
            return;
        }
        if (exchangeDate && !isValidDate(exchangeDate)) {
            setErrorMessage("Exchange rate date should be YYYY-MM-DD.");
            return;
        }
        resetErrors();
        setIsCalculating(true);

        const totalPureGoldWeight = goldItems.reduce((sum, item) => sum + item.pureGold, 0);
        const totalZakatableGoldWeight = goldItems.reduce(
            (sum, item) => sum + item.zakatableGold,
            0
        );
        const totalSilverWeight = silverItems.reduce((sum, item) => sum + item.weight, 0);
        const totalZakatableSilverWeight = silverItems.reduce(
            (sum, item) => sum + item.zakatableSilver,
            0
        );

        const convertedAssets = await Promise.all(
            assets.map(async (asset) => {
                if (asset.currency.toUpperCase() === effectiveCurrency) {
                    return asset.amount;
                }
                const rate = await getExchangeRate(asset.currency, effectiveCurrency, exchangeDate);
                return asset.amount * rate;
            })
        );

        const convertedLiabilities = await Promise.all(
            liabilities.map(async (liability) => {
                if (liability.currency.toUpperCase() === effectiveCurrency) {
                    return liability.amount;
                }
                const rate = await getExchangeRate(
                    liability.currency,
                    effectiveCurrency,
                    exchangeDate
                );
                return liability.amount * rate;
            })
        );

        const totalCash = convertedAssets.reduce((sum, amount) => sum + amount, 0);
        const totalLiabilities = convertedLiabilities.reduce((sum, amount) => sum + amount, 0);
        const netZakatableAssets = Math.max(0, totalCash - totalLiabilities);
        const totalZakatCash = netZakatableAssets * 0.025;

        setResult({
            totalCash,
            totalLiabilities,
            netZakatableAssets,
            totalZakatCash,
            totalPureGoldWeight,
            totalZakatableGoldWeight,
            totalSilverWeight,
            totalZakatableSilverWeight,
            currency: effectiveCurrency,
            dateLabel: formatDateLabel(exchangeDate || "latest"),
        });

        setIsCalculating(false);
    };

    const resetAll = () => {
        setAssets([]);
        setLiabilities([]);
        setGoldItems([]);
        setSilverItems([]);
        setResult(null);
        setAssetType("");
        setAssetAmount("");
        setLiabilityType("");
        setLiabilityAmount("");
        setGoldCarat("");
        setGoldWeight("");
        setSilverWeight("");
        setExchangeDate("");
        resetErrors();
    };

    return (
        <GlassCard style={styles.card}>
            <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="calculator" size={18} color="#F2B50B" />
                    </View>
                    <Text style={styles.headerTitle}>Zakat Calculator</Text>
                </View>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{effectiveCurrency}</Text>
                </View>
            </View>

            <Text style={styles.subText}>
                Add your assets, liabilities, gold, and silver. We&apos;ll convert everything into
                {` ${effectiveCurrency}`}.
            </Text>

            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Exchange rate date (optional)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#6B7280"
                    value={exchangeDate}
                    onChangeText={setExchangeDate}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <Text style={styles.helperText}>Leave empty to use the latest exchange rate.</Text>
            </View>

            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Assets</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Type (e.g. cash, savings)"
                    placeholderTextColor="#6B7280"
                    value={assetType}
                    onChangeText={setAssetType}
                />
                <View style={styles.inlineRow}>
                    <TextInput
                        style={[styles.input, styles.inlineInput]}
                        placeholder="Amount"
                        placeholderTextColor="#6B7280"
                        value={assetAmount}
                        onChangeText={setAssetAmount}
                        keyboardType="decimal-pad"
                    />
                    <View style={[styles.input, styles.inlineInput, styles.currencyTag]}>
                        <Text style={styles.currencyText}>{effectiveCurrency}</Text>
                    </View>
                </View>
                <Pressable style={styles.actionButton} onPress={addAsset}>
                    <Text style={styles.actionButtonText}>+ Add Asset</Text>
                </Pressable>
                {assets.length > 0 ? (
                    <View style={styles.listContainer}>
                        {assets.map((asset) => (
                            <View key={asset.id} style={styles.listRow}>
                                <View>
                                    <Text style={styles.listTitle}>{asset.type}</Text>
                                    <Text style={styles.listSubtitle}>
                                        {asset.amount} {asset.currency.toUpperCase()}
                                    </Text>
                                </View>
                                <Pressable
                                    onPress={() => setAssets((prev) => prev.filter((item) => item.id !== asset.id))}
                                >
                                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                                </Pressable>
                            </View>
                        ))}
                    </View>
                ) : null}
            </View>

            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Liabilities</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Type (e.g. debt, loan)"
                    placeholderTextColor="#6B7280"
                    value={liabilityType}
                    onChangeText={setLiabilityType}
                />
                <View style={styles.inlineRow}>
                    <TextInput
                        style={[styles.input, styles.inlineInput]}
                        placeholder="Amount"
                        placeholderTextColor="#6B7280"
                        value={liabilityAmount}
                        onChangeText={setLiabilityAmount}
                        keyboardType="decimal-pad"
                    />
                    <View style={[styles.input, styles.inlineInput, styles.currencyTag]}>
                        <Text style={styles.currencyText}>{effectiveCurrency}</Text>
                    </View>
                </View>
                <Pressable style={styles.actionButton} onPress={addLiability}>
                    <Text style={styles.actionButtonText}>+ Add Liability</Text>
                </Pressable>
                {liabilities.length > 0 ? (
                    <View style={styles.listContainer}>
                        {liabilities.map((liability) => (
                            <View key={liability.id} style={styles.listRow}>
                                <View>
                                    <Text style={styles.listTitle}>{liability.type}</Text>
                                    <Text style={styles.listSubtitle}>
                                        {liability.amount} {liability.currency.toUpperCase()}
                                    </Text>
                                </View>
                                <Pressable
                                    onPress={() =>
                                        setLiabilities((prev) => prev.filter((item) => item.id !== liability.id))
                                    }
                                >
                                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                                </Pressable>
                            </View>
                        ))}
                    </View>
                ) : null}
            </View>

            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Gold</Text>
                <View style={styles.inlineRow}>
                    <TextInput
                        style={[styles.input, styles.inlineInput]}
                        placeholder="Carat (e.g. 21, 24)"
                        placeholderTextColor="#6B7280"
                        value={goldCarat}
                        onChangeText={setGoldCarat}
                        keyboardType="number-pad"
                    />
                    <TextInput
                        style={[styles.input, styles.inlineInput]}
                        placeholder="Weight (g)"
                        placeholderTextColor="#6B7280"
                        value={goldWeight}
                        onChangeText={setGoldWeight}
                        keyboardType="decimal-pad"
                    />
                </View>
                <Pressable style={styles.actionButton} onPress={addGold}>
                    <Text style={styles.actionButtonText}>+ Add Gold</Text>
                </Pressable>
                {goldItems.length > 0 ? (
                    <View style={styles.listContainer}>
                        {goldItems.map((item) => (
                            <View key={item.id} style={styles.listRow}>
                                <View>
                                    <Text style={styles.listTitle}>{item.weight}g @ {item.carat}k</Text>
                                    <Text style={styles.listSubtitle}>
                                        Pure: {item.pureGold.toFixed(2)}g | Zakatable: {item.zakatableGold.toFixed(2)}g
                                    </Text>
                                </View>
                                <Pressable
                                    onPress={() => setGoldItems((prev) => prev.filter((row) => row.id !== item.id))}
                                >
                                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                                </Pressable>
                            </View>
                        ))}
                    </View>
                ) : null}
            </View>

            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Silver</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Weight (g)"
                    placeholderTextColor="#6B7280"
                    value={silverWeight}
                    onChangeText={setSilverWeight}
                    keyboardType="decimal-pad"
                />
                <Pressable style={styles.actionButton} onPress={addSilver}>
                    <Text style={styles.actionButtonText}>+ Add Silver</Text>
                </Pressable>
                {silverItems.length > 0 ? (
                    <View style={styles.listContainer}>
                        {silverItems.map((item) => (
                            <View key={item.id} style={styles.listRow}>
                                <View>
                                    <Text style={styles.listTitle}>{item.weight}g silver</Text>
                                    <Text style={styles.listSubtitle}>
                                        Zakatable: {item.zakatableSilver.toFixed(2)}g
                                    </Text>
                                </View>
                                <Pressable
                                    onPress={() =>
                                        setSilverItems((prev) => prev.filter((row) => row.id !== item.id))
                                    }
                                >
                                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                                </Pressable>
                            </View>
                        ))}
                    </View>
                ) : null}
            </View>

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <View style={styles.buttonRow}>
                <Pressable style={[styles.actionButtonMain, styles.primaryButton]} onPress={calculateZakat}>
                    {isCalculating ? (
                        <SkeletonLine style={styles.buttonSkeleton} />
                    ) : (
                        <Text style={styles.primaryButtonText}>Calculate Zakat</Text>
                    )}
                </Pressable>
                <Pressable style={[styles.actionButtonMain, styles.ghostButton]} onPress={resetAll}>
                    <Text style={styles.ghostButtonText}>Reset</Text>
                </Pressable>
            </View>

            {result ? (
                <View style={styles.resultCard}>
                    <Text style={styles.resultTitle}>Zakat Summary</Text>
                    <Text style={styles.resultSubtitle}>Calculation Date: {result.dateLabel}</Text>

                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Total cash/assets</Text>
                        <Text style={styles.resultValue}>
                            {formatCurrency(result.totalCash, result.currency)}
                        </Text>
                    </View>
                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Total liabilities</Text>
                        <Text style={styles.resultValue}>
                            {formatCurrency(result.totalLiabilities, result.currency)}
                        </Text>
                    </View>
                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Net zakatable assets</Text>
                        <Text style={styles.resultValue}>
                            {formatCurrency(result.netZakatableAssets, result.currency)}
                        </Text>
                    </View>
                    <View style={styles.resultRowHighlight}>
                        <Text style={styles.resultLabelHighlight}>Cash Zakat Due (2.5%)</Text>
                        <Text style={styles.resultValueHighlight}>
                            {formatCurrency(result.totalZakatCash, result.currency)}
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Total pure gold weight</Text>
                        <Text style={styles.resultValue}>{result.totalPureGoldWeight.toFixed(2)} g</Text>
                    </View>
                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Zakatable gold weight</Text>
                        <Text style={styles.resultValue}>
                            {result.totalZakatableGoldWeight.toFixed(2)} g
                        </Text>
                    </View>
                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Total silver weight</Text>
                        <Text style={styles.resultValue}>{result.totalSilverWeight.toFixed(2)} g</Text>
                    </View>
                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Zakatable silver weight</Text>
                        <Text style={styles.resultValue}>
                            {result.totalZakatableSilverWeight.toFixed(2)} g
                        </Text>
                    </View>

                    <Text style={styles.resultNote}>
                        Remember to verify the latest gold and silver prices before finalizing your Zakat.
                    </Text>
                </View>
            ) : null}
        </GlassCard>
    );
};

const styles = StyleSheet.create({
    card: {
        marginTop: 14,
        padding: 16,
        gap: 12,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    iconCircle: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "rgba(242, 181, 11, 0.15)",
        borderWidth: 1,
        borderColor: "rgba(242, 181, 11, 0.3)",
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        fontSize: Fonts.size.lg,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: "rgba(72, 161, 17, 0.2)",
        borderWidth: 1,
        borderColor: "rgba(72, 161, 17, 0.35)",
    },
    badgeText: {
        fontSize: Fonts.size.xs,
        fontWeight: "700",
        color: "#86EFAC",
    },
    subText: {
        fontSize: Fonts.size.xs,
        color: "#9CA3AF",
        lineHeight: 18,
    },
    sectionCard: {
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.08)",
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        padding: 12,
        gap: 8,
    },
    sectionTitle: {
        fontSize: Fonts.size.sm,
        fontWeight: "700",
        color: "#F3F4F6",
    },
    helperText: {
        fontSize: Fonts.size.xxs,
        color: "#6B7280",
    },
    input: {
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.12)",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: Fonts.size.sm,
        color: "#FFFFFF",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
    },
    inlineRow: {
        flexDirection: "row",
        gap: 8,
    },
    inlineInput: {
        flex: 1,
    },
    currencyTag: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(72, 161, 17, 0.15)",
        borderColor: "rgba(72, 161, 17, 0.3)",
    },
    currencyText: {
        fontSize: Fonts.size.sm,
        fontWeight: "700",
        color: "#86EFAC",
    },
    actionButton: {
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: "rgba(72, 161, 17, 0.2)",
        borderWidth: 1,
        borderColor: "rgba(72, 161, 17, 0.35)",
    },
    actionButtonText: {
        fontSize: Fonts.size.xs,
        fontWeight: "600",
        color: "#86EFAC",
    },
    listContainer: {
        gap: 6,
        marginTop: 4,
    },
    listRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.08)",
    },
    listTitle: {
        fontSize: Fonts.size.sm,
        fontWeight: "600",
        color: "#F3F4F6",
    },
    listSubtitle: {
        fontSize: Fonts.size.xs,
        color: "#9CA3AF",
    },
    buttonRow: {
        flexDirection: "row",
        gap: 10,
        marginTop: 4,
    },
    actionButtonMain: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        borderRadius: 12,
    },
    primaryButton: {
        backgroundColor: "#25671E",
        borderWidth: 1,
        borderColor: "rgba(72, 161, 17, 0.5)",
    },
    primaryButtonText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: Fonts.size.sm,
    },
    buttonSkeleton: {
        width: 60,
        height: 12,
        borderRadius: 6,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
    },
    ghostButton: {
        backgroundColor: "rgba(255, 255, 255, 0.06)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.12)",
    },
    ghostButtonText: {
        color: "#9CA3AF",
        fontSize: Fonts.size.sm,
        fontWeight: "600",
    },
    errorText: {
        color: "#EF4444",
        fontSize: Fonts.size.xs,
        fontWeight: "600",
    },
    resultCard: {
        marginTop: 4,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "rgba(72, 161, 17, 0.4)",
        borderTopColor: "rgba(134, 239, 172, 0.6)",
        backgroundColor: "rgba(37, 103, 30, 0.2)",
        padding: 14,
        gap: 8,
    },
    resultTitle: {
        fontSize: Fonts.size.md,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    resultSubtitle: {
        fontSize: Fonts.size.xs,
        color: "#9CA3AF",
    },
    resultRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    resultRowHighlight: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "rgba(72, 161, 17, 0.2)",
        padding: 8,
        borderRadius: 8,
        marginTop: 2,
    },
    resultLabel: {
        fontSize: Fonts.size.xs,
        color: "#9CA3AF",
    },
    resultLabelHighlight: {
        fontSize: Fonts.size.xs,
        fontWeight: "700",
        color: "#FDE68A",
    },
    resultValue: {
        fontSize: Fonts.size.xs,
        fontWeight: "600",
        color: "#F3F4F6",
    },
    resultValueHighlight: {
        fontSize: Fonts.size.sm,
        fontWeight: "700",
        color: "#86EFAC",
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        marginVertical: 4,
    },
    resultNote: {
        marginTop: 4,
        fontSize: Fonts.size.xxs,
        color: "#6B7280",
        lineHeight: 14,
    },
});
