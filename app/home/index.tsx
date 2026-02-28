import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
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
import { Colors } from "../../constants/Colors";
import { getFastingTimes } from "../../lib/api/fasting/getFastingTimes";
import { getPrayerTimes } from "../../lib/api/prayer/getPrayerTimes";
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


export default function HomeScreen() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [storedLocation] = useLocalStorageString("prayerLocation", "");
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

  const prayerData = prayerQuery.data?.data;
  const hijri = prayerData?.date?.hijri;
  const hijriReadable = hijri
    ? `${hijri.day} ${hijri.month.en} ${hijri.year} ${hijri.designation.abbreviated}`
    : "";
  const gregorianReadable = prayerData?.date?.readable ?? currentTime.toDateString();
  const prayerTimes = useMemo(() => prayerData?.times ?? {}, [prayerData?.times]);
  const fastingToday = fastingQuery.data?.data?.fasting?.[0];

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

  const showRamadanQuickLink = hijri?.month?.number === 9;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroCard}>
        <Text style={styles.greeting}>Assalamu Alaikum</Text>
        <Text style={styles.hijriDate}>{hijriReadable || "Hijri date available after location"}</Text>
        <Text style={styles.gregorianDate}>{gregorianReadable}</Text>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Next prayer</Text>
          <Pressable onPress={() => router.push("/prayer")}> 
            <Text style={styles.linkText}>Open Prayer</Text>
          </Pressable>
        </View>
        {!parsedLocation ? (
          <Text style={styles.statusText}>Enable location in Prayer to see times.</Text>
        ) : prayerQuery.isLoading ? (
          <View style={styles.statusRow}>
            <ActivityIndicator color={Colors.light.primary} />
            <Text style={styles.statusText}>Loading prayer times...</Text>
          </View>
        ) : prayerQuery.error ? (
          <Text style={styles.statusText}>Unable to load prayer times.</Text>
        ) : nextPrayer ? (
          <View style={styles.nextPrayerCard}>
            <View style={styles.nextPrayerRow}>
              <Ionicons name={nextPrayer.icon} size={22} color={Colors.light.primary} />
              <View style={styles.nextPrayerInfo}>
                <Text style={styles.nextPrayerLabel}>{nextPrayer.label}</Text>
                <Text style={styles.nextPrayerMeta}>Upcoming prayer</Text>
              </View>
              <Text style={styles.nextPrayerTime}>{prayerTimes[nextPrayer.key]}</Text>
            </View>
            {nextPrayerCountdown ? (
              <Text style={styles.countdownText}>Starts in {nextPrayerCountdown}</Text>
            ) : null}
          </View>
        ) : (
          <Text style={styles.statusText}>No prayer times available.</Text>
        )}
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Today’s prayer times</Text>
          <Pressable onPress={() => router.push("/prayer")}> 
            <Text style={styles.linkText}>See all</Text>
          </Pressable>
        </View>
        {parsedLocation && prayerQuery.isLoading ? (
          <View style={styles.statusRow}>
            <ActivityIndicator color={Colors.light.primary} />
            <Text style={styles.statusText}>Loading times...</Text>
          </View>
        ) : parsedLocation && prayerQuery.error ? (
          <Text style={styles.statusText}>Unable to load prayer times.</Text>
        ) : parsedLocation ? (
          <View style={styles.timesGrid}>
            {mainPrayerEntries.map((entry) => (
              <View key={entry.key} style={styles.timeItem}>
                <View style={styles.timeLabelRow}>
                  <Ionicons name={entry.icon} size={16} color={Colors.light.primary} />
                  <Text style={styles.timeLabel}>{entry.label}</Text>
                </View>
                <Text style={styles.timeValue}>{prayerTimes[entry.key] ?? "--"}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.statusText}>Set your location to see prayer times.</Text>
        )}
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Sahur & Iftar</Text>
          <Pressable onPress={() => router.push("/prayer")}> 
            <Text style={styles.linkText}>Fasting details</Text>
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
          <View style={styles.fastingRow}>
            <View style={styles.fastingItem}>
              <Text style={styles.fastingLabel}>Sahur ends</Text>
              <Text style={styles.fastingValue}>{fastingToday.time.sahur ?? "--"}</Text>
            </View>
            <View style={styles.fastingItem}>
              <Text style={styles.fastingLabel}>Iftar</Text>
              <Text style={styles.fastingValue}>{fastingToday.time.iftar ?? "--"}</Text>
            </View>
            <View style={styles.fastingItem}>
              <Text style={styles.fastingLabel}>Fast length</Text>
              <Text style={styles.fastingValue}>{fastingToday.time.duration ?? "--"}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.statusText}>No fasting info available.</Text>
        )}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.quickGrid}>
          <Pressable style={styles.quickButton} onPress={() => router.push("/quran")}> 
            <Ionicons name="book" size={20} color={Colors.light.primary} />
            <Text style={styles.quickText}>Quran</Text>
          </Pressable>
          <Pressable style={styles.quickButton} onPress={() => router.push("/hadith")}> 
            <Ionicons name="library" size={20} color={Colors.light.primary} />
            <Text style={styles.quickText}>Hadith</Text>
          </Pressable>
          <Pressable style={styles.quickButton} onPress={() => router.push("/prayer")}> 
            <Ionicons name="time" size={20} color={Colors.light.primary} />
            <Text style={styles.quickText}>Prayer</Text>
          </Pressable>
          {showRamadanQuickLink ? (
            <Pressable style={styles.quickButton} onPress={() => router.push("/prayer")}> 
              <Ionicons name="moon" size={20} color={Colors.light.primary} />
              <Text style={styles.quickText}>Ramadan</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
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
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    padding: 18,
    marginBottom: 14,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
  },
  hijriDate: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: "600",
    color: Colors.light.primary,
  },
  gregorianDate: {
    marginTop: 4,
    fontSize: 13,
    color: Colors.light.icon,
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
  nextPrayerCard: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 14,
  },
  nextPrayerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  nextPrayerInfo: {
    flex: 1,
  },
  nextPrayerLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.light.text,
  },
  nextPrayerMeta: {
    fontSize: 12,
    color: Colors.light.icon,
    marginTop: 4,
  },
  nextPrayerTime: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.light.text,
  },
  countdownText: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "600",
    color: Colors.light.primary,
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
  fastingRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  fastingItem: {
    flexGrow: 1,
    minWidth: "30%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  fastingLabel: {
    fontSize: 12,
    color: Colors.light.icon,
  },
  fastingValue: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  quickButton: {
    width: "47%",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    gap: 6,
  },
  quickText: {
    fontSize: 13,
    color: Colors.light.text,
    fontWeight: "600",
  },
});
