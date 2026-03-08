export type QuranLanguage = {
  code: string;
  name: string;
  nativeName: string;
  direction: "rtl" | "ltr";
};

export type SurahSummary = {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: string;
  total_verses: number;
};

export type SurahVerse = {
  id: number;
  text: string;
  translation: string;
};

export type SurahDetail = {
  language: string;
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: string;
  total_verses: number;
  verses: SurahVerse[];
  audio?: Record<
    string,
    {
      reciter: string;
      url: string;
      originalUrl?: string;
      type?: string;
    }
  >;
};

export type QuranSearchResult = {
  surah: Pick<SurahSummary, "id" | "name" | "transliteration" | "translation">;
  verses: SurahVerse[];
};

export type QuranSearchResponse = {
  language: string;
  query: string;
  results: QuranSearchResult[];
  total: number;
};
