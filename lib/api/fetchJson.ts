export class ApiError extends Error {
    constructor(message: string, public status: number) {
        super(message);
        this.name = "ApiError";
    }
}

export const fetchJson = async <T>(url: string, init?: RequestInit): Promise<T> => {
    const response = await fetch(url, init);

    if (!response.ok) {
        const message = await response.text();
        throw new ApiError(message || response.statusText, response.status);
    }

    return (await response.json()) as T;
};
