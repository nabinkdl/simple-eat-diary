import { useAllMeals } from "@/contexts/MealsContext";
import { getDateKey, MealRecord } from "@/lib/storage";
import { getNepaliMonthRange, getDaysInNepaliMonth } from "@/lib/nepali-utils";
import { useMemo } from "react";
import NepaliDate from "nepali-date-converter";

export function useNepaliMonthData(nepYear: number, nepMonth: number) {
    const { meals, loading } = useAllMeals();

    const stats = useMemo(() => {
        if (loading) return { data: {}, totalMeals: 0, totalDays: 0, loading: true };

        const { startDate, endDate } = getNepaliMonthRange(nepYear, nepMonth);
        const startKey = getDateKey(startDate);
        const endKey = getDateKey(endDate);
        const daysInMonth = getDaysInNepaliMonth(nepYear, nepMonth);

        const chartData = [];
        const filteredData: Record<string, MealRecord> = {};
        let totalMeals = 0;

        // Iterate through each day of the Nepali Month to build chart data and stats
        for (let d = 1; d <= daysInMonth; d++) {
            // We need to reconstruct dates carefully because filteredData keys are Gregorian
            // but we want to iterate 1..daysInMonth for the Chart x-axis.
            try {
                // date for this day
                // Note: nepali-date-converter API might vary. 
                // Safer: new NepaliDate(nepYear, nepMonth, d) 
                // Safer: new NepaliDate(nepYear, nepMonth, d)
                const checkDate = new NepaliDate(nepYear, nepMonth, d);
                const jsDate = checkDate.toJsDate();
                const key = getDateKey(jsDate);

                const record = meals[key];
                let dailyCount = 0;

                if (record) {
                    filteredData[key] = record;
                    if (record.morning) {
                        dailyCount++;
                        totalMeals++;
                    }
                    if (record.night) {
                        dailyCount++;
                        totalMeals++;
                    }
                }

                chartData.push({ day: d, meals: dailyCount });
            } catch (e) {
                // Ignore invalid dates if any
            }
        }

        return {
            data: filteredData,
            chartData,
            totalMeals,
            totalDays: daysInMonth,
            loading: false
        };
    }, [meals, loading, nepYear, nepMonth]);

    return stats;
}
