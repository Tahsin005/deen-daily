import { createMMKV } from "react-native-mmkv";

export const storage = createMMKV({
    id: "deen-daily-storage",
});

type StoredValue = string | number | boolean;

export const localStorage = {
    setItem: (key: string, value: StoredValue) => {
        storage.set(key, value);
    },
    getItem: (key: string) => {
        const value = storage.getString(key);
        return value ?? null;
    },
    getNumber: (key: string) => storage.getNumber(key) ?? null,
    getBoolean: (key: string) => storage.getBoolean(key) ?? null,
    removeItem: (key: string) => {
        storage.remove(key);
    },
    clear: () => storage.clearAll(),
};
