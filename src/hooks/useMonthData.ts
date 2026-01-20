import { useAllMeals } from "@/contexts/MealsContext";
import { getDateKey, MealRecord } from "@/lib/storage";

export function useMonthData(year: number, month: number) {
    const { meals, loading } = useAllMeals();

    // Filter the global meals state for the requested month
    const filteredData: Record<string, MealRecord> = {};

    // We can just return all meals and let the calendar component ignore extra data? 
    // Or filter. Filtering is cleaner API.

    if (loading) return { data: {}, loading: true };

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    const startKey = getDateKey(startDate);
    const endKey = getDateKey(endDate);

    Object.keys(meals).forEach(key => {
        if (key >= startKey && key <= endKey) {
            filteredData[key] = meals[key];
        }
    });

    return { data: filteredData, loading: false };
}
