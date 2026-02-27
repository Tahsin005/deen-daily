import { Environment } from "@/constants/environment/env";
import { fetchJson } from "../fetchJson";

export type SurahTranslation = {
  name: string;
  index: string;
  verse: Record<string, string>;
  count: number;
};

export const getSurahTranslation = async (surahIndex: number): Promise<SurahTranslation> => {
    const baseUrl = Environment.QURAN_API_BASE_URL;
    
    if (!baseUrl) {
        throw new Error("Quran API base URL is not configured.");
    }
    const url = `${baseUrl}/translation/en/en_translation_${surahIndex}.json`;

    return fetchJson<SurahTranslation>(url);
};
