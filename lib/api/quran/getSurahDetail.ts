import { Environment } from "../../../constants/environment/env";
import { fetchJson } from "../fetchJson";
import type { SurahJuz } from "./getSurahs";

export type SurahDetail = {
  index: string;
  name: string;
  verse: Record<string, string>;
  count: number;
  juz: SurahJuz[];
};

export const getSurahDetail = async (surahIndex: number): Promise<SurahDetail> => {
    const baseUrl = Environment.QURAN_API_BASE_URL;

    if (!baseUrl) {
        throw new Error("Quran API base URL is not configured.");
    }

    const url = `${baseUrl.replace(/\/$/, "")}/surah/surah_${surahIndex}.json`;

    return fetchJson<SurahDetail>(url);
};
