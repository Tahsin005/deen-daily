import { Environment } from "../../../constants/environment/env";
import { fetchJson } from "../fetchJson";
import type { SurahDetail } from "./types";

export const getSurah = async (surahId: number, lang?: string): Promise<SurahDetail> => {
  const baseUrl = Environment.QURAN_API_V2_BASE_URL;

  if (!baseUrl) {
    throw new Error("Quran API v2 base URL is not configured.");
  }

  const normalizedBase = baseUrl.replace(/\/$/, "");
  const url = new URL(`${normalizedBase}/surah/${surahId}`);
  if (lang) {
    url.searchParams.set("lang", lang);
  }

  return fetchJson<SurahDetail>(url.toString());
};
