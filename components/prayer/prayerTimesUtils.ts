import Ionicons from "@expo/vector-icons/Ionicons";

export type IconName = keyof typeof Ionicons.glyphMap;

export const timeEntries = [
    { key: "Fajr", label: "Fajr", icon: "moon" as IconName },
    { key: "Imsak", label: "Imsak", icon: "moon-outline" as IconName },
    { key: "Sunrise", label: "Sunrise", icon: "sunny" as IconName },
    { key: "Dhuhr", label: "Dhuhr", icon: "sunny-outline" as IconName },
    { key: "Asr", label: "Asr", icon: "partly-sunny" as IconName },
    { key: "Maghrib", label: "Maghrib", icon: "partly-sunny" as IconName },
    { key: "Isha", label: "Isha", icon: "moon" as IconName },
    { key: "Midnight", label: "Midnight", icon: "moon" as IconName },
    { key: "Firstthird", label: "1st Third", icon: "moon-outline" as IconName },
    { key: "Lastthird", label: "Last Third", icon: "moon-outline" as IconName },
] as { key: string; label: string; icon: IconName }[];

export const mainPrayerKeys = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

export const parseTimeToMinutes = (value: string | undefined) => {
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
