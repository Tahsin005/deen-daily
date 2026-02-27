import { Environment } from "../../../constants/environment/env";
import { IslamicAPISettings } from "../../../constants/settings/IslamicAPISettings";
import { fetchJson } from "../fetchJson";

export type PrayerTimesResponse = {
    code: number;
    status: string;
    data: {
        times: Record<string, string>;
        date: {
            readable: string;
            timestamp: string;
            hijri: {
                date: string;
                day: string;
                month: {
                    number: number;
                    en: string;
                    ar: string;
                    days: number;
                };
                year: string;
                weekday: {
                    en: string;
                    ar: string;
                };
                designation: {
                    abbreviated: string;
                    expanded: string;
                };
            };
            gregorian: {
                date: string;
                day: string;
                month: {
                    number: number;
                    en: string;
                };
                year: string;
                weekday: {
                    en: string;
                };
                designation: {
                    abbreviated: string;
                    expanded: string;
                };
            };
        };
        qibla: {
            direction: {
                degrees: number;
                from: string;
                clockwise: boolean;
            };
            distance: {
                value: number;
                unit: string;
            };
        };
        prohibited_times: {
            sunrise: {
                start: string;
                end: string;
            };
            noon: {
                start: string;
                end: string;
            };
            sunset: {
                start: string;
                end: string;
            };
        };
        timezone: {
            name: string;
            utc_offset: string;
            abbreviation: string;
        };
    };
};

export type PrayerTimesParams = {
    latitude: number;
    longitude: number;
    method?: number;
    school?: number;
    shifting?: number;
    calendar?: string;
};

export const getPrayerTimes = async ({
    latitude,
    longitude,
    method = IslamicAPISettings.prayerTime.defaults.method,
    school = IslamicAPISettings.prayerTime.defaults.school,
    shifting = IslamicAPISettings.prayerTime.defaults.shifting,
    calendar = IslamicAPISettings.prayerTime.defaults.calendar,
}: PrayerTimesParams): Promise<PrayerTimesResponse> => {
    const baseUrl = Environment.ISLAMIC_API_BASE_URL;
    const apiKey = Environment.ISLAMIC_API_KEY;

    if (!baseUrl) {
        throw new Error("Islamic API base URL is not configured.");
    }

    if (!apiKey) {
        throw new Error("Islamic API key is not configured.");
    }

    const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
    const apiRoot = normalizedBaseUrl.endsWith("/api/v1")
        ? normalizedBaseUrl
        : `${normalizedBaseUrl}/api/v1`;

    const endpoint = IslamicAPISettings.prayerTime.apisuffix;
    const params = new URLSearchParams({
        api_key: apiKey,
        lat: latitude.toString(),
        lon: longitude.toString(),
        method: method.toString(),
        school: school.toString(),
        shifting: shifting.toString(),
        calendar,
    });

    const url = `${apiRoot}/${endpoint}/?${params.toString()}`;
    return fetchJson<PrayerTimesResponse>(url);
};
