import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { GlobalLoader } from "../../components/common/GlobalLoader";
import { TodayFastingCard } from "../../components/fasting/TodayFastingCard";
import { WhiteDaysCard } from "../../components/fasting/WhiteDaysCard";
import { NextPrayerCard } from "../../components/prayer/NextPrayerCard";
import { PrayerTimesCard } from "../../components/prayer/PrayerTimesCard";
import { ProhibitedTimesCard } from "../../components/prayer/ProhibitedTimesCard";
import { RamadanBanner } from "../../components/ramadan/RamadanBanner";
import { RamadanScheduleCard } from "../../components/ramadan/RamadanScheduleCard";
import { Colors } from "../../constants/Colors";
import { getFastingTimes } from "../../lib/api/fasting/getFastingTimes";
import { getPrayerTimes } from "../../lib/api/prayer/getPrayerTimes";
import { getRamadanTimes } from "../../lib/api/ramadan/getRamadanTimes";
import { useLocalStorageString } from "../../lib/storage/useLocalStorageString";
import { usePrayerSettings } from "../../lib/storage/usePrayerSettings";

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

export default function PrayerScreen() {
  const { section } = useLocalSearchParams<{ section?: string }>();
  const [location, setLocation] = useState<StoredLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("No saved location yet.");
  const [storedLocation, setStoredLocation] = useLocalStorageString("prayerLocation", "");
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [activeSection, setActiveSection] = useState<"prayer" | "fasting">("prayer");
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

  if (isCheckingPermission) {
    return (
      <View style={styles.permissionContainer}>
        <GlobalLoader size={140} />
      </View>
    );
  }

  if (permissionStatus !== "granted" || !location) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionCard}>
          <Text style={styles.permissionTitle}>Location required</Text>
          <Text style={styles.permissionText}>
            We need your location to show prayer, fasting, and Ramadan times.
          </Text>
          <Pressable style={styles.permissionButton} onPress={fetchLocation}>
            <Text style={styles.permissionButtonText}>
              {permissionStatus === "denied" ? "Enable location" : "Share location"}
            </Text>
          </Pressable>
          {isLoading ? (
            <View style={styles.permissionLoading}>
              <ActivityIndicator color={Colors.light.primary} />
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
                <ActivityIndicator color={Colors.light.primary} />
                <Text style={styles.loadingText}>Loading fasting info...</Text>
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

            <Text style={styles.sectionTitle}>Ramadan</Text>
            {ramadanQuery.isLoading ? (
              <View style={styles.loadingCard}>
                <ActivityIndicator color={Colors.light.primary} />
                <Text style={styles.loadingText}>Loading Ramadan info...</Text>
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
      </ScrollView>

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
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
    marginTop: 6,
  },
  loadingCard: {
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
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
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    alignItems: "center",
    gap: 10,
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
  },
  permissionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: Colors.light.primary,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
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
  tabBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    padding: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    gap: 6,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.light.icon,
  },
  tabButtonTextActive: {
    color: "#FFFFFF",
  },
});
