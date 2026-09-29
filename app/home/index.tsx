import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AnimatedLogo } from "../../components/common/AnimatedLogo";
import { SkeletonBox, SkeletonLine } from "../../components/common/Skeleton";
import { AmbientBackground } from "../../components/glass/AmbientBackground";
import { GlassButton } from "../../components/glass/GlassButton";
import { GlassCard } from "../../components/glass/GlassCard";
import { GlassPill } from "../../components/glass/GlassPill";
import { PrayerTimesModal } from "../../components/prayer/PrayerTimesModal";
import { Fonts } from "../../constants/Fonts";
import { getAsmaulHusna } from "../../lib/api/asmaulHusna/getAsmaulHusna";
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
  if (!value) return null;
  const trimmed = value.trim();
  const timeMatch = trimmed.match(/(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i);
  if (!timeMatch) return null;
  const hoursRaw = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2]);
  const meridiem = timeMatch[3]?.toUpperCase();
  if (Number.isNaN(hoursRaw) || Number.isNaN(minutes)) return null;
  let hours = hoursRaw;
  if (meridiem === "AM" && hours === 12) hours = 0;
  if (meridiem === "PM" && hours < 12) hours += 12;
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
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getDayOfYear = (date: Date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export default function HomeScreen() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
  const [storedLocation, setStoredLocation] = useLocalStorageString("prayerLocation", "");
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  const [statusMessage, setStatusMessage] = useState("No saved location yet.");
  const [asmaLanguage] = useLocalStorageString("asmaLanguage", "en");
  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "undetermined"
  >("undetermined");
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);
  const { method, school, shifting, calendar } = usePrayerSettings();

  const parsedLocation = useMemo(() => {
    if (!storedLocation) return null;
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

  const asmaQuery = useQuery({
    queryKey: ["asmaulHusna", asmaLanguage],
    queryFn: () => getAsmaulHusna(asmaLanguage),
  });

  const prayerData = prayerQuery.data?.data;
  const hijri = prayerData?.date?.hijri;
  const hijriReadable = hijri
    ? `${hijri.day} ${hijri.month.en} ${hijri.year} ${hijri.designation.abbreviated}`
    : "Loading Hijri date...";
  const gregorianReadable = prayerData?.date?.readable ?? currentTime.toDateString();
  const weekdayLabel = prayerData?.date?.gregorian?.weekday?.en ?? "";
  const weekdayArabic = prayerData?.date?.hijri?.weekday?.ar ?? "";
  const prayerTimes = useMemo(() => prayerData?.times ?? {}, [prayerData?.times]);
  const fastingToday = fastingQuery.data?.data?.fasting?.[0];
  const fastingDateLabel = formatReadableDate(fastingToday?.date);
  const ramadanData = ramadanQuery.data;

  const nameOfTheDay = useMemo(() => {
    const names = asmaQuery.data?.data?.names ?? [];
    if (!names.length) return null;
    const index = getDayOfYear(new Date()) % names.length;
    return names[index];
  }, [asmaQuery.data?.data?.names]);

  const nextPrayer = useMemo(() => {
    const nowMinutes =
      currentTime.getHours() * 60 +
      currentTime.getMinutes() +
      currentTime.getSeconds() / 60;
    const ordered = mainPrayerEntries
      .map((entry) => ({
        ...entry,
        minutes: parseTimeToMinutes(prayerTimes[entry.key]) ?? null,
      }))
      .filter((entry) => entry.minutes !== null)
      .sort((a, b) => (a.minutes ?? 0) - (b.minutes ?? 0));

    if (!ordered.length) return null;

    const upcoming = ordered.find((entry) => (entry.minutes ?? 0) > nowMinutes);
    return upcoming ?? ordered[0];
  }, [currentTime, prayerTimes]);

  const nextPrayerCountdown = useMemo(() => {
    if (!nextPrayer?.minutes) return null;
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

  const handleShare = async (title: string, message: string) => {
    try {
      await Share.share({
        title,
        message: `${title}\n\n${message}\n\nShared via Deen Daily`,
      });
    } catch {
      // ignore
    }
  };

  // Loading Permission State
  if (isCheckingPermission) {
    return (
      <AmbientBackground>
        <View style={styles.permissionContainer}>
          <GlassCard style={styles.permissionCard}>
            <SkeletonBox style={styles.skeletonLogo} />
            <SkeletonLine style={styles.skeletonLine} />
            <SkeletonLine style={styles.skeletonLineWide} />
          </GlassCard>
        </View>
      </AmbientBackground>
    );
  }

  // Permission Required State
  if (permissionStatus !== "granted" || !parsedLocation) {
    return (
      <AmbientBackground>
        <View style={styles.permissionContainer}>
          <GlassCard style={styles.permissionCard}>
            <View style={styles.logoWrap}>
              <AnimatedLogo size={64} />
            </View>
            <Text style={styles.permissionTitle}>Location Required</Text>
            <Text style={styles.permissionText}>
              We need your location to calculate accurate prayer, fasting, and Qibla bearings.
            </Text>
            <GlassButton
              title={permissionStatus === "denied" ? "Enable Location" : "Share Location"}
              icon="navigate"
              onPress={refreshLocation}
              size="md"
              variant="primary"
            />
            <Text style={styles.permissionHint}>You can update your location anytime.</Text>
            {isUpdatingLocation ? (
              <View style={styles.permissionLoading}>
                <SkeletonBox style={styles.skeletonDot} />
                <Text style={styles.permissionStatus}>{statusMessage}</Text>
              </View>
            ) : null}
          </GlassCard>
        </View>
      </AmbientBackground>
    );
  }

  const qiblaDegrees = prayerData?.qibla?.direction?.degrees;
  const qiblaDistance = prayerData?.qibla?.distance?.value;
  const qiblaUnit = prayerData?.qibla?.distance?.unit;

  return (
    <AmbientBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.topBar}>
          <View>
            <Text style={styles.appTitle}>Deen Daily</Text>
            <Text style={styles.hijriHeader}>{hijriReadable}</Text>
          </View>
          <GlassPill
            label={isUpdatingLocation ? "Locating..." : "Update"}
            icon="locate"
            size="sm"
            onPress={refreshLocation}
          />
        </View>


        <GlassCard variant="elevated" style={styles.heroCard}>

          <View style={styles.heroTopRow}>
            <View style={styles.heroDateInfo}>
              <Text style={styles.heroGregorianDate}>{gregorianReadable}</Text>
              <Text style={styles.heroWeekday}>
                {weekdayLabel} {weekdayArabic ? `· ${weekdayArabic}` : ""}
              </Text>
            </View>
            <View style={styles.heroClockWrap}>
              <Text style={styles.heroClockLabel}>LIVE</Text>
              <Text style={styles.heroClockTime}>
                {currentTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </Text>
            </View>
          </View>


          <View style={styles.nextPrayerHighlight}>
            <View style={styles.nextPrayerLeft}>
              <View style={styles.nextPrayerIconBadge}>
                <Ionicons
                  name={nextPrayer?.icon ?? "moon"}
                  size={24}
                  color="#48A111"
                />
              </View>
              <View>
                <Text style={styles.nextPrayerSub}>UPCOMING PRAYER</Text>
                <Text style={styles.nextPrayerName}>{nextPrayer?.label ?? "Fajr"}</Text>
              </View>
            </View>
            <Text style={styles.nextPrayerTime}>
              {nextPrayer ? prayerTimes[nextPrayer.key] : "--:--"}
            </Text>
          </View>


          <View style={styles.heroBottomRow}>
            {nextPrayerCountdown ? (
              <View style={styles.countdownBadge}>
                <Ionicons name="time-outline" size={14} color="#F2B50B" />
                <Text style={styles.countdownText}>Starts in {nextPrayerCountdown}</Text>
              </View>
            ) : null}

            {typeof qiblaDegrees === "number" ? (
              <View style={styles.qiblaBadge}>
                <Ionicons name="compass-outline" size={14} color="#9CA3AF" />
                <Text style={styles.qiblaText}>
                  {qiblaDegrees.toFixed(0)}° Qibla ({qiblaDistance?.toFixed(0)} {qiblaUnit})
                </Text>
              </View>
            ) : null}
          </View>


          <Pressable
            style={styles.heroAction}
            onPress={() => setIsPrayerModalOpen(true)}
          >
            <Text style={styles.heroActionText}>View Full Timetable</Text>
            <Ionicons name="chevron-forward" size={14} color="#48A111" />
          </Pressable>
        </GlassCard>


        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionLabel}>QUICK SHORTCUTS</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsScroll}
          >
            <GlassPill
              label="Qibla & Times"
              icon="compass"
              onPress={() => router.push("/prayer")}
            />
            <GlassPill
              label="Read Quran"
              icon="book"
              onPress={() => router.push("/quran")}
            />
            <GlassPill
              label="Hadith Library"
              icon="library"
              onPress={() => router.push("/hadith")}
            />
            <GlassPill
              label="Fasting & Ramadan"
              icon="calendar"
              onPress={() =>
                router.push({ pathname: "/prayer", params: { section: "fasting" } })
              }
            />
            <GlassPill
              label="99 Names"
              icon="sparkles"
              onPress={() =>
                router.push({ pathname: "/prayer", params: { section: "asma" } })
              }
            />
            <GlassPill
              label="Zakat Calculator"
              icon="calculator"
              onPress={() =>
                router.push({ pathname: "/prayer", params: { section: "zakat" } })
              }
            />
          </ScrollView>
        </View>


        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionCategory}>DAILY REFLECTION</Text>
              <Text style={styles.sectionTitle}>Asma-ul Husna</Text>
            </View>
            <GlassPill
              label="View All 99"
              size="sm"
              variant="gold"
              onPress={() =>
                router.push({ pathname: "/prayer", params: { section: "asma" } })
              }
            />
          </View>

          <GlassCard variant="goldTint" style={styles.asmaCard}>
            {nameOfTheDay ? (
              <View style={styles.asmaInner}>
                <View style={styles.asmaTopRow}>
                  <View style={styles.asmaNumberBadge}>
                    <Text style={styles.asmaNumberText}>#{nameOfTheDay.number}</Text>
                  </View>
                  <Text style={styles.asmaArabic}>{nameOfTheDay.name}</Text>
                </View>
                <Text style={styles.asmaTitle}>
                  {nameOfTheDay.transliteration} · {nameOfTheDay.translation}
                </Text>
                <Text style={styles.asmaMeaning}>{nameOfTheDay.meaning}</Text>
              </View>
            ) : asmaQuery.isLoading ? (
              <View style={styles.loadingBox}>
                <SkeletonLine style={{ width: "60%", height: 14 }} />
                <SkeletonLine style={{ width: "90%", height: 12, marginTop: 8 }} />
              </View>
            ) : (
              <Text style={styles.emptyText}>No name available for today.</Text>
            )}
          </GlassCard>
        </View>


        {fastingToday ? (
          <View style={styles.sectionWrap}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionCategory}>FASTING TIMETABLE</Text>
                <Text style={styles.sectionTitle}>Sahur & Iftar</Text>
              </View>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/prayer",
                    params: { section: "fasting" },
                  })
                }
              >
                <Text style={styles.linkAction}>Details</Text>
              </Pressable>
            </View>

            <GlassCard style={styles.fastingCard}>
              <View style={styles.fastingRow}>
                <View style={styles.fastingItem}>
                  <View style={styles.fastingIconWrap}>
                    <Ionicons name="moon" size={18} color="#48A111" />
                    <Text style={styles.fastingLabel}>Sahur (Dawn)</Text>
                  </View>
                  <Text style={styles.fastingTime}>{fastingToday.time?.sahur}</Text>
                </View>

                <View style={styles.fastingDivider} />

                <View style={styles.fastingItem}>
                  <View style={styles.fastingIconWrap}>
                    <Ionicons name="sunny" size={18} color="#F2B50B" />
                    <Text style={styles.fastingLabel}>Iftar (Sunset)</Text>
                  </View>
                  <Text style={styles.fastingTime}>{fastingToday.time?.iftar}</Text>
                </View>
              </View>

              {fastingToday.time?.duration ? (
                <View style={styles.durationPill}>
                  <Ionicons name="hourglass-outline" size={12} color="#9CA3AF" />
                  <Text style={styles.durationText}>
                    Fasting Duration: {fastingToday.time.duration}
                  </Text>
                </View>
              ) : null}
            </GlassCard>
          </View>
        ) : null}


        {ramadanData?.resource?.dua || ramadanData?.resource?.hadith ? (
          <View style={styles.sectionWrap}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionCategory}>DAILY INSPIRATION</Text>
                <Text style={styles.sectionTitle}>Dua & Hadith</Text>
              </View>
            </View>

            {ramadanData?.resource?.dua ? (() => {
              const dua = ramadanData.resource.dua;
              return (
                <GlassCard style={styles.inspirationCard}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.cardIconWrap}>
                      <Ionicons name="sparkles" size={16} color="#48A111" />
                      <Text style={styles.cardHeaderTag}>DUA OF THE DAY</Text>
                    </View>
                    <Pressable
                      onPress={() =>
                        handleShare(
                          dua.title ?? "Daily Dua",
                          `${dua.arabic}\n\n${dua.translation}`
                        )
                      }
                      style={styles.shareIconBtn}
                    >
                      <Ionicons name="share-outline" size={18} color="#9CA3AF" />
                    </Pressable>
                  </View>

                  <Text style={styles.arabicScriptText}>{dua.arabic}</Text>
                  <Text style={styles.translationText}>{dua.translation}</Text>
                  {dua.reference ? (
                    <Text style={styles.referenceText}>Source: {dua.reference}</Text>
                  ) : null}
                </GlassCard>
              );
            })() : null}

            {ramadanData?.resource?.hadith ? (() => {
              const hadith = ramadanData.resource.hadith;
              return (
                <GlassCard style={[styles.inspirationCard, { marginTop: 12 }]}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.cardIconWrap}>
                      <Ionicons name="book-outline" size={16} color="#F2B50B" />
                      <Text style={[styles.cardHeaderTag, { color: "#FDE68A" }]}>
                        HADITH OF THE DAY
                      </Text>
                    </View>
                    <Pressable
                      onPress={() =>
                        handleShare(
                          "Daily Hadith",
                          `${hadith.arabic}\n\n${hadith.english}`
                        )
                      }
                      style={styles.shareIconBtn}
                    >
                      <Ionicons name="share-outline" size={18} color="#9CA3AF" />
                    </Pressable>
                  </View>

                  {hadith.arabic ? (
                    <Text style={styles.arabicScriptText}>{hadith.arabic}</Text>
                  ) : null}
                  <Text style={styles.translationText}>{hadith.english}</Text>
                  <View style={styles.hadithMetaRow}>
                    {hadith.source ? (
                      <Text style={styles.referenceText}>{hadith.source}</Text>
                    ) : null}
                    {hadith.grade ? (
                      <View style={styles.gradeBadge}>
                        <Text style={styles.gradeText}>{hadith.grade}</Text>
                      </View>
                    ) : null}
                  </View>
                </GlassCard>
              );
            })() : null}
          </View>
        ) : null}


        <View style={{ height: 110 }} />
      </ScrollView>


      <PrayerTimesModal
        visible={isPrayerModalOpen}
        onClose={() => setIsPrayerModalOpen(false)}
        times={prayerTimes}
      />
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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  appTitle: {
    fontSize: Fonts.size.mega,
    fontWeight: "700",
    color: "#F3F4F6",
    letterSpacing: -0.5,
  },
  hijriHeader: {
    fontSize: Fonts.size.xs,
    color: "#48A111",
    fontWeight: "600",
    marginTop: 2,
    letterSpacing: 0.2,
  },
  heroCard: {
    padding: 0,
    overflow: "hidden",
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  heroDateInfo: {
    flex: 1,
  },
  heroGregorianDate: {
    fontSize: Fonts.size.md,
    fontWeight: "700",
    color: "#F3F4F6",
  },
  heroWeekday: {
    fontSize: Fonts.size.xs,
    color: "#9CA3AF",
    marginTop: 2,
  },
  heroClockWrap: {
    alignItems: "flex-end",
  },
  heroClockLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#48A111",
    letterSpacing: 1,
  },
  heroClockTime: {
    fontSize: Fonts.size.lg,
    fontWeight: "700",
    color: "#F3F4F6",
    letterSpacing: 0.5,
  },
  nextPrayerHighlight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
  },
  nextPrayerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  nextPrayerIconBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(37, 103, 30, 0.35)",
    borderWidth: 1,
    borderColor: "rgba(72, 161, 17, 0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  nextPrayerSub: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 0.8,
  },
  nextPrayerName: {
    fontSize: Fonts.size.mega,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  nextPrayerTime: {
    fontSize: Fonts.size.giant,
    fontWeight: "700",
    color: "#48A111",
  },
  heroBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    flexWrap: "wrap",
    paddingBottom: 14,
  },
  countdownBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(242, 181, 11, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(242, 181, 11, 0.25)",
  },
  countdownText: {
    fontSize: Fonts.size.xs,
    fontWeight: "600",
    color: "#FDE68A",
  },
  qiblaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  qiblaText: {
    fontSize: Fonts.size.xs,
    color: "#D1D5DB",
    fontWeight: "500",
  },
  heroAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
  },
  heroActionText: {
    fontSize: Fonts.size.sm,
    fontWeight: "600",
    color: "#48A111",
  },
  quickActionsSection: {
    marginTop: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 1.2,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  quickActionsScroll: {
    gap: 8,
    paddingHorizontal: 4,
  },
  sectionWrap: {
    marginTop: 22,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionCategory: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: Fonts.size.xl,
    fontWeight: "700",
    color: "#F3F4F6",
    letterSpacing: -0.3,
  },
  linkAction: {
    fontSize: Fonts.size.sm,
    fontWeight: "600",
    color: "#48A111",
  },
  asmaCard: {},
  asmaInner: {
    gap: 6,
  },
  asmaTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  asmaNumberBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: "rgba(242, 181, 11, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(242, 181, 11, 0.4)",
  },
  asmaNumberText: {
    fontSize: Fonts.size.xs,
    fontWeight: "700",
    color: "#F2B50B",
  },
  asmaArabic: {
    fontSize: Fonts.size.mega,
    fontWeight: "700",
    color: "#FDE68A",
    textAlign: "right",
  },
  asmaTitle: {
    fontSize: Fonts.size.md,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  asmaMeaning: {
    fontSize: Fonts.size.sm,
    color: "#9CA3AF",
    lineHeight: 20,
  },
  fastingCard: {},
  fastingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fastingItem: {
    flex: 1,
    alignItems: "center",
  },
  fastingIconWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  fastingLabel: {
    fontSize: Fonts.size.xs,
    fontWeight: "500",
    color: "#9CA3AF",
  },
  fastingTime: {
    fontSize: Fonts.size.xxl,
    fontWeight: "700",
    color: "#F3F4F6",
  },
  fastingDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  durationPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
  durationText: {
    fontSize: Fonts.size.xs,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  inspirationCard: {},
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardIconWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardHeaderTag: {
    fontSize: 10,
    fontWeight: "700",
    color: "#48A111",
    letterSpacing: 0.8,
  },
  shareIconBtn: {
    padding: 4,
  },
  arabicScriptText: {
    fontSize: Fonts.size.xl,
    lineHeight: 32,
    color: "#F3F4F6",
    textAlign: "right",
    marginBottom: 10,
  },
  translationText: {
    fontSize: Fonts.size.text,
    color: "#D1D5DB",
    lineHeight: 22,
  },
  referenceText: {
    fontSize: Fonts.size.xs,
    color: "#9CA3AF",
    marginTop: 8,
  },
  hadithMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  gradeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: "rgba(37, 103, 30, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(72, 161, 17, 0.4)",
  },
  gradeText: {
    fontSize: Fonts.size.xxs,
    fontWeight: "700",
    color: "#48A111",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  permissionCard: {
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    padding: 24,
    gap: 14,
  },
  logoWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(37, 103, 30, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  permissionTitle: {
    fontSize: Fonts.size.xl,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  permissionText: {
    fontSize: Fonts.size.sm,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
  },
  permissionHint: {
    fontSize: Fonts.size.xs,
    color: "#6B7280",
    textAlign: "center",
  },
  permissionLoading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  permissionStatus: {
    fontSize: Fonts.size.xs,
    color: "#9CA3AF",
  },
  loadingBox: {
    paddingVertical: 12,
  },
  emptyText: {
    fontSize: Fonts.size.sm,
    color: "#9CA3AF",
    textAlign: "center",
    paddingVertical: 12,
  },
  skeletonLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  skeletonLine: {
    width: 140,
    height: 14,
    borderRadius: 7,
  },
  skeletonLineWide: {
    width: 220,
    height: 12,
    borderRadius: 6,
  },
  skeletonDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
});
