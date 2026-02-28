import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GlobalLoader } from "../../components/common/GlobalLoader";
import { TodayFastingCard } from "../../components/fasting/TodayFastingCard";
import { NextPrayerCard } from "../../components/prayer/NextPrayerCard";
import { PrayerHeader } from "../../components/prayer/PrayerHeader";
import { PrayerTimesModal } from "../../components/prayer/PrayerTimesModal";
import { DuaCard } from "../../components/ramadan/DuaCard";
import { HadithCardRamadan } from "../../components/ramadan/HadithCardRamadan";
import { Colors } from "../../constants/Colors";
import { getFastingTimes } from "../../lib/api/fasting/getFastingTimes";
import { getPrayerTimes } from "../../lib/api/prayer/getPrayerTimes";
import { getRamadanTimes } from "../../lib/api/ramadan/getRamadanTimes";
import { useLocalStorageString } from "../../lib/storage/useLocalStorageString";
import { usePrayerSettings } from "../../lib/storage/usePrayerSettings";

type StoredLocation = {
  latitude: number;
  longitude: number;
  updatedAt: string;
};

const mainPrayerEntries = [
  { key: "Fajr", label: "Fajr", icon: "moon" as const },
  { key: "Sunrise", label: "Sunrise", icon: "sunny" as const },
  { key: "Dhuhr", label: "Dhuhr", icon: "sunny-outline" as const },
  { key: "Asr", label: "Asr", icon: "partly-sunny" as const },
  { key: "Maghrib", label: "Maghrib", icon: "partly-sunny" as const },
  { key: "Isha", label: "Isha", icon: "moon" as const },
];


const parseTimeToMinutes = (value?: string) => {
  if (!value) {
    return null;
  }
  const trimmed = value.trim();
  const timeMatch = trimmed.match(/(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i);
  if (!timeMatch) {
    return null;
  }
  const hoursRaw = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2]);
  const meridiem = timeMatch[3]?.toUpperCase();
  if (Number.isNaN(hoursRaw) || Number.isNaN(minutes)) {
    return null;
  }
  let hours = hoursRaw;
  if (meridiem === "AM" && hours === 12) {
    hours = 0;
  }
  if (meridiem === "PM" && hours < 12) {
    hours += 12;
  }
  return hours * 60 + minutes;
};

const formatCountdown = (diffMs: number) => {
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

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


export default function HomeScreen() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
  const [storedLocation, setStoredLocation] = useLocalStorageString("prayerLocation", "");
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  const [statusMessage, setStatusMessage] = useState("No saved location yet.");
  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "undetermined"
  >("undetermined");
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);
  const { method, school, shifting, calendar } = usePrayerSettings();

  const parsedLocation = useMemo(() => {
    if (!storedLocation) {
      return null;
    }
    try {
      return JSON.parse(storedLocation) as StoredLocation;
    } catch {
      return null;
    }
  }, [storedLocation]);

  useEffect(() => {
    const tick = () => setCurrentTime(new Date());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const prayerQuery = useQuery({
    queryKey: [
      "homePrayerTimes",
      parsedLocation?.latitude,
      parsedLocation?.longitude,
      method,
      school,
      shifting,
      calendar,
    ],
    queryFn: () =>
      getPrayerTimes({
        latitude: parsedLocation?.latitude ?? 0,
        longitude: parsedLocation?.longitude ?? 0,
        method,
        school,
        shifting,
        calendar,
      }),
    enabled: Boolean(parsedLocation),
  });

  const fastingQuery = useQuery({
    queryKey: [
      "homeFastingTimes",
      parsedLocation?.latitude,
      parsedLocation?.longitude,
      method,
      shifting,
      calendar,
    ],
    queryFn: () =>
      getFastingTimes({
        latitude: parsedLocation?.latitude ?? 0,
        longitude: parsedLocation?.longitude ?? 0,
        method,
        shifting,
        calendar,
      }),
    enabled: Boolean(parsedLocation),
  });

  const ramadanQuery = useQuery({
    queryKey: [
      "homeRamadanTimes",
      parsedLocation?.latitude,
      parsedLocation?.longitude,
      method,
      shifting,
      calendar,
    ],
    queryFn: () =>
      getRamadanTimes({
        latitude: parsedLocation?.latitude ?? 0,
        longitude: parsedLocation?.longitude ?? 0,
        method,
        shifting,
        calendar,
      }),
    enabled: Boolean(parsedLocation),
  });

  const prayerData = prayerQuery.data?.data;
  const hijri = prayerData?.date?.hijri;
  const hijriReadable = hijri
    ? `${hijri.day} ${hijri.month.en} ${hijri.year} ${hijri.designation.abbreviated}`
    : "";
  const gregorianReadable = prayerData?.date?.readable ?? currentTime.toDateString();
  const weekdayLabel = prayerData?.date?.gregorian?.weekday?.en ?? "";
  const weekdayArabic = prayerData?.date?.hijri?.weekday?.ar ?? "";
  const timezoneLine = prayerData
    ? `${prayerData.timezone.name} (${prayerData.timezone.abbreviation}) UTC ${prayerData.timezone.utc_offset}`
    : "";
  const derivedStatusMessage = parsedLocation
    ? "Using saved location."
    : "Set location in Prayer to see times.";
  const prayerTimes = useMemo(() => prayerData?.times ?? {}, [prayerData?.times]);
  const fastingToday = fastingQuery.data?.data?.fasting?.[0];
  const fastingDateLabel = formatReadableDate(fastingToday?.date);
  const ramadanData = ramadanQuery.data;

  const nextPrayer = useMemo(() => {
    const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes() + currentTime.getSeconds() / 60;
    const ordered = mainPrayerEntries
      .map((entry) => ({
        ...entry,
        minutes: parseTimeToMinutes(prayerTimes[entry.key]) ?? null,
      }))
      .filter((entry) => entry.minutes !== null)
      .sort((a, b) => (a.minutes ?? 0) - (b.minutes ?? 0));

    if (!ordered.length) {
      return null;
    }

    const upcoming = ordered.find((entry) => (entry.minutes ?? 0) > nowMinutes);
    return upcoming ?? ordered[0];
  }, [currentTime, prayerTimes]);

  const nextPrayerCountdown = useMemo(() => {
    if (!nextPrayer?.minutes) {
      return null;
    }
    const now = currentTime;
    const target = new Date(now);
    target.setHours(0, 0, 0, 0);
    target.setMinutes(nextPrayer.minutes);
    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }
    return formatCountdown(target.getTime() - now.getTime());
  }, [currentTime, nextPrayer]);

  const refreshLocation = async () => {
    try {
      setIsUpdatingLocation(true);
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
      setStatusMessage("Location updated.");
      await Promise.all([
        prayerQuery.refetch(),
        fastingQuery.refetch(),
        ramadanQuery.refetch(),
      ]);
    } catch {
      setStatusMessage("Unable to fetch location.");
    } finally {
      setIsUpdatingLocation(false);
    }
  };

  if (isCheckingPermission) {
    return (
      <View style={styles.permissionContainer}>
        <GlobalLoader size={140} />
      </View>
    );
  }

  if (permissionStatus !== "granted" || !parsedLocation) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionCard}>
          <Text style={styles.permissionTitle}>Location required</Text>
          <Text style={styles.permissionText}>
            We need your location to show prayer, fasting, and Ramadan times.
          </Text>
          <Pressable style={styles.permissionButton} onPress={refreshLocation}>
            <Text style={styles.permissionButtonText}>
              {permissionStatus === "denied" ? "Enable location" : "Share location"}
            </Text>
          </Pressable>
          {isUpdatingLocation ? (
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <PrayerHeader
        gregorianDay={prayerData?.date?.gregorian?.day}
        gregorianMonth={prayerData?.date?.gregorian?.month?.en}
        readableDate={gregorianReadable}
        hijriReadable={hijriReadable}
        weekdayLabel={weekdayLabel}
        weekdayArabic={weekdayArabic}
        timezoneLine={timezoneLine}
        statusMessage={derivedStatusMessage}
        formattedTime={currentTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
        isLoading={prayerQuery.isLoading || isUpdatingLocation}
        onRefresh={refreshLocation}
        qiblaDegrees={prayerData?.qibla.direction.degrees}
        qiblaDirectionFrom={prayerData?.qibla.direction.from}
        qiblaDistanceValue={prayerData?.qibla.distance.value}
        qiblaDistanceUnit={prayerData?.qibla.distance.unit}
      />

      <View>
        <NextPrayerCard
          isLoading={prayerQuery.isLoading}
          error={prayerQuery.error}
          times={prayerTimes}
          now={currentTime}
          title="Next prayer"
          actionLabel="See all"
          onActionPress={() => setIsPrayerModalOpen(true)}
          footerText={nextPrayerCountdown ? `Starts in ${nextPrayerCountdown}` : undefined}
          footerActionLabel="See details"
          onFooterActionPress={() => router.push("/prayer")}
          emptyStateText={
            parsedLocation
              ? "No prayer times available yet."
              : "Enable location in Prayer to see times."
          }
        />
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Sahur & Iftar</Text>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/prayer",
                params: { section: "fasting" },
              })
            }
          >
            <Text style={styles.linkText}>Show details</Text>
          </Pressable>
        </View>
        {!parsedLocation ? (
          <Text style={styles.statusText}>Set your location to see fasting times.</Text>
        ) : fastingQuery.isLoading ? (
          <View style={styles.statusRow}>
            <ActivityIndicator color={Colors.light.primary} />
            <Text style={styles.statusText}>Loading fasting times...</Text>
          </View>
        ) : fastingQuery.error ? (
          <Text style={styles.statusText}>Unable to load fasting info.</Text>
        ) : fastingToday ? (
          <TodayFastingCard
            dateLabel={fastingDateLabel}
            hijriLabel={fastingToday.hijri_readable}
            sahur={fastingToday.time.sahur}
            iftar={fastingToday.time.iftar}
            duration={fastingToday.time.duration}
          />
        ) : (
          <Text style={styles.statusText}>No fasting info available.</Text>
        )}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Dua and Hadith of the Day</Text>
        {ramadanQuery.isLoading ? (
          <View style={styles.statusRow}>
            <ActivityIndicator color={Colors.light.primary} />
            <Text style={styles.statusText}>Loading daily content...</Text>
          </View>
        ) : ramadanQuery.error ? (
          <Text style={styles.statusText}>Unable to load daily content.</Text>
        ) : ramadanData?.resource ? (
          <>
            {ramadanData.resource.dua ? (
              <DuaCard
                title={ramadanData.resource.dua.title}
                arabic={ramadanData.resource.dua.arabic}
                translation={ramadanData.resource.dua.translation}
                reference={ramadanData.resource.dua.reference}
              />
            ) : (
              <Text style={styles.statusText}>No dua available today.</Text>
            )}
            {ramadanData.resource.hadith ? (
              <HadithCardRamadan
                arabic={ramadanData.resource.hadith.arabic}
                english={ramadanData.resource.hadith.english}
                source={ramadanData.resource.hadith.source}
                grade={ramadanData.resource.hadith.grade}
              />
            ) : (
              <Text style={styles.statusText}>No hadith available today.</Text>
            )}
          </>
        ) : (
          <Text style={styles.statusText}>No daily content available.</Text>
        )}
      </View>

      <PrayerTimesModal
        visible={isPrayerModalOpen}
        onClose={() => setIsPrayerModalOpen(false)}
        times={prayerTimes}
      />
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
    paddingTop: 18,
    paddingBottom: 32,
  },
  sectionCard: {
    marginTop: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    padding: 16,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
  },
  linkText: {
    fontSize: 12,
    color: Colors.light.primary,
    fontWeight: "600",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statusText: {
    fontSize: 13,
    color: Colors.light.icon,
  },
  timesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  timeItem: {
    width: "48%",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  timeLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  timeLabel: {
    fontSize: 12,
    color: Colors.light.icon,
  },
  timeValue: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.light.text,
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
});
