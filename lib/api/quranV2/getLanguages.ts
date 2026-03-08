import { Environment } from "../../../constants/environment/env";
import { fetchJson } from "../fetchJson";
import type { QuranLanguage } from "./types";

export type LanguagesResponse = {
  languages: QuranLanguage[];
};

export const getLanguages = async (): Promise<LanguagesResponse> => {
  const baseUrl = Environment.QURAN_API_V2_BASE_URL;

  if (!baseUrl) {
    throw new Error("Quran API v2 base URL is not configured.");
  }

  const normalizedBase = baseUrl.replace(/\/$/, "");
  const url = `${normalizedBase}/languages`;

  return fetchJson<LanguagesResponse>(url);
};
