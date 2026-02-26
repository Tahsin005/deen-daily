export const IslamicAPISettings = {
    prayerTime: {
        apisuffix: "prayer-time",
        queryparams: [
            "api_key",
            "lat",
            "lon",
            "method",
            "school",
            "shifting",
            "calendar"
        ],
        defaults: {
            method: 1, // University of Islamic Sciences, Karachi
            school: 2, // Hanafi
            shifting: 0, // Default
            calendar: "UAQ"
        },
        // Method for calculating prayer times based on geographical location and algorithms.
        method: [
            {
                label: "Jafari / Shia Ithna-Ashari",
                value: 0
            },
            {
                label: "University of Islamic Sciences, Karachi",
                value: 1
            },
            {
                label: "Islamic Society of North America",
                value: 2
            },
            {
                label: "Muslim World League",
                value: 3
            },
            {
                label: "Umm Al-Qura University, Makkah",
                value: 4
            },
            {
                label: "Egyptian General Authority of Survey",
                value: 5
            },
            {
                label: "Institute of Geophysics, Tehran",
                value: 7
            },
            {
                label: "Gulf Region",
                value: 8
            },
            {
                label: "Kuwait",
                value: 9
            },
            {
                label: "Qatar",
                value: 10
            },
            {
                label: "MUIS, Singapore",
                value: 11
            },
            {
                label: "UOIF, France",
                value: 12
            },
            {
                label: "Diyanet, Turkey",
                value: 13
            },
            {
                label: "Russia",
                value: 14
            },
            {
                label: "Moonsighting Committee Worldwide",
                value: 15
            },
            {
                label: "Dubai (experimental)",
                value: 16
            },
            {
                label: "JAKIM, Malaysia",
                value: 17
            },
            {
                label: "Tunisia",
                value: 18
            },
            {
                label: "Algeria",
                value: 19
            },
            {
                label: "KEMENAG, Indonesia",
                value: 20
            },
            {
                label: "Morocco",
                value: 21
            },
            {
                label: "Lisbon, Portugal",
                value: 22
            },
            {
                label: "Jordan",
                value: 23
            },
        ],
        // School of thought for Asr prayer time.
        school: [
            {
                label: "Shafi",
                value: 1
            },
            {
                label: "Hanafi",
                value: 2
            }
        ],
        // Manual adjustment for Hijri dates based on local moon sighting.
        shifting: [
            {
                label: "-2",
                value: -2
            },
            {
                label: "-1",
                value: -1
            },
            {
                label: "Default",
                value: 0
            },
            {
                label: "+1",
                value: 1
            },
            {
                label: "+2",
                value: 2
            }
        ],
        // Calendar Calculation Method.
        calendar: [
            { label: "HJCoSA", value: "HJCoSA" },
            { label: "UAQ", value: "UAQ" },
            { label: "DIYANET", value: "DIYANET" },
            { label: "MATHEMATICAL", value: "MATHEMATICAL" }
        ]
    },
    fasting: {
        apisuffix: "fasting",
        queryparams: [
            "api_key",
            "lat",
            "lon",
            "method",
            "shifting",
            "calendar",
            "date"
        ],
        defaults: {
            method: 1,
            shifting: 0,
            calendar: "UAQ"
        },
        // Method for calculating prayer times based on geographical location and algorithms.
        method: [
            {
                label: "Jafari / Shia Ithna-Ashari",
                value: 0
            },
            {
                label: "University of Islamic Sciences, Karachi",
                value: 1
            },
            {
                label: "Islamic Society of North America",
                value: 2
            },
            {
                label: "Muslim World League",
                value: 3
            },
            {
                label: "Umm Al-Qura University, Makkah",
                value: 4
            },
            {
                label: "Egyptian General Authority of Survey",
                value: 5
            },
            {
                label: "Institute of Geophysics, Tehran",
                value: 7
            },
            {
                label: "Gulf Region",
                value: 8
            },
            {
                label: "Kuwait",
                value: 9
            },
            {
                label: "Qatar",
                value: 10
            },
            {
                label: "MUIS, Singapore",
                value: 11
            },
            {
                label: "UOIF, France",
                value: 12
            },
            {
                label: "Diyanet, Turkey",
                value: 13
            },
            {
                label: "Russia",
                value: 14
            },
            {
                label: "Moonsighting Committee Worldwide",
                value: 15
            },
            {
                label: "Dubai (experimental)",
                value: 16
            },
            {
                label: "JAKIM, Malaysia",
                value: 17
            },
            {
                label: "Tunisia",
                value: 18
            },
            {
                label: "Algeria",
                value: 19
            },
            {
                label: "KEMENAG, Indonesia",
                value: 20
            },
            {
                label: "Morocco",
                value: 21
            },
            {
                label: "Lisbon, Portugal",
                value: 22
            },
            {
                label: "Jordan",
                value: 23
            },
        ],
        // Manual adjustment for Hijri dates based on local moon sighting.
        shifting: [
            {
                label: "-2",
                value: -2
            },
            {
                label: "-1",
                value: -1
            },
            {
                label: "Default",
                value: 0
            },
            {
                label: "+1",
                value: 1
            },
            {
                label: "+2",
                value: 2
            }
        ],
        // Calendar Calculation Method.
        calendar: [
            { label: "HJCoSA", value: "HJCoSA" },
            { label: "UAQ", value: "UAQ" },
            { label: "DIYANET", value: "DIYANET" },
            { label: "MATHEMATICAL", value: "MATHEMATICAL" }
        ]
        // date: 2025-07-25 (for specifc date), 2025-07 (for full month)
    },
    zakatNisab: {
        apisuffix: "zakat-nisab",
        queryparams: [
            "api_key",
            "standard",
            "currency",
            "unit"
        ],
        defaults: {
            standard: "classical",
            currency: "bdt",
            unit: "g"
        },
        // The calculation standard to use for Nisab values:
        // Classical: Gold nisab is 87.48 grams, Silver nisab is 612.36 grams
        // Common: Gold nisab is 85 grams, Silver nisab is 595 grams
        standard: [
            {
                label: "Classical",
                value: "classical"
            },
            {
                label: "Common",
                value: "common"
            }
        ],
        // The currency to use for the Nisab value. Use 3-letter ISO code (e.g., usd, eur, gbp, bdt)    
        currency: [
            { label: "AED", value: "aed" },
            { label: "AFN", value: "afn" },
            { label: "ALL", value: "all" },
            { label: "AMD", value: "amd" },
            { label: "ANG", value: "ang" },
            { label: "AOA", value: "aoa" },
            { label: "ARS", value: "ars" },
            { label: "AUD", value: "aud" },
            { label: "AWG", value: "awg" },
            { label: "AZN", value: "azn" },
            { label: "BAM", value: "bam" },
            { label: "BBD", value: "bbd" },
            { label: "BDT", value: "bdt" },
            { label: "BGN", value: "bgn" },
            { label: "BHD", value: "bhd" },
            { label: "BIF", value: "bif" },
            { label: "BMD", value: "bmd" },
            { label: "BND", value: "bnd" },
            { label: "BOB", value: "bob" },
            { label: "BRL", value: "brl" },
            { label: "BSD", value: "bsd" },
            { label: "BTN", value: "btn" },
            { label: "BWP", value: "bwp" },
            { label: "BYN", value: "byn" },
            { label: "BZD", value: "bzd" },
            { label: "CAD", value: "cad" },
            { label: "CDF", value: "cdf" },
            { label: "CHF", value: "chf" },
            { label: "CLF", value: "clf" },
            { label: "CLP", value: "clp" },
            { label: "CNH", value: "cnh" },
            { label: "CNY", value: "cny" },
            { label: "COP", value: "cop" },
            { label: "CRC", value: "crc" },
            { label: "CUP", value: "cup" },
            { label: "CVE", value: "cve" },
            { label: "CZK", value: "czk" },
            { label: "DJF", value: "djf" },
            { label: "DKK", value: "dkk" },
            { label: "DOP", value: "dop" },
            { label: "DZD", value: "dzd" },
            { label: "EGP", value: "egp" },
            { label: "ERN", value: "ern" },
            { label: "ETB", value: "etb" },
            { label: "EUR", value: "eur" },
            { label: "FJD", value: "fjd" },
            { label: "FKP", value: "fkp" },
            { label: "FOK", value: "fok" },
            { label: "GBP", value: "gbp" },
            { label: "GEL", value: "gel" },
            { label: "GGP", value: "ggp" },
            { label: "GHS", value: "ghs" },
            { label: "GIP", value: "gip" },
            { label: "GMD", value: "gmd" },
            { label: "GNF", value: "gnf" },
            { label: "GTQ", value: "gtq" },
            { label: "GYD", value: "gyd" },
            { label: "HKD", value: "hkd" },
            { label: "HNL", value: "hnl" },
            { label: "HRK", value: "hrk" },
            { label: "HTG", value: "htg" },
            { label: "HUF", value: "huf" },
            { label: "IDR", value: "idr" },
            { label: "ILS", value: "ils" },
            { label: "IMP", value: "imp" },
            { label: "INR", value: "inr" },
            { label: "IQD", value: "iqd" },
            { label: "IRR", value: "irr" },
            { label: "ISK", value: "isk" },
            { label: "JEP", value: "jep" },
            { label: "JMD", value: "jmd" },
            { label: "JOD", value: "jod" },
            { label: "JPY", value: "jpy" },
            { label: "KES", value: "kes" },
            { label: "KGS", value: "kgs" },
            { label: "KHR", value: "khr" },
            { label: "KID", value: "kid" },
            { label: "KMF", value: "kmf" },
            { label: "KRW", value: "krw" },
            { label: "KWD", value: "kwd" },
            { label: "KYD", value: "kyd" },
            { label: "KZT", value: "kzt" },
            { label: "LAK", value: "lak" },
            { label: "LBP", value: "lbp" },
            { label: "LKR", value: "lkr" },
            { label: "LRD", value: "lrd" },
            { label: "LSL", value: "lsl" },
            { label: "LYD", value: "lyd" },
            { label: "MAD", value: "mad" },
            { label: "MDL", value: "mdl" },
            { label: "MGA", value: "mga" },
            { label: "MKD", value: "mkd" },
            { label: "MMK", value: "mmk" },
            { label: "MNT", value: "mnt" },
            { label: "MOP", value: "mop" },
            { label: "MRU", value: "mru" },
            { label: "MUR", value: "mur" },
            { label: "MVR", value: "mvr" },
            { label: "MWK", value: "mwk" },
            { label: "MXN", value: "mxn" },
            { label: "MYR", value: "myr" },
            { label: "MZN", value: "mzn" },
            { label: "NAD", value: "nad" },
            { label: "NGN", value: "ngn" },
            { label: "NIO", value: "nio" },
            { label: "NOK", value: "nok" },
            { label: "NPR", value: "npr" },
            { label: "NZD", value: "nzd" },
            { label: "OMR", value: "omr" },
            { label: "PAB", value: "pab" },
            { label: "PEN", value: "pen" },
            { label: "PGK", value: "pgk" },
            { label: "PHP", value: "php" },
            { label: "PKR", value: "pkr" },
            { label: "PLN", value: "pln" },
            { label: "PYG", value: "pyg" },
            { label: "QAR", value: "qar" },
            { label: "RON", value: "ron" },
            { label: "RSD", value: "rsd" },
            { label: "RUB", value: "rub" },
            { label: "RWF", value: "rwf" },
            { label: "SAR", value: "sar" },
            { label: "SBD", value: "sbd" },
            { label: "SCR", value: "scr" },
            { label: "SDG", value: "sdg" },
            { label: "SEK", value: "sek" },
            { label: "SGD", value: "sgd" },
            { label: "SHP", value: "shp" },
            { label: "SLE", value: "sle" },
            { label: "SLL", value: "sll" },
            { label: "SOS", value: "sos" },
            { label: "SRD", value: "srd" },
            { label: "SSP", value: "ssp" },
            { label: "STN", value: "stn" },
            { label: "SYP", value: "syp" },
            { label: "SZL", value: "szl" },
            { label: "THB", value: "thb" },
            { label: "TJS", value: "tjs" },
            { label: "TMT", value: "tmt" },
            { label: "TND", value: "tnd" },
            { label: "TOP", value: "top" },
            { label: "TRY", value: "try" },
            { label: "TTD", value: "ttd" },
            { label: "TVD", value: "tvd" },
            { label: "TWD", value: "twd" },
            { label: "TZS", value: "tzs" },
            { label: "UAH", value: "uah" },
            { label: "UGX", value: "ugx" },
            { label: "USD", value: "usd" },
            { label: "UYU", value: "uyu" },
            { label: "UZS", value: "uzs" },
            { label: "VES", value: "ves" },
            { label: "VND", value: "vnd" },
            { label: "VUV", value: "vuv" },
            { label: "WST", value: "wst" },
            { label: "XAF", value: "xaf" },
            { label: "XCD", value: "xcd" },
            { label: "XCG", value: "xcg" },
            { label: "XDR", value: "xdr" },
            { label: "XOF", value: "xof" },
            { label: "XPF", value: "xpf" },
            { label: "YER", value: "yer" },
            { label: "ZAR", value: "zar" },
            { label: "ZMW", value: "zmw" },
            { label: "ZWL", value: "zwl" }
        ],
        unit: [
            {
                label: "gram",
                value: "g"
            },
            {
                label: "ounce",
                value: "oz"
            }
        ]
    },
    asmaUlHusna: {
        apisuffix: "asma-ul-husna",
        queryparams: [
            "language"
        ],
        defaults: {
            language: "en"
        },
        language: [
            { label: "Amharic (አማርኛ)", value: "am" },
            { label: "Arabic (العربية)", value: "ar" },
            { label: "Azerbaijani (Azərbaycan)", value: "az" },
            { label: "Bulgarian (Български)", value: "bg" },
            { label: "Bengali (বাংলা)", value: "bn" },
            { label: "Bosnian (Bosanski)", value: "bs" },
            { label: "Czech (Čeština)", value: "cs" },
            { label: "Danish (Dansk)", value: "da" },
            { label: "German (Deutsch)", value: "de" },
            { label: "Dhivehi (ދިވެހި)", value: "dv" },
            { label: "Greek (Ελληνικά)", value: "el" },
            { label: "English", value: "en" },
            { label: "Spanish (Español)", value: "es" },
            { label: "Estonian (Eesti)", value: "et" },
            { label: "Persian (فارسی)", value: "fa" },
            { label: "Finnish (Suomi)", value: "fi" },
            { label: "French (Français)", value: "fr" },
            { label: "Gujarati (ગુજરાતી)", value: "gu" },
            { label: "Hausa", value: "ha" },
            { label: "Hawaiian (ʻŌlelo Hawaiʻi)", value: "haw" },
            { label: "Hebrew (עברית)", value: "he" },
            { label: "Hindi (हिन्दी)", value: "hi" },
            { label: "Croatian (Hrvatski)", value: "hr" },
            { label: "Hungarian (Magyar)", value: "hu" },
            { label: "Armenian (Հայերեն)", value: "hy" },
            { label: "Indonesian (Bahasa Indonesia)", value: "id" },
            { label: "Icelandic (Íslenska)", value: "is" },
            { label: "Italian (Italiano)", value: "it" },
            { label: "Japanese (日本語)", value: "ja" },
            { label: "Georgian (ქართული)", value: "ka" },
            { label: "Kazakh (Қазақ тілі)", value: "kk" },
            { label: "Khmer (ភាសាខ្មែរ)", value: "km" },
            { label: "Kannada (ಕನ್ನಡ)", value: "kn" },
            { label: "Korean (한국어)", value: "ko" },
            { label: "Kurdish (کوردی)", value: "ku" },
            { label: "Lao (ລາວ)", value: "lo" },
            { label: "Lithuanian ( Lietuvių)", value: "lt" },
            { label: "Latvian (Latviešu)", value: "lv" },
            { label: "Malagasy", value: "mg" },
            { label: "Maori (Te Reo Māori)", value: "mi" },
            { label: "Malayalam (മലയാളം)", value: "ml" },
            { label: "Marathi (మరాఠీ)", value: "mr" },
            { label: "Malay (Bahasa Melayu)", value: "ms" },
            { label: "Maltese (Malti)", value: "mt" },
            { label: "Burmese (မြန်မာဘာသာ)", value: "my" },
            { label: "Nepali (नेपाली)", value: "ne" },
            { label: "Dutch (Nederlands)", value: "nl" },
            { label: "Norwegian (Norsk)", value: "no" },
            { label: "Odia (ଓଡ଼ିଆ)", value: "or" },
            { label: "Punjabi (ਪੰਜਾਬੀ)", value: "pa" },
            { label: "Polish (Polski)", value: "pl" },
            { label: "Pashto (پښتو)", value: "ps" },
            { label: "Portuguese (Português)", value: "pt" },
            { label: "Romanian (Română)", value: "ro" },
            { label: "Russian (Русский)", value: "ru" },
            { label: "Sindhi (سنڌي)", value: "sd" },
            { label: "Sinhala (සිංහල)", value: "si" },
            { label: "Slovak (Slovenčina)", value: "sk" },
            { label: "Slovenian (Slovenščina)", value: "sl" },
            { label: "Somali (Soomaali)", value: "so" },
            { label: "Albanian (Shqip)", value: "sq" },
            { label: "Serbian (Српски)", value: "sr" },
            { label: "Swedish (Svenska)", value: "sv" },
            { label: "Swahili (Kiswahili)", value: "sw" },
            { label: "Tamil (தமிழ்)", value: "ta" },
            { label: "Telugu (తెలుగు)", value: "te" },
            { label: "Thai (ไทย)", value: "th" },
            { label: "Tigrinya (ትግርኛ)", value: "ti" },
            { label: "Filipino", value: "tl" },
            { label: "Turkish (Türkçe)", value: "tr" },
            { label: "Uyghur (ئۇيغۇرچە)", value: "ug" },
            { label: "Ukrainian (Українська)", value: "uk" },
            { label: "Urdu (اردو)", value: "ur" },
            { label: "Uzbek (Oʻzbekcha)", value: "uz" },
            { label: "Vietnamese (Tiếng Việt)", value: "vi" },
            { label: "Chinese (中文)", value: "zh" }
        ]
    },
    ramadan: {
        apisuffix: "ramadan",
        queryparams: [
            "api_key",
            "lat",
            "lon",
            "format",
            "method",
            "school",
            "calendar",
            "shifting"
        ],
        defaults: {
            format: 12,
            method: 1,
            school: 2,
            calendar: "UAQ",
            shifting: 0
        },
        format: [
            {
                label: "24h",
                value: 24,
            },
            {
                label: "12h",
                value: 12,
            }
        ],
        // Method for calculating prayer times based on geographical location and algorithms.
        method: [
            {
                label: "Jafari / Shia Ithna-Ashari",
                value: 0
            },
            {
                label: "University of Islamic Sciences, Karachi",
                value: 1
            },
            {
                label: "Islamic Society of North America",
                value: 2
            },
            {
                label: "Muslim World League",
                value: 3
            },
            {
                label: "Umm Al-Qura University, Makkah",
                value: 4
            },
            {
                label: "Egyptian General Authority of Survey",
                value: 5
            },
            {
                label: "Institute of Geophysics, Tehran",
                value: 7
            },
            {
                label: "Gulf Region",
                value: 8
            },
            {
                label: "Kuwait",
                value: 9
            },
            {
                label: "Qatar",
                value: 10
            },
            {
                label: "MUIS, Singapore",
                value: 11
            },
            {
                label: "UOIF, France",
                value: 12
            },
            {
                label: "Diyanet, Turkey",
                value: 13
            },
            {
                label: "Russia",
                value: 14
            },
            {
                label: "Moonsighting Committee Worldwide",
                value: 15
            },
            {
                label: "Dubai (experimental)",
                value: 16
            },
            {
                label: "JAKIM, Malaysia",
                value: 17
            },
            {
                label: "Tunisia",
                value: 18
            },
            {
                label: "Algeria",
                value: 19
            },
            {
                label: "KEMENAG, Indonesia",
                value: 20
            },
            {
                label: "Morocco",
                value: 21
            },
            {
                label: "Lisbon, Portugal",
                value: 22
            },
            {
                label: "Jordan",
                value: 23
            },
        ],
        // Manual adjustment for Hijri dates based on local moon sighting.
        shifting: [
            {
                label: "-2",
                value: -2
            },
            {
                label: "-1",
                value: -1
            },
            {
                label: "Default",
                value: 0
            },
            {
                label: "+1",
                value: 1
            },
            {
                label: "+2",
                value: 2
            }
        ],
        // Calendar Calculation Method.
        calendar: [
            { label: "HJCoSA", value: "HJCoSA" },
            { label: "UAQ", value: "UAQ" },
            { label: "DIYANET", value: "DIYANET" },
            { label: "MATHEMATICAL", value: "MATHEMATICAL" }
        ],
        // School of thought for Asr prayer time.
        school: [
            {
                label: "Shafi",
                value: 1
            },
            {
                label: "Hanafi",
                value: 2
            }
        ],
    }
}