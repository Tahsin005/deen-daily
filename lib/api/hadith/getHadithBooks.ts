import { Environment } from "../../../constants/environment/env";
import { HadithAPISettings } from "../../../constants/settings/hadithAPISettings";
import { fetchJson } from "../fetchJson";

export type HadithBook = {
  id: number;
  bookName: string;
  writerName: string;
  aboutWriter: string | null;
  writerDeath: string;
  bookSlug: string;
  hadiths_count: string;
  chapters_count: string;
};

type HadithBooksResponse = {
  status: number;
  message: string;
  books: HadithBook[];
};

export const getHadithBooks = async (): Promise<HadithBook[]> => {
    const baseUrl = Environment.HADITH_API_BASE_URL;
    const apiKey = Environment.HADITH_API_KEY;

    if (!baseUrl) {
        throw new Error("Hadith API base URL is not configured.");
    }

    if (!apiKey) {
        throw new Error("Hadith API key is not configured.");
    }

    const endpoint = HadithAPISettings.books.apisuffix;
    const normalizedBaseUrl = baseUrl.replace(/\/$/, "").endsWith("/api")
        ? baseUrl.replace(/\/$/, "")
        : `${baseUrl.replace(/\/$/, "")}/api`;
    const url = `${normalizedBaseUrl}/${endpoint}?apiKey=${apiKey}`;

    const response = await fetchJson<HadithBooksResponse>(url);

    return Array.isArray(response.books) ? response.books : [];
};
