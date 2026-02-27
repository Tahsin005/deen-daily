import { IslamicAPISettings } from "../../constants/settings/IslamicAPISettings";
import { useLocalStorageString } from "./useLocalStorageString";

const DEFAULTS = IslamicAPISettings.prayerTime.defaults;

export const usePrayerSettings = () => {
    const [methodValue, setMethodValue] = useLocalStorageString(
        "prayer.settings.method",
        DEFAULTS.method.toString()
    );
    const [schoolValue, setSchoolValue] = useLocalStorageString(
        "prayer.settings.school",
        DEFAULTS.school.toString()
    );
    const [shiftingValue, setShiftingValue] = useLocalStorageString(
        "prayer.settings.shifting",
        DEFAULTS.shifting.toString()
    );
    const [calendarValue, setCalendarValue] = useLocalStorageString(
        "prayer.settings.calendar",
        DEFAULTS.calendar
    );

    const method = Number(methodValue) || DEFAULTS.method;
    const school = Number(schoolValue) || DEFAULTS.school;
    const shifting = Number(shiftingValue) || DEFAULTS.shifting;
    const calendar = calendarValue || DEFAULTS.calendar;

    return {
        method,
        school,
        shifting,
        calendar,
        setMethod: (value: number) => setMethodValue(value.toString()),
        setSchool: (value: number) => setSchoolValue(value.toString()),
        setShifting: (value: number) => setShiftingValue(value.toString()),
        setCalendar: (value: string) => setCalendarValue(value),
    };
};
