import { useEffect } from "react";
import { useMMKVString } from "react-native-mmkv";
import { storage } from "./mmkv";

export const useLocalStorageString = (key: string, initialValue = "") => {
    const [value, setValue] = useMMKVString(key, storage);

    useEffect(() => {
        if (value === undefined) {
            setValue(initialValue);
        }
    }, [initialValue, setValue, value]);

    return [value ?? initialValue, setValue] as const;
};
