import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { PrayerHeader } from "../../components/prayer/PrayerHeader";
import { PrayerTimesCard } from "../../components/prayer/PrayerTimesCard";
import { ProhibitedTimesCard } from "../../components/prayer/ProhibitedTimesCard";
import { QiblaCard } from "../../components/prayer/QiblaCard";
import { Colors } from "../../constants/Colors";
import { getPrayerTimes } from "../../lib/api/prayer/getPrayerTimes";
import { useLocalStorageString } from "../../lib/storage/useLocalStorageString";
import { usePrayerSettings } from "../../lib/storage/usePrayerSettings";

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
      />

      <PrayerTimesCard
        isLoading={prayerQuery.isLoading}
        error={prayerQuery.error}
        times={prayerTimes}
        now={currentTime}
      />

      <QiblaCard
        degrees={prayerData?.qibla.direction.degrees}
        directionFrom={prayerData?.qibla.direction.from}
        distanceValue={prayerData?.qibla.distance.value}
        distanceUnit={prayerData?.qibla.distance.unit}
      />

      <ProhibitedTimesCard times={prohibitedTimes} />
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
});
