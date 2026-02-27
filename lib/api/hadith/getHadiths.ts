import { Environment } from "../../../constants/environment/env";
import { HadithAPISettings } from "../../../constants/settings/hadithAPISettings";
import { fetchJson } from "../fetchJson";

export type HadithEntry = {
    id: number;
    hadithNumber: string;
    englishNarrator: string | null;
    hadithEnglish: string;
    hadithUrdu: string | null;
    urduNarrator: string | null;
    hadithArabic: string | null;
    headingArabic: string | null;
    headingUrdu: string | null;
    headingEnglish: string | null;
    chapterId: string;
    bookSlug: string;
    volume: string | null;
    status: string | null;
};

type HadithsPage = {
    current_page: number;
    data: HadithEntry[];
    last_page: number;
    next_page_url: string | null;
    per_page: number;
    prev_page_url: string | null;
    total: number;
};

type HadithsResponse = {
    status: number;
    message: string;
    hadiths?: HadithsPage;
};

const normalizeBaseUrl = (baseUrl: string) =>
    baseUrl.replace(/\/$/, "").endsWith("/api")
        ? baseUrl.replace(/\/$/, "")
        : `${baseUrl.replace(/\/$/, "")}/api`;

export const getHadiths = async (params: {
    bookSlug: string;
    chapter?: string;
    status?: string;
    page?: number;
    paginate?: number;
}): Promise<HadithsPage> => {
    const { bookSlug, chapter, status, page = HadithAPISettings.hadiths.defaults.page, paginate = HadithAPISettings.hadiths.defaults.paginate } = params;
    const baseUrl = Environment.HADITH_API_BASE_URL;
    const apiKey = Environment.HADITH_API_KEY;

    if (!baseUrl) {
        throw new Error("Hadith API base URL is not configured.");
    }

    if (!apiKey) {
        throw new Error("Hadith API key is not configured.");
    }

    const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
    const query = new URLSearchParams({
        apiKey,
        book: bookSlug,
        paginate: paginate.toString(),
        page: page.toString(),
    });

    if (chapter) {
        query.set("chapter", chapter);
    }

    if (status) {
        query.set("status", status);
    }

    const url = `${normalizedBaseUrl}/${HadithAPISettings.hadiths.apisuffix}?${query.toString()}`;
    const response = await fetchJson<HadithsResponse>(url);

    if (!response.hadiths) {
        throw new Error(response.message || "Hadiths not found.");
    }

    return response.hadiths;
};
