import { Environment } from "../../../constants/environment/env";
import { fetchJson } from "../fetchJson";

export type AsmaulHusnaName = {
    number: number;
    name: string;
    transliteration: string;
    translation: string;
    meaning: string;
    audio: string;
};

type AsmaulHusnaResponse = {
    code: number;
    status: string;
    data: {
        names: AsmaulHusnaName[];
        total: number;
        language: string;
        language_code: string;
        title: string;
        arabic_title: string;
        description: string;
        recitation_benefits: string;
        hadith: string;
    };
};

export const getAsmaulHusna = async (language: string): Promise<AsmaulHusnaResponse> => {
    const baseUrl = Environment.ISLAMIC_API_BASE_URL;
    const apiKey = Environment.ISLAMIC_API_KEY;

    if (!baseUrl) {
        throw new Error("Islamic API base URL is not configured.");
    }

    if (!apiKey) {
        throw new Error("Islamic API key is not configured.");
    }

    const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
    const apiRoot = normalizedBaseUrl.endsWith("/api/v1")
        ? normalizedBaseUrl
        : `${normalizedBaseUrl}/api/v1`;

    const params = new URLSearchParams({
        language,
        api_key: apiKey,
    });

    const url = `${apiRoot}/asma-ul-husna/?${params.toString()}`;
    return fetchJson<AsmaulHusnaResponse>(url);
};
