import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AnimatedLogo } from "../../components/common/AnimatedLogo";
import { SkeletonBox, SkeletonLine } from "../../components/common/Skeleton";
import { TodayFastingCard } from "../../components/fasting/TodayFastingCard";
import { WhiteDaysCard } from "../../components/fasting/WhiteDaysCard";
import { NextPrayerCard } from "../../components/prayer/NextPrayerCard";
import { PrayerTimesCard } from "../../components/prayer/PrayerTimesCard";
import { ProhibitedTimesCard } from "../../components/prayer/ProhibitedTimesCard";
import { RamadanBanner } from "../../components/ramadan/RamadanBanner";
import { RamadanScheduleCard } from "../../components/ramadan/RamadanScheduleCard";
import { ZakatCalculatorCard } from "../../components/zakat/ZakatCalculatorCard";
import { ZakatNisabCard } from "../../components/zakat/ZakatNisabCard";
import { Colors } from "../../constants/Colors";
import { Theme } from "../../constants/Theme";
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

const formatReadableDate = (value?: string) => {
  if (!value) {
    return "";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

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
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("No saved location yet.");
  const [storedLocation, setStoredLocation] = useLocalStorageString("prayerLocation", "");
  const [storedZakatCurrency] = useLocalStorageString(
    "zakatCurrency",
    zakatDefaults.currency
  );
  const [asmaLanguage, setAsmaLanguage] = useLocalStorageString("asmaLanguage", "en");
  const [isAsmaLanguageOpen, setIsAsmaLanguageOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [activeSection, setActiveSection] = useState<
    "prayer" | "fasting" | "zakat" | "asma"
  >( "prayer" );
  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "undetermined"
  >("undetermined");
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);
  const { method, school, shifting, calendar } = usePrayerSettings();

  const parsedStoredLocation = useMemo(() => {
    if (!storedLocation) {
      return null;
    }
    try {
      return JSON.parse(storedLocation) as StoredLocation;
    } catch {
      return null;
    }
  }, [storedLocation]);

  const fetchLocation = async () => {
    try {
      setIsLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status === "granted" ? "granted" : "denied");
      if (status !== "granted") {
        setStatusMessage("Location permission denied.");
        return;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const nextLocation: StoredLocation = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        updatedAt: new Date().toISOString(),
      };
      setStoredLocation(JSON.stringify(nextLocation));
      setLocation(nextLocation);
      setStatusMessage("Location updated.");
    } catch {
      setStatusMessage("Unable to fetch location.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (parsedStoredLocation) {
      setLocation(parsedStoredLocation);
      setStatusMessage("Using saved location.");
    }
  }, [parsedStoredLocation]);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        setPermissionStatus(status === "granted" ? "granted" : "denied");
      } finally {
        setIsCheckingPermission(false);
      }
    };
    checkPermission();
  }, []);

  useEffect(() => {
    const tick = () => setCurrentTime(new Date());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (section === "fasting" || section === "ramadan") {
      setActiveSection("fasting");
    }
    if (section === "prayer") {
      setActiveSection("prayer");
    }
    if (section === "zakat") {
      setActiveSection("zakat");
    }
    if (section === "asma") {
      setActiveSection("asma");
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

  const fastingData = fastingQuery.data?.data;
  const today = fastingData?.fasting?.[0];
  const fastingDateLabel = formatReadableDate(today?.date);

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

  const ramadanData = ramadanQuery.data;
  const ramadanDays = ramadanData?.data.fasting ?? [];
  const ramadanYearLabel = ramadanData?.ramadan_year
    ? `Ramadan ${ramadanData.ramadan_year}`
    : "Ramadan";
  const ramadanDateRange =
    ramadanDays.length > 1
      ? `${formatReadableDate(ramadanDays[0].date)} – ${formatReadableDate(
          ramadanDays[ramadanDays.length - 1].date
        )}`
      : undefined;

  const zakatQuery = useQuery({
    queryKey: [
      "zakatNisab",
      zakatDefaults.standard,
      storedZakatCurrency,
      zakatDefaults.unit,
    ],
    queryFn: () =>
      getZakatNisab({
        standard: zakatDefaults.standard,
        currency: storedZakatCurrency,
        unit: zakatDefaults.unit,
      }),
  });

  const asmaQuery = useQuery({
    queryKey: ["asmaulHusna", asmaLanguage],
    queryFn: () => getAsmaulHusna(asmaLanguage),
  });

  const asmaNames = asmaQuery.data?.data.names ?? [];
  const currentAsmaLanguageLabel = useMemo(
    () =>
      asmaLanguageOptions.find((item) => item.value === asmaLanguage)?.label ??
      asmaLanguage.toUpperCase(),
    [asmaLanguage]
  );

  if (isCheckingPermission) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionCard}>
          <SkeletonBox style={styles.skeletonLogo} />
          <SkeletonLine style={styles.skeletonLine} />
          <SkeletonLine style={styles.skeletonLineWide} />
          <SkeletonLine style={styles.skeletonButton} />
        </View>
      </View>
    );
  }

  if (permissionStatus !== "granted" || !location) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionCard}>
          <View style={styles.logoWrap}>
            <AnimatedLogo size={64} />
          </View>
          <Text style={styles.permissionTitle}>Location required</Text>
          <Text style={styles.permissionText}>
            We need your location to show prayer, fasting, and Ramadan times.
          </Text>
          <Pressable style={styles.permissionButton} onPress={fetchLocation}>
            <Text style={styles.permissionButtonText}>
              {permissionStatus === "denied" ? "Enable location" : "Share location"}
            </Text>
          </Pressable>
          <Text style={styles.permissionHint}>You can change this later in settings.</Text>
          {isLoading ? (
            <View style={styles.permissionLoading}>
              <SkeletonBox style={styles.skeletonDot} />
              <Text style={styles.permissionStatus}>{statusMessage}</Text>
            </View>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {activeSection === "prayer" ? (
          <>
            <NextPrayerCard
              isLoading={prayerQuery.isLoading}
              error={prayerQuery.error}
              times={prayerTimes}
              now={currentTime}
            />

            <PrayerTimesCard
              isLoading={prayerQuery.isLoading}
              error={prayerQuery.error}
              times={prayerTimes}
            />

            <ProhibitedTimesCard times={prohibitedTimes} />
          </>
        ) : null}

        {activeSection === "fasting" ? (
          <View style={styles.sectionSpacing}>
            <Text style={styles.sectionTitle}>Fasting</Text>
            {fastingQuery.isLoading ? (
              <View style={styles.loadingCard}>
                <SkeletonBox style={styles.loadingDot} />
                <SkeletonLine style={styles.loadingLine} />
              </View>
            ) : fastingQuery.error ? (
              <View style={styles.loadingCard}>
                <Text style={styles.loadingText}>Unable to load fasting info.</Text>
              </View>
            ) : (
              <>
                <TodayFastingCard
                  dateLabel={fastingDateLabel}
                  hijriLabel={today?.hijri_readable}
                  sahur={today?.time.sahur}
                  iftar={today?.time.iftar}
                  duration={today?.time.duration}
                />
                <WhiteDaysCard whiteDays={fastingData?.white_days} />
              </>
            )}

            <Text style={styles.sectionTitle2}>Ramadan</Text>
            {ramadanQuery.isLoading ? (
              <View style={styles.loadingCard}>
                <SkeletonBox style={styles.loadingDot} />
                <SkeletonLine style={styles.loadingLine} />
              </View>
            ) : ramadanQuery.error ? (
              <View style={styles.loadingCard}>
                <Text style={styles.loadingText}>Unable to load Ramadan info.</Text>
              </View>
            ) : ramadanData ? (
              <>
                <RamadanBanner yearLabel={ramadanYearLabel} dateRange={ramadanDateRange} />
                <RamadanScheduleCard days={ramadanDays} />
              </>
            ) : (
              <Text style={styles.loadingText}>No Ramadan data available.</Text>
            )}
          </View>
        ) : null}

        {activeSection === "zakat" ? (
          <View style={styles.sectionSpacing}>
            <Text style={styles.sectionTitle}>Zakat</Text>
            {zakatQuery.isLoading ? (
              <View style={styles.loadingCard}>
                <SkeletonBox style={styles.loadingDot} />
                <SkeletonLine style={styles.loadingLine} />
              </View>
            ) : zakatQuery.error ? (
              <View style={styles.loadingCard}>
                <Text style={styles.loadingText}>Unable to load nisab values.</Text>
              </View>
            ) : zakatQuery.data ? (
              <ZakatNisabCard data={zakatQuery.data} />
            ) : (
              <Text style={styles.loadingText}>No nisab data available.</Text>
            )}
            <ZakatCalculatorCard defaultCurrency={storedZakatCurrency} />
          </View>
        ) : null}

        {activeSection === "asma" ? (
          <View style={styles.sectionSpacing}>
            <View style={styles.asmaHeader}>
              <View>
                <Text style={styles.sectionTitle}>Asma-ul Husna</Text>
                <Text style={styles.asmaSubtitle}>The 99 beautiful names of Allah</Text>
              </View>
              <Pressable onPress={() => setIsAsmaLanguageOpen(true)}>
                <Text style={styles.asmaLanguageButton}>{currentAsmaLanguageLabel}</Text>
              </Pressable>
            </View>

            {asmaQuery.isLoading ? (
              <View style={styles.loadingCard}>
                <SkeletonBox style={styles.loadingDot} />
                <SkeletonLine style={styles.loadingLine} />
              </View>
            ) : asmaQuery.error ? (
              <View style={styles.loadingCard}>
                <Text style={styles.loadingText}>Unable to load names right now.</Text>
              </View>
            ) : (
              <View style={styles.asmaList}>
                {asmaNames.map((name) => (
                  <View key={name.number} style={styles.asmaRow}>
                    <View style={styles.asmaBadge}>
                      <Text style={styles.asmaBadgeText}>{name.number}</Text>
                    </View>
                    <View style={styles.asmaContent}>
                      <Text style={styles.asmaArabic}>{name.name}</Text>
                      <Text style={styles.asmaTranslation}>
                        {name.transliteration} · {name.translation}
                      </Text>
                      <Text style={styles.asmaMeaning}>{name.meaning}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ) : null}
      </ScrollView>

      <Modal
        visible={isAsmaLanguageOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setIsAsmaLanguageOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setIsAsmaLanguageOpen(false)}>
          <Pressable style={styles.modalCard} onPress={() => null}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select language</Text>
              <Pressable onPress={() => setIsAsmaLanguageOpen(false)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.modalList}>
              {asmaLanguageOptions.map((option) => (
                <Pressable
                  key={option.label}
                  style={styles.modalOption}
                  onPress={() => {
                    setAsmaLanguage(option.value);
                    setIsAsmaLanguageOpen(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{option.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tabButton, activeSection === "prayer" && styles.tabButtonActive]}
          onPress={() => setActiveSection("prayer")}
        >
          <Text
            style={[styles.tabButtonText, activeSection === "prayer" && styles.tabButtonTextActive]}
          >
            Prayer
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabButton, activeSection === "fasting" && styles.tabButtonActive]}
          onPress={() => setActiveSection("fasting")}
        >
          <Text
            style={[styles.tabButtonText, activeSection === "fasting" && styles.tabButtonTextActive]}
          >
            Fasting
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabButton, activeSection === "zakat" && styles.tabButtonActive]}
          onPress={() => setActiveSection("zakat")}
        >
          <Text
            style={[styles.tabButtonText, activeSection === "zakat" && styles.tabButtonTextActive]}
          >
            Zakat
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabButton, activeSection === "asma" && styles.tabButtonActive]}
          onPress={() => setActiveSection("asma")}
        >
          <Text
            style={[styles.tabButtonText, activeSection === "asma" && styles.tabButtonTextActive]}
          >
            Asma
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  content: {
    paddingTop: 18,
    paddingBottom: 120,
  },
  sectionSpacing: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
    marginTop: 6,
  },
  sectionTitle2: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
    marginTop: 12,
  },
  loadingCard: {
    marginTop: 16,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.light.icon,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  permissionCard: {
  backgroundColor: Theme.colors.surface,
  borderRadius: Theme.radius.xl,
    paddingVertical: 24,
    paddingHorizontal: 22,
    borderWidth: 1,
  borderColor: Theme.colors.border,
    alignItems: "center",
    gap: 12,
  shadowColor: Theme.colors.text,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    width: "100%",
    maxWidth: 320,
  },
  logoWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
  backgroundColor: Theme.colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  logo: {
    width: 64,
    height: 64,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
  },
  permissionText: {
    fontSize: 13,
    color: Colors.light.icon,
    textAlign: "center",
    lineHeight: 18,
  },
  permissionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Theme.radius.pill,
    backgroundColor: Theme.colors.primary,
  },
  permissionButtonText: {
    color: Theme.colors.onPrimary,
    fontWeight: "600",
    fontSize: 13,
  },
  permissionHint: {
    fontSize: 12,
    color: Colors.light.icon,
    textAlign: "center",
  },
  permissionLoading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  permissionStatus: {
    fontSize: 12,
    color: Colors.light.icon,
  },
  skeletonLogo: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  skeletonLine: {
    width: 120,
    height: 12,
    borderRadius: 6,
  },
  skeletonLineWide: {
    width: 200,
    height: 12,
    borderRadius: 6,
  },
  skeletonButton: {
    width: 140,
    height: 32,
    borderRadius: 16,
  },
  skeletonDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  skeletonStatus: {
    width: 140,
    height: 10,
    borderRadius: 5,
  },
  loadingDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  loadingLine: {
    width: 160,
    height: 12,
    borderRadius: 6,
  },
  tabBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
  backgroundColor: Theme.colors.surface,
  borderRadius: Theme.radius.pill,
    padding: 6,
    borderWidth: 1,
  borderColor: Theme.colors.border,
    flexDirection: "row",
    gap: 6,
  shadowColor: Theme.colors.text,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Theme.radius.pill,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: Theme.colors.primary,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.light.icon,
  },
  tabButtonTextActive: {
    color: Theme.colors.onPrimary,
  },
  asmaHeader: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  asmaSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.light.icon,
  },
  asmaLanguageButton: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.light.primary,
  },
  asmaList: {
    marginTop: 12,
    gap: 12,
  },
  asmaRow: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.surface,
  },
  asmaBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.surfaceSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  asmaBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.light.primary,
  },
  asmaContent: {
    flex: 1,
    gap: 4,
  },
  asmaArabic: {
    fontSize: 18,
    color: Colors.light.text,
    textAlign: "right",
  },
  asmaTranslation: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.light.text,
  },
  asmaMeaning: {
    fontSize: 12,
    color: Colors.light.icon,
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
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    maxHeight: "70%",
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
    fontSize: 12,
    fontWeight: "600",
    color: Colors.light.primary,
  },
  modalList: {
    gap: 8,
    paddingBottom: 8,
  },
  modalOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: Theme.radius.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  modalOptionText: {
    fontSize: 13,
    color: Colors.light.text,
  },
});
