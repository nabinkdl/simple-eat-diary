import NepaliDate from "nepali-date-converter";

export const NEPALI_MONTHS = [
    'Baisakh', 'Jestha', 'Asar', 'Saun', 'Bhadra', 'Aswin',
    'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
];

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Helper to get number of days in a specific Nepali month
export function getDaysInNepaliMonth(year: number, month: number): number {
    // Iterate to find the last valid day
    let d = 29;
    while (true) {
        try {
            const date = new NepaliDate(year, month, d + 1);
            if (date.getMonth() !== month) break;
            d++;
        } catch (e) {
            break;
        }
    }
    return d;
}

// Get JS Date range for a specific Nepali Month
export function getNepaliMonthRange(year: number, month: number) {
    const startDate = new NepaliDate(year, month, 1).toJsDate();

    // Find absolute end date
    const lastDay = getDaysInNepaliMonth(year, month);
    const endDate = new NepaliDate(year, month, lastDay).toJsDate();
    // Set endDate time to end of day to ensuring inclusive filtering if comparing timestamps
    endDate.setHours(23, 59, 59, 999);

    return { startDate, endDate };
}

// Get Current Nepali Date object
export function getCurrentNepaliDate() {
    return new NepaliDate(new Date());
}
