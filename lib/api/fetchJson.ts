export class ApiError extends Error {
    constructor(message: string, public status: number) {
        super(message);
        this.name = "ApiError";
    }
}

export const fetchJson = async <T>(url: string, init?: RequestInit): Promise<T> => {
    const sanitizedUrl = (() => {
        try {
            const parsed = new URL(url);
            if (parsed.searchParams.has("api_key")) {
                parsed.searchParams.set("api_key", "***");
            }
            return parsed.toString();
        } catch {
            return url;
        }
    })();

    console.info(`[API] => ${sanitizedUrl}`);
    const response = await fetch(url, init);

    if (!response.ok) {
        const message = await response.text();
        throw new ApiError(message || response.statusText, response.status);
    }

    return (await response.json()) as T;
};
