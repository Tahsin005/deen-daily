import { Environment } from "../../../constants/environment/env";
import { fetchJson } from "../fetchJson";
import type { QuranLanguage, SurahSummary } from "./types";

export type SurahListResponse = {
  language: string;
  available_languages: QuranLanguage[];
  surahs: SurahSummary[];
};

export const getSurahs = async (lang?: string): Promise<SurahListResponse> => {
  const baseUrl = Environment.QURAN_API_V2_BASE_URL;

  if (!baseUrl) {
    throw new Error("Quran API v2 base URL is not configured.");
  }

  const url = new URL(baseUrl.replace(/\/$/, ""));
  if (lang) {
    url.searchParams.set("lang", lang);
  }

  return fetchJson<SurahListResponse>(url.toString());
};
