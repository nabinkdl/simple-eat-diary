import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { collection, onSnapshot, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { MealRecord, getDateKey } from "@/lib/storage";

interface MealsContextType {
    meals: Record<string, MealRecord>;
    loading: boolean;
    updateMeal: (date: Date, type: 'morning' | 'night', value: boolean) => Promise<void>;
}

const MealsContext = createContext<MealsContextType | undefined>(undefined);

export function MealsProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [meals, setMeals] = useState<Record<string, MealRecord>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setMeals({});
            setLoading(false);
            return;
        }

        const q = collection(db, "users", user.uid, "meals");

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newMeals: Record<string, MealRecord> = {};
            snapshot.forEach((doc) => {
                newMeals[doc.id] = doc.data() as MealRecord;
            });
            setMeals(newMeals);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const updateMeal = async (date: Date, type: 'morning' | 'night', value: boolean) => {
        if (!user) return;
        const dateKey = getDateKey(date);

        // Optimistic update handled by local listener usually, 
        // but we can also set local state if we want instant feedback before roundtrip
        // However, Firestore listener is very fast locally.

        const docRef = doc(db, "users", user.uid, "meals", dateKey);
        const currentMeal = meals[dateKey] || { morning: null, night: null };
        const updatedMeal = { ...currentMeal, [type]: value };

        await setDoc(docRef, updatedMeal, { merge: true });
    };

    return (
        <MealsContext.Provider value={{ meals, loading, updateMeal }}>
            {children}
        </MealsContext.Provider>
    );
}

export function useAllMeals() {
    const context = useContext(MealsContext);
    if (!context) {
        throw new Error("useAllMeals must be used within a MealsProvider");
    }
    return context;
}
