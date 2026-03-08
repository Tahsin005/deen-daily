import { Environment } from "../../../constants/environment/env";
import { fetchJson } from "../fetchJson";
import type { QuranSearchResponse } from "./types";

export const searchQuran = async (query: string, lang?: string): Promise<QuranSearchResponse> => {
  const baseUrl = Environment.QURAN_API_V2_BASE_URL;

  if (!baseUrl) {
    throw new Error("Quran API v2 base URL is not configured.");
  }

  const normalizedBase = baseUrl.replace(/\/$/, "");
  const url = new URL(`${normalizedBase}/search`);
  url.searchParams.set("q", query);
  if (lang) {
    url.searchParams.set("lang", lang);
  }

  return fetchJson<QuranSearchResponse>(url.toString());
};
