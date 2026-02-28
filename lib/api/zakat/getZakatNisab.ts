import { Environment } from "../../../constants/environment/env";
import { IslamicAPISettings } from "../../../constants/settings/IslamicAPISettings";
import { fetchJson } from "../fetchJson";

export type ZakatNisabResponse = {
    code: number;
    status: string;
    calculation_standard: string;
    currency: string;
    weight_unit: string;
    updated_at: string;
    data: {
        nisab_thresholds: {
            gold: {
                weight: number;
                unit_price: number;
                nisab_amount: number;
            };
            silver: {
                weight: number;
                unit_price: number;
                nisab_amount: number;
            };
        };
        zakat_rate: string;
        notes?: string;
    };
};

export type ZakatNisabParams = {
    standard?: "classical" | "common";
    currency?: string;
    unit?: "g" | "oz";
};

const zakatDefaults = IslamicAPISettings.zakatNisab.defaults as {
    standard: "classical" | "common";
    currency: string;
    unit: "g" | "oz";
};

export const getZakatNisab = async ({
    standard = zakatDefaults.standard,
    currency = zakatDefaults.currency,
    unit = zakatDefaults.unit,
}: ZakatNisabParams = {}): Promise<ZakatNisabResponse> => {
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
        api_key: apiKey,
        standard,
        currency,
        unit,
    });

    const url = `${apiRoot}/zakat-nisab/?${params.toString()}`;
    return fetchJson<ZakatNisabResponse>(url);
};
