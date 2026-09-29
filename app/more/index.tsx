import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo, useState } from "react";
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AnimatedLogo } from "../../components/common/AnimatedLogo";
import { AmbientBackground } from "../../components/glass/AmbientBackground";
import { GlassCard } from "../../components/glass/GlassCard";
import { GlassPill } from "../../components/glass/GlassPill";
import { Fonts } from "../../constants/Fonts";
import { IslamicAPISettings } from "../../constants/settings/IslamicAPISettings";
import { useLocalStorageString } from "../../lib/storage/useLocalStorageString";
import { usePrayerSettings } from "../../lib/storage/usePrayerSettings";

type SettingKey =
  | "method"
  | "school"
  | "shifting"
  | "calendar"
  | "zakatCurrency";

export default function MoreScreen() {
  const [activeSetting, setActiveSetting] = useState<SettingKey | null>(null);
  const {
    method,
    school,
    shifting,
    calendar,
    setMethod,
    setSchool,
    setShifting,
    setCalendar,
  } = usePrayerSettings();

  const [zakatCurrency, setZakatCurrency] = useLocalStorageString(
    "zakatCurrency",
    IslamicAPISettings.zakatNisab.defaults.currency
  );

  const methodOptions = IslamicAPISettings.prayerTime.method;
  const schoolOptions = IslamicAPISettings.prayerTime.school;
  const shiftingOptions = IslamicAPISettings.prayerTime.shifting;
  const calendarOptions = IslamicAPISettings.prayerTime.calendar;
  const zakatCurrencyOptions = IslamicAPISettings.zakatNisab.currency;

  const currentMethodLabel = useMemo(
    () => methodOptions.find((item) => item.value === method)?.label ?? "Select",
    [method, methodOptions]
  );
  const currentSchoolLabel = useMemo(
    () => schoolOptions.find((item) => item.value === school)?.label ?? "Select",
    [school, schoolOptions]
  );
  const currentShiftingLabel = useMemo(
    () => shiftingOptions.find((item) => item.value === shifting)?.label ?? "Select",
    [shifting, shiftingOptions]
  );
  const currentZakatCurrencyLabel = useMemo(
    () =>
      zakatCurrencyOptions.find((item) => item.value === zakatCurrency)?.label ??
      zakatCurrency.toUpperCase(),
    [zakatCurrency, zakatCurrencyOptions]
  );

  const activeOptions = useMemo(() => {
    if (activeSetting === "method") {
      return methodOptions.map((item) => ({
        label: item.label,
        value: item.value,
        onSelect: () => {
          setMethod(item.value);
          setActiveSetting(null);
        },
      }));
    }
    if (activeSetting === "school") {
      return schoolOptions.map((item) => ({
        label: item.label,
        value: item.value,
        onSelect: () => {
          setSchool(item.value);
          setActiveSetting(null);
        },
      }));
    }
    if (activeSetting === "shifting") {
      return shiftingOptions.map((item) => ({
        label: item.label,
        value: item.value,
        onSelect: () => {
          setShifting(item.value);
          setActiveSetting(null);
        },
      }));
    }
    if (activeSetting === "calendar") {
      return calendarOptions.map((item) => ({
        label: item.label,
        value: item.value,
        onSelect: () => {
          setCalendar(item.value);
          setActiveSetting(null);
        },
      }));
    }
    if (activeSetting === "zakatCurrency") {
      return zakatCurrencyOptions.map((item) => ({
        label: item.label,
        value: item.value,
        onSelect: () => {
          setZakatCurrency(item.value);
          setActiveSetting(null);
        },
      }));
    }
    return [];
  }, [
    activeSetting,
    calendarOptions,
    methodOptions,
    schoolOptions,
    setCalendar,
    setMethod,
    setSchool,
    setShifting,
    shiftingOptions,
    zakatCurrencyOptions,
    setZakatCurrency,
  ]);

  const activeSettingTitle = useMemo(() => {
    if (activeSetting === "method") return "Calculation Method";
    if (activeSetting === "school") return "Juristic School (Asr)";
    if (activeSetting === "shifting") return "Higher Latitudes Shifting";
    if (activeSetting === "calendar") return "Islamic Calendar Standard";
    if (activeSetting === "zakatCurrency") return "Zakat Currency";
    return "Select Setting";
  }, [activeSetting]);

  return (
    <AmbientBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Preferences & About</Text>
          <Text style={styles.subtitle}>Configure calculations, methods, and app tools.</Text>
        </View>


        <GlassCard variant="primaryTint" style={styles.brandCard}>
          <View style={styles.brandTop}>
            <View style={styles.brandLogoWrap}>
              <AnimatedLogo size={42} />
            </View>
            <View style={styles.brandTextWrap}>
              <Text style={styles.brandTitle}>Deen Daily</Text>
              <Text style={styles.brandSubtitle}>v2.0.1 · Liquid Glass Edition</Text>
            </View>
          </View>
          <Text style={styles.brandDesc}>
            Your daily companion for prayer times, Quran recitation, authentic Hadith,
            fasting schedule, and Zakat calculation.
          </Text>
        </GlassCard>


        <View style={styles.sectionWrap}>
          <Text style={styles.sectionCategory}>CONFIGURATION</Text>
          <Text style={styles.sectionTitle}>Prayer Calculations</Text>

          <GlassCard style={styles.settingsCard}>
            <Pressable
              style={styles.settingRow}
              onPress={() => setActiveSetting("method")}
            >
              <View style={styles.settingTextWrap}>
                <Text style={styles.settingLabel}>Calculation Method</Text>
                <Text style={styles.settingValue}>{currentMethodLabel}</Text>
              </View>
              <GlassPill label="Change" size="sm" />
            </Pressable>

            <View style={styles.divider} />

            <Pressable
              style={styles.settingRow}
              onPress={() => setActiveSetting("school")}
            >
              <View style={styles.settingTextWrap}>
                <Text style={styles.settingLabel}>Juristic School (Asr Time)</Text>
                <Text style={styles.settingValue}>{currentSchoolLabel}</Text>
              </View>
              <GlassPill label="Change" size="sm" />
            </Pressable>

            <View style={styles.divider} />

            <Pressable
              style={styles.settingRow}
              onPress={() => setActiveSetting("shifting")}
            >
              <View style={styles.settingTextWrap}>
                <Text style={styles.settingLabel}>High Latitude Shifting</Text>
                <Text style={styles.settingValue}>{currentShiftingLabel}</Text>
              </View>
              <GlassPill label="Change" size="sm" />
            </Pressable>

            <View style={styles.divider} />

            <Pressable
              style={styles.settingRow}
              onPress={() => setActiveSetting("calendar")}
            >
              <View style={styles.settingTextWrap}>
                <Text style={styles.settingLabel}>Calendar Method</Text>
                <Text style={styles.settingValue}>{calendar}</Text>
              </View>
              <GlassPill label="Change" size="sm" />
            </Pressable>
          </GlassCard>
        </View>


        <View style={styles.sectionWrap}>
          <Text style={styles.sectionCategory}>FINANCIAL TOOLS</Text>
          <Text style={styles.sectionTitle}>Zakat Settings</Text>

          <GlassCard style={styles.settingsCard}>
            <Pressable
              style={styles.settingRow}
              onPress={() => setActiveSetting("zakatCurrency")}
            >
              <View style={styles.settingTextWrap}>
                <Text style={styles.settingLabel}>Default Currency</Text>
                <Text style={styles.settingValue}>{currentZakatCurrencyLabel}</Text>
              </View>
              <GlassPill label="Change" size="sm" variant="gold" />
            </Pressable>
          </GlassCard>
        </View>


        <View style={styles.sectionWrap}>
          <Text style={styles.sectionCategory}>COMMUNITY & CREDITS</Text>
          <Text style={styles.sectionTitle}>About Developer</Text>

          <GlassCard style={styles.settingsCard}>
            <Pressable
              style={styles.linkRow}
              onPress={() => Linking.openURL("https://github.com/Tahsin005/deen-daily")}
            >
              <View style={styles.linkLeft}>
                <Ionicons name="logo-github" size={20} color="#F3F4F6" />
                <Text style={styles.linkLabel}>GitHub Repository</Text>
              </View>
              <Ionicons name="open-outline" size={16} color="#9CA3AF" />
            </Pressable>

            <View style={styles.divider} />

            <Pressable
              style={styles.linkRow}
              onPress={() => Linking.openURL("https://www.linkedin.com/in/md-tahsin-ferdous/")}
            >
              <View style={styles.linkLeft}>
                <Ionicons name="logo-linkedin" size={20} color="#48A111" />
                <Text style={styles.linkLabel}>Developer Profile</Text>
              </View>
              <Ionicons name="open-outline" size={16} color="#9CA3AF" />
            </Pressable>

            <View style={styles.divider} />

            <Pressable
              style={styles.linkRow}
              onPress={() => Linking.openURL("https://islamicapi.com/")}
            >
              <View style={styles.linkLeft}>
                <Ionicons name="globe-outline" size={20} color="#F2B50B" />
                <Text style={styles.linkLabel}>IslamicAPI.com Data Source</Text>
              </View>
              <Ionicons name="open-outline" size={16} color="#9CA3AF" />
            </Pressable>
          </GlassCard>
        </View>


        <View style={{ height: 110 }} />
      </ScrollView>


      <Modal
        visible={activeSetting !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveSetting(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setActiveSetting(null)}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{activeSettingTitle}</Text>
              <Pressable onPress={() => setActiveSetting(null)}>
                <Ionicons name="close" size={20} color="#9CA3AF" />
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
              {activeOptions.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={option.onSelect}
                  style={styles.modalOption}
                >
                  <Text style={styles.modalOptionText}>{option.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </AmbientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  content: {
    paddingTop: 10,
  },
  header: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: Fonts.size.mega,
    fontWeight: "700",
    color: "#F3F4F6",
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: Fonts.size.sm,
    color: "#9CA3AF",
    marginTop: 2,
  },
  brandCard: {
    padding: 18,
    marginBottom: 16,
  },
  brandTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 10,
  },
  brandLogoWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(37, 103, 30, 0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  brandTextWrap: {
    flex: 1,
  },
  brandTitle: {
    fontSize: Fonts.size.xl,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  brandSubtitle: {
    fontSize: Fonts.size.xs,
    color: "#48A111",
    fontWeight: "600",
    marginTop: 2,
  },
  brandDesc: {
    fontSize: Fonts.size.xs,
    color: "#D1D5DB",
    lineHeight: 18,
  },
  sectionWrap: {
    marginTop: 18,
  },
  sectionCategory: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 1,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: Fonts.size.lg,
    fontWeight: "700",
    color: "#F3F4F6",
    marginBottom: 10,
    marginTop: 2,
    paddingHorizontal: 4,
  },
  settingsCard: {
    padding: 6,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  settingTextWrap: {
    flex: 1,
    marginRight: 10,
  },
  settingLabel: {
    fontSize: Fonts.size.xs,
    color: "#9CA3AF",
  },
  settingValue: {
    fontSize: Fonts.size.md,
    fontWeight: "600",
    color: "#F3F4F6",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    marginHorizontal: 10,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  linkLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  linkLabel: {
    fontSize: Fonts.size.sm,
    fontWeight: "600",
    color: "#F3F4F6",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "rgba(22, 28, 24, 0.96)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderTopColor: "rgba(255, 255, 255, 0.25)",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: Fonts.size.lg,
    fontWeight: "700",
    color: "#F3F4F6",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    marginBottom: 8,
  },
  modalOptionText: {
    fontSize: Fonts.size.sm,
    color: "#D1D5DB",
    fontWeight: "500",
    flex: 1,
  },
});
