import { Environment } from "../../../constants/environment/env";
import { fetchJson } from "../fetchJson";

export type SurahJuz = {
  index: string;
  verse: {
    start: string;
    end: string;
  };
};

export type SurahSummary = {
  place: string;
  type: string;
  count: number;
  title: string;
  titleAr: string;
  index: string;
  pages: string;
  juz: SurahJuz[];
};

export const getSurahs = async (): Promise<SurahSummary[]> => {
    const baseUrl = Environment.QURAN_API_BASE_URL;

    if (!baseUrl) {
        throw new Error("Quran API base URL is not configured.");
    }

    const url = `${baseUrl.replace(/\/$/, "")}/surah.json`;

    return fetchJson<SurahSummary[]>(url);
};
