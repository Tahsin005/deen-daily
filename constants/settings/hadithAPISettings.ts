export const HadithAPISettings = {
    books: {
        apisuffix: "books",
        queryparams: [
            "apiKey"
        ],
    },
    chapters: {
        apisuffix: "chapters",
        queryparams: [
            "apiKey",
            "paginate"
        ],
        defaults: {
            paginate: 25,
        },
    },
    hadiths: {
        apisuffix: "hadiths",
        queryparams: [
            "apiKey",
            "hadithEnglish",
            "hadithUrdu",
            "hadithArabic",
            "hadithNumber",
            "book",
            "chapter",
            "status",
            "paginate",
            "page"
        ],
        defaults: {
            paginate: 25,
            page: 1
        },
        // Hadith authenticity status filter
        status: [
            { label: "Sahih",  value: "Sahih" },
            { label: "Hasan",  value: "Hasan" },
            { label: "Da'eef", value: "Da`eef" },
        ],
    },
};