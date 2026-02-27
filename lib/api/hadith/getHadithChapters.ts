import { Environment } from "../../../constants/environment/env";
import { HadithAPISettings } from "../../../constants/settings/hadithAPISettings";
import { fetchJson } from "../fetchJson";

export type HadithChapter = {
    id: number;
    chapterNumber: string;
    chapterEnglish: string;
    chapterUrdu: string;
    chapterArabic: string;
    bookSlug: string;
};

type PaginationLinks = {
    url: string | null;
    label: string;
    active: boolean;
};

type ChaptersPage = {
    current_page: number;
    data: HadithChapter[];
    last_page: number;
    next_page_url: string | null;
    per_page: string;
    prev_page_url: string | null;
    total: number;
    links?: PaginationLinks[];
};

type HadithChaptersResponse = {
    status: number;
    message: string;
    chapters?: ChaptersPage;
};

const normalizeBaseUrl = (baseUrl: string) =>
    baseUrl.replace(/\/$/, "").endsWith("/api")
        ? baseUrl.replace(/\/$/, "")
        : `${baseUrl.replace(/\/$/, "")}/api`;

export const getHadithChapters = async (params: {
    bookSlug: string;
    page?: number;
    paginate?: number;
}): Promise<ChaptersPage> => {
    const { bookSlug, page = 1, paginate = HadithAPISettings.chapters.defaults.paginate } = params;
    const baseUrl = Environment.HADITH_API_BASE_URL;
    const apiKey = Environment.HADITH_API_KEY;

    if (!baseUrl) {
        throw new Error("Hadith API base URL is not configured.");
    }

    if (!apiKey) {
        throw new Error("Hadith API key is not configured.");
    }

    const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
    const url = `${normalizedBaseUrl}/${bookSlug}/${HadithAPISettings.chapters.apisuffix}?apiKey=${apiKey}&paginate=${paginate}&page=${page}`;

    const response = await fetchJson<HadithChaptersResponse>(url);

    if (!response.chapters) {
        throw new Error(response.message || "Chapters not found.");
    }

    return response.chapters;
};
