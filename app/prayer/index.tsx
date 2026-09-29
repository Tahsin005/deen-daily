import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { TodayFastingCard } from "../../components/fasting/TodayFastingCard";
import { WhiteDaysCard } from "../../components/fasting/WhiteDaysCard";
import { AmbientBackground } from "../../components/glass/AmbientBackground";
import { GlassCard } from "../../components/glass/GlassCard";
import { GlassPill } from "../../components/glass/GlassPill";
import { PrayerTimesCard } from "../../components/prayer/PrayerTimesCard";
import { ProhibitedTimesCard } from "../../components/prayer/ProhibitedTimesCard";
import { RamadanScheduleCard } from "../../components/ramadan/RamadanScheduleCard";
import { ZakatCalculatorCard } from "../../components/zakat/ZakatCalculatorCard";
import { ZakatNisabCard } from "../../components/zakat/ZakatNisabCard";
import { Fonts } from "../../constants/Fonts";
import { IslamicAPISettings } from "../../constants/settings/IslamicAPISettings";
import { getAsmaulHusna } from "../../lib/api/asmaulHusna/getAsmaulHusna";
import { getFastingTimes } from "../../lib/api/fasting/getFastingTimes";
import { getPrayerTimes } from "../../lib/api/prayer/getPrayerTimes";
import { getRamadanTimes } from "../../lib/api/ramadan/getRamadanTimes";
import { getZakatNisab } from "../../lib/api/zakat/getZakatNisab";
import { useLocalStorageString } from "../../lib/storage/useLocalStorageString";
import { usePrayerSettings } from "../../lib/storage/usePrayerSettings";

const asmaLanguageOptions = [
  { label: "English", value: "en" },
  { label: "বাংলা (Bengali)", value: "bn" },
  { label: "العربية (Arabic)", value: "ar" },
  { label: "اردو (Urdu)", value: "ur" },
  { label: "Türkçe (Turkish)", value: "tr" },
];

type StoredLocation = {
  latitude: number;
  longitude: number;
  updatedAt: string;
};

const zakatDefaults = IslamicAPISettings.zakatNisab.defaults as {
  standard: "classical" | "common";
  currency: string;
  unit: "g" | "oz";
};

export default function PrayerScreen() {
  const { section } = useLocalSearchParams<{ section?: string }>();
  const [location, setLocation] = useState<StoredLocation | null>(null);
  const [storedLocation] = useLocalStorageString("prayerLocation", "");
  const [storedZakatCurrency] = useLocalStorageString(
    "zakatCurrency",
    zakatDefaults.currency
  );
  const [asmaLanguage, setAsmaLanguage] = useLocalStorageString("asmaLanguage", "en");
  const [isAsmaLanguageOpen, setIsAsmaLanguageOpen] = useState(false);
  const [asmaSearch, setAsmaSearch] = useState("");
  const [activeSection, setActiveSection] = useState<
    "prayer" | "fasting" | "zakat" | "asma"
  >("prayer");
  const { method, school, shifting, calendar } = usePrayerSettings();

  const parsedStoredLocation = useMemo(() => {
    if (!storedLocation) return null;
    try {
      return JSON.parse(storedLocation) as StoredLocation;
    } catch {
      return null;
    }
  }, [storedLocation]);

  useEffect(() => {
    if (parsedStoredLocation) {
      setLocation(parsedStoredLocation);
    }
  }, [parsedStoredLocation]);

  useEffect(() => {
    if (section === "fasting" || section === "ramadan") {
      setActiveSection("fasting");
    } else if (section === "zakat") {
      setActiveSection("zakat");
    } else if (section === "asma") {
      setActiveSection("asma");
    } else if (section === "prayer") {
      setActiveSection("prayer");
    }
  }, [section]);

  const prayerQuery = useQuery({
    queryKey: [
      "prayerTimes",
      location?.latitude,
      location?.longitude,
      method,
      school,
      shifting,
      calendar,
    ],
    queryFn: () =>
      getPrayerTimes({
        latitude: location?.latitude ?? 0,
        longitude: location?.longitude ?? 0,
        method,
        school,
        shifting,
        calendar,
      }),
    enabled: Boolean(location),
  });

  const prayerData = prayerQuery.data?.data;
  const prayerTimes = prayerData?.times ?? {};
  const prohibitedTimes = prayerData?.prohibited_times;

  const fastingQuery = useQuery({
    queryKey: [
      "fastingTimes",
      location?.latitude,
      location?.longitude,
      method,
      shifting,
      calendar,
    ],
    queryFn: () =>
      getFastingTimes({
        latitude: location?.latitude ?? 0,
        longitude: location?.longitude ?? 0,
        method,
        shifting,
        calendar,
      }),
    enabled: Boolean(location),
  });

  const ramadanQuery = useQuery({
    queryKey: [
      "ramadanTimes",
      location?.latitude,
      location?.longitude,
      method,
      shifting,
      calendar,
    ],
    queryFn: () =>
      getRamadanTimes({
        latitude: location?.latitude ?? 0,
        longitude: location?.longitude ?? 0,
        method,
        shifting,
        calendar,
      }),
    enabled: Boolean(location),
  });

  const zakatQuery = useQuery({
    queryKey: ["zakatNisab", storedZakatCurrency],
    queryFn: () =>
      getZakatNisab({
        currency: storedZakatCurrency,
      }),
  });

  const asmaQuery = useQuery({
    queryKey: ["asmaulHusna", asmaLanguage],
    queryFn: () => getAsmaulHusna(asmaLanguage),
  });

  const fastingData = fastingQuery.data?.data;
  const todayFasting = fastingData?.fasting?.[0];
  const whiteDays = fastingData?.white_days;
  const ramadanData = ramadanQuery.data?.data;
  const zakatData = zakatQuery.data;

  const filteredNames = useMemo(() => {
    const names = asmaQuery.data?.data?.names ?? [];
    if (!asmaSearch.trim()) return names;
    const query = asmaSearch.toLowerCase();
    return names.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.transliteration.toLowerCase().includes(query) ||
        item.translation.toLowerCase().includes(query) ||
        item.meaning.toLowerCase().includes(query) ||
        item.number.toString().includes(query)
    );
  }, [asmaQuery.data?.data?.names, asmaSearch]);

  const currentLanguageLabel = useMemo(() => {
    return (
      asmaLanguageOptions.find((opt) => opt.value === asmaLanguage)?.label ?? "English"
    );
  }, [asmaLanguage]);

  return (
    <AmbientBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.header}>
          <Text style={styles.title}>Spiritual Hub</Text>
          <Text style={styles.subtitle}>Prayer, fasting, zakat, and remembrance.</Text>
        </View>


        <View style={styles.pillsRow}>
          <GlassPill
            label="Prayer"
            icon="moon"
            active={activeSection === "prayer"}
            onPress={() => setActiveSection("prayer")}
          />
          <GlassPill
            label="Fasting"
            icon="sunny"
            active={activeSection === "fasting"}
            onPress={() => setActiveSection("fasting")}
          />
          <GlassPill
            label="Zakat"
            icon="cash"
            active={activeSection === "zakat"}
            onPress={() => setActiveSection("zakat")}
          />
          <GlassPill
            label="99 Names"
            icon="sparkles"
            active={activeSection === "asma"}
            onPress={() => setActiveSection("asma")}
          />
        </View>


        {activeSection === "prayer" ? (
          <View style={styles.sectionContainer}>
            <PrayerTimesCard
              isLoading={prayerQuery.isLoading}
              error={prayerQuery.error}
              times={prayerTimes}
            />
            <ProhibitedTimesCard times={prohibitedTimes} />
          </View>
        ) : null}


        {activeSection === "fasting" ? (
          <View style={styles.sectionContainer}>
            <TodayFastingCard
              dateLabel={todayFasting?.date}
              hijriLabel={todayFasting?.hijri_readable}
              sahur={todayFasting?.time?.sahur}
              iftar={todayFasting?.time?.iftar}
              duration={todayFasting?.time?.duration}
            />
            {whiteDays?.days ? <WhiteDaysCard whiteDays={whiteDays} /> : null}
            {ramadanData?.fasting ? (
              <RamadanScheduleCard days={ramadanData.fasting} />
            ) : null}
          </View>
        ) : null}


        {activeSection === "zakat" ? (
          <View style={styles.sectionContainer}>
            {zakatData ? <ZakatNisabCard data={zakatData} /> : null}
            <ZakatCalculatorCard defaultCurrency={storedZakatCurrency} />
          </View>
        ) : null}


        {activeSection === "asma" ? (
          <View style={styles.sectionContainer}>

            <View style={styles.searchRow}>
              <View style={styles.searchInputWrap}>
                <Ionicons name="search" size={16} color="#9CA3AF" />
                <TextInput
                  placeholder="Search name, meaning..."
                  placeholderTextColor="#6B7280"
                  value={asmaSearch}
                  onChangeText={setAsmaSearch}
                  style={styles.searchInput}
                />
                {asmaSearch ? (
                  <Pressable onPress={() => setAsmaSearch("")}>
                    <Ionicons name="close-circle" size={16} color="#9CA3AF" />
                  </Pressable>
                ) : null}
              </View>

              <GlassPill
                label={currentLanguageLabel}
                icon="globe-outline"
                size="sm"
                onPress={() => setIsAsmaLanguageOpen(true)}
              />
            </View>


            <Text style={styles.resultsCount}>
              Showing {filteredNames.length} of 99 Names
            </Text>


            <View style={styles.namesList}>
              {filteredNames.map((name) => (
                <GlassCard key={name.number} variant="muted" style={styles.nameCard}>
                  <View style={styles.nameHeader}>
                    <View style={styles.nameNumberBadge}>
                      <Text style={styles.nameNumberText}>#{name.number}</Text>
                    </View>
                    <Text style={styles.nameArabic}>{name.name}</Text>
                  </View>
                  <Text style={styles.nameTransliteration}>
                    {name.transliteration} · {name.translation}
                  </Text>
                  <Text style={styles.nameMeaning}>{name.meaning}</Text>
                </GlassCard>
              ))}
            </View>
          </View>
        ) : null}


        <View style={{ height: 110 }} />
      </ScrollView>


      <Modal
        visible={isAsmaLanguageOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAsmaLanguageOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsAsmaLanguageOpen(false)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Translation Language</Text>
            {asmaLanguageOptions.map((opt) => (
              <Pressable
                key={opt.value}
                onPress={() => {
                  setAsmaLanguage(opt.value);
                  setIsAsmaLanguageOpen(false);
                }}
                style={[
                  styles.languageOption,
                  asmaLanguage === opt.value && styles.languageOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.languageOptionText,
                    asmaLanguage === opt.value && styles.languageOptionTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
                {asmaLanguage === opt.value ? (
                  <Ionicons name="checkmark-circle" size={18} color="#48A111" />
                ) : null}
              </Pressable>
            ))}
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
  },
  content: {
    paddingTop: 16,
  },
  header: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: Fonts.size.mega,
    fontWeight: "700",
    color: "#F3F4F6",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: Fonts.size.sm,
    color: "#9CA3AF",
    marginTop: 2,
  },
  pillsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
    flexWrap: "wrap",
    paddingHorizontal: 4,
  },
  sectionContainer: {
    gap: 12,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
    marginBottom: 12,
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.09)",
  },
  searchInput: {
    flex: 1,
    color: "#F3F4F6",
    fontSize: Fonts.size.sm,
  },
  resultsCount: {
    fontSize: Fonts.size.xs,
    color: "#6B7280",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  namesList: {
    gap: 10,
  },
  nameCard: {
    padding: 14,
    gap: 6,
  },
  nameHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nameNumberBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: "rgba(242, 181, 11, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(242, 181, 11, 0.3)",
  },
  nameNumberText: {
    fontSize: Fonts.size.xs,
    fontWeight: "700",
    color: "#F2B50B",
  },
  nameArabic: {
    fontSize: Fonts.size.xxl,
    fontWeight: "700",
    color: "#FDE68A",
    textAlign: "right",
  },
  nameTransliteration: {
    fontSize: Fonts.size.md,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  nameMeaning: {
    fontSize: Fonts.size.sm,
    color: "#9CA3AF",
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "rgba(22, 28, 24, 0.95)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderTopColor: "rgba(255, 255, 255, 0.25)",
    gap: 10,
  },
  modalTitle: {
    fontSize: Fonts.size.lg,
    fontWeight: "700",
    color: "#F3F4F6",
    marginBottom: 8,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
  languageOptionActive: {
    backgroundColor: "rgba(37, 103, 30, 0.35)",
    borderColor: "rgba(72, 161, 17, 0.4)",
    borderWidth: 1,
  },
  languageOptionText: {
    fontSize: Fonts.size.sm,
    color: "#D1D5DB",
    fontWeight: "500",
  },
  languageOptionTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
