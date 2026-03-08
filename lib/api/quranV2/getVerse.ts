import { Environment } from "../../../constants/environment/env";
import { fetchJson } from "../fetchJson";
import type { SurahDetail } from "./types";

export type VerseResponse = {
  language: string;
  surah: Pick<SurahDetail, "id" | "name" | "transliteration" | "translation">;
  verse: {
    id: number;
    text: string;
    translation: string;
  };
};

export const getVerse = async (
  surahId: number,
  verseId: number,
  lang?: string
): Promise<VerseResponse> => {
  const baseUrl = Environment.QURAN_API_V2_BASE_URL;

  if (!baseUrl) {
    throw new Error("Quran API v2 base URL is not configured.");
  }

  const normalizedBase = baseUrl.replace(/\/$/, "");
  const url = new URL(`${normalizedBase}/surah/${surahId}/verse/${verseId}`);
  if (lang) {
    url.searchParams.set("lang", lang);
  }

  return fetchJson<VerseResponse>(url.toString());
};
