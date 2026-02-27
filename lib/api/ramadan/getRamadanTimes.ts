import { Environment } from "../../../constants/environment/env";
import { IslamicAPISettings } from "../../../constants/settings/IslamicAPISettings";
import { fetchJson } from "../fetchJson";

export type RamadanDay = {
  date: string;
  day: string;
  hijri: string;
  hijri_readable: string;
  time: {
    sahur: string;
    iftar: string;
    duration: string;
  };
};

export type RamadanResponse = {
  code: number;
  status: string;
  range: string;
  ramadan_year: number;
  data: {
    fasting: RamadanDay[];
    white_days?: {
      status: string;
      days: {
        "13th"?: string;
        "14th"?: string;
        "15th"?: string;
      };
    };
  };
  resource?: {
    dua?: {
      title: string;
      arabic: string;
      translation: string;
      transliteration: string;
      reference: string;
    };
    hadith?: {
      arabic: string;
      english: string;
      source: string;
      grade: string;
    };
  };
};

export type RamadanParams = {
  latitude: number;
  longitude: number;
  method?: number;
  shifting?: number;
  calendar?: string;
};

export const getRamadanTimes = async ({
  latitude,
  longitude,
  method = IslamicAPISettings.fasting.defaults.method,
  shifting = IslamicAPISettings.fasting.defaults.shifting,
  calendar = IslamicAPISettings.fasting.defaults.calendar,
}: RamadanParams): Promise<RamadanResponse> => {
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

  const endpoint = "ramadan";
  const params = new URLSearchParams({
    api_key: apiKey,
    lat: latitude.toString(),
    lon: longitude.toString(),
    method: method.toString(),
    shifting: shifting.toString(),
    calendar,
  });

  const url = `${apiRoot}/${endpoint}/?${params.toString()}`;
  return fetchJson<RamadanResponse>(url);
};
