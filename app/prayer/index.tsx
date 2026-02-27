import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { TodayFastingCard } from "../../components/fasting/TodayFastingCard";
import { WhiteDaysCard } from "../../components/fasting/WhiteDaysCard";
import { PrayerHeader } from "../../components/prayer/PrayerHeader";
import { PrayerTimesCard } from "../../components/prayer/PrayerTimesCard";
import { ProhibitedTimesCard } from "../../components/prayer/ProhibitedTimesCard";
import { Colors } from "../../constants/Colors";
import { getFastingTimes } from "../../lib/api/fasting/getFastingTimes";
import { getPrayerTimes } from "../../lib/api/prayer/getPrayerTimes";
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
  const [location, setLocation] = useState<StoredLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("No saved location yet.");
  const [storedLocation, setStoredLocation] = useLocalStorageString("prayerLocation", "");
  const [currentTime, setCurrentTime] = useState(() => new Date());
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
    const tick = () => setCurrentTime(new Date());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

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
  const hijri = prayerData?.date?.hijri;
  const hijriReadable = hijri
    ? `${hijri.day} ${hijri.month.en} ${hijri.year} ${hijri.designation.abbreviated}`
    : "";
  const weekdayLabel = prayerData?.date?.gregorian?.weekday?.en ?? "";
  const weekdayArabic = prayerData?.date?.hijri?.weekday?.ar ?? "";
  const timezoneLine = prayerData
    ? `${prayerData.timezone.name} (${prayerData.timezone.abbreviation}) UTC ${prayerData.timezone.utc_offset}`
    : "";

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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <PrayerHeader
        gregorianDay={prayerData?.date?.gregorian?.day}
        gregorianMonth={prayerData?.date?.gregorian?.month?.en}
        readableDate={prayerData?.date?.readable}
        hijriReadable={hijriReadable}
        weekdayLabel={weekdayLabel}
        weekdayArabic={weekdayArabic}
        timezoneLine={timezoneLine}
        statusMessage={statusMessage}
        formattedTime={formattedTime}
        isLoading={isLoading}
        onRefresh={fetchLocation}
        qiblaDegrees={prayerData?.qibla.direction.degrees}
        qiblaDirectionFrom={prayerData?.qibla.direction.from}
        qiblaDistanceValue={prayerData?.qibla.distance.value}
        qiblaDistanceUnit={prayerData?.qibla.distance.unit}
      />

      <PrayerTimesCard
        isLoading={prayerQuery.isLoading}
        error={prayerQuery.error}
        times={prayerTimes}
        now={currentTime}
      />

      <ProhibitedTimesCard times={prohibitedTimes} />

      <View style={styles.fastingSection}>
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.background,
  },
  content: {
    paddingTop: 18,
    paddingBottom: 32,
  },
  fastingSection: {
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
});
