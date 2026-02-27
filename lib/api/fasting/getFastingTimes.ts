import { Environment } from "../../../constants/environment/env";
import { IslamicAPISettings } from "../../../constants/settings/IslamicAPISettings";
import { fetchJson } from "../fetchJson";

export type FastingDay = {
  date: string;
  hijri: string;
  hijri_readable: string;
  time: {
    sahur: string;
    iftar: string;
    duration: string;
  };
};

export type FastingResponse = {
  code: number;
  status: string;
  range: string;
  data: {
    fasting: FastingDay[];
    white_days?: {
      status: string;
      days: {
        "13th"?: string;
        "14th"?: string;
        "15th"?: string;
      };
    };
  };
};

export type FastingParams = {
  latitude: number;
  longitude: number;
  method?: number;
  shifting?: number;
  calendar?: string;
  date?: string;
};

export const getFastingTimes = async ({
  latitude,
  longitude,
  method = IslamicAPISettings.fasting.defaults.method,
  shifting = IslamicAPISettings.fasting.defaults.shifting,
  calendar = IslamicAPISettings.fasting.defaults.calendar,
  date,
}: FastingParams): Promise<FastingResponse> => {
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

  const endpoint = IslamicAPISettings.fasting.apisuffix;
  const params = new URLSearchParams({
    api_key: apiKey,
    lat: latitude.toString(),
    lon: longitude.toString(),
    method: method.toString(),
    shifting: shifting.toString(),
    calendar,
  });

  if (date) {
    params.set("date", date);
  }

  const url = `${apiRoot}/${endpoint}/?${params.toString()}`;
  return fetchJson<FastingResponse>(url);
};
