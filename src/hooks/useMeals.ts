import { useAllMeals } from "@/contexts/MealsContext";
import { getDateKey } from "@/lib/storage";

export function useMeals(date: Date) {
    const { meals, loading, updateMeal } = useAllMeals();

    const dateKey = getDateKey(date);
    // Be safe with undefined access
    const meal = meals[dateKey] ?? { morning: null, night: null };

    const updateMealRecord = async (type: 'morning' | 'night', value: boolean | null) => {
        await updateMeal(date, type, value);
    };

    return { meal, loading, updateMealRecord };
}
