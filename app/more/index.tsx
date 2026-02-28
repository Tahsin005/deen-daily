import { useMemo, useState } from "react";
import { Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { Theme } from "../../constants/Theme";
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
  const { method, school, shifting, calendar, setMethod, setSchool, setShifting, setCalendar } =
    usePrayerSettings();
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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>More</Text>
      <Text style={styles.subtitle}>Settings and more tools.</Text>
      <View style={styles.section}> 
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Prayer Settings</Text>

          <Pressable style={styles.settingRow} onPress={() => setActiveSetting("method")}>
            <View>
              <Text style={styles.settingLabel}>Method</Text>
              <Text style={styles.settingValue}>{currentMethodLabel}</Text>
            </View>
            <Text style={styles.settingAction}>Change</Text>
          </Pressable>

          <Pressable style={styles.settingRow} onPress={() => setActiveSetting("school")}>
            <View>
              <Text style={styles.settingLabel}>School</Text>
              <Text style={styles.settingValue}>{currentSchoolLabel}</Text>
            </View>
            <Text style={styles.settingAction}>Change</Text>
          </Pressable>

          <Pressable style={styles.settingRow} onPress={() => setActiveSetting("shifting")}>
            <View>
              <Text style={styles.settingLabel}>Shifting</Text>
              <Text style={styles.settingValue}>{currentShiftingLabel}</Text>
            </View>
            <Text style={styles.settingAction}>Change</Text>
          </Pressable>

          <Pressable style={styles.settingRow} onPress={() => setActiveSetting("calendar")}>
            <View>
              <Text style={styles.settingLabel}>Calendar</Text>
              <Text style={styles.settingValue}>{calendar}</Text>
            </View>
            <Text style={styles.settingAction}>Change</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Zakat Settings</Text>
          <Pressable style={styles.settingRow} onPress={() => setActiveSetting("zakatCurrency")}>
            <View>
              <Text style={styles.settingLabel}>Default currency</Text>
              <Text style={styles.settingValue}>{currentZakatCurrencyLabel}</Text>
            </View>
            <Text style={styles.settingAction}>Change</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Credits</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>API Providers</Text>
          <Text style={styles.creditText}>We’re grateful to these API providers:</Text>
          <Pressable
            style={styles.creditRow}
            onPress={() => Linking.openURL("https://islamicapi.com/")}
          >
            <Text style={styles.creditLabel}>Islamic API</Text>
            <Text style={styles.creditLink}>islamicapi.com</Text>
          </Pressable>
          <Pressable
            style={styles.creditRow}
            onPress={() => Linking.openURL("https://hadithapi.com/")}
          >
            <Text style={styles.creditLabel}>Hadith API</Text>
            <Text style={styles.creditLink}>hadithapi.com</Text>
          </Pressable>
        </View>
      </View>

      <Modal
        visible={Boolean(activeSetting)}
        animationType="fade"
        transparent
        onRequestClose={() => setActiveSetting(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setActiveSetting(null)}>
          <Pressable style={styles.modalCard} onPress={() => null}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select option</Text>
              <Pressable onPress={() => setActiveSetting(null)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.modalList}>
              {activeOptions.map((option) => (
                <Pressable
                  key={option.label}
                  style={styles.modalOption}
                  onPress={option.onSelect}
                >
                  <Text style={styles.modalOptionText}>{option.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 16,
  },
  content: {
    paddingTop: 24,
    paddingBottom: 32,
  },
  section: {
    marginTop: 18,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.icon,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.light.text,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: Colors.light.icon,
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 12,
  },
  creditText: {
    fontSize: 12,
    color: Colors.light.icon,
    marginBottom: 10,
  },
  creditRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.borderLight,
  },
  creditLabel: {
    fontSize: 13,
    color: Colors.light.text,
    fontWeight: "600",
  },
  creditLink: {
    fontSize: 12,
    color: Theme.colors.primary,
    fontWeight: "600",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.borderLight,
  },
  settingLabel: {
    fontSize: 13,
    color: Colors.light.icon,
  },
  settingValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
    marginTop: 4,
  },
  settingAction: {
    fontSize: 12,
    color: Colors.light.primary,
    fontWeight: "600",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 28, 0.45)",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  modalCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: 18,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
  },
  modalCloseText: {
    fontSize: 13,
    fontWeight: "600",
    color: Theme.colors.primary,
  },
  modalList: {
    paddingBottom: 12,
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: 10,
  },
  modalOptionText: {
    fontSize: 13,
    color: Colors.light.text,
  },
});
