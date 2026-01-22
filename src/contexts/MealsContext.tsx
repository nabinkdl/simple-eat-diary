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
        }, (error) => {
            console.error("Error fetching meals:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const syncMeals = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Trigger a manual fetch to ensure consistency? 
            // Primarily relies on onSnapshot, but we can verify here if needed.
            // For now, let's just let onSnapshot handle it, but maybe expose a way to check.
            // Actually, let's just re-init the listener if needed, but the hook handles that.
            // Let's just simulate a "refresh" by setting loading true briefly? 
            // Or better, do nothing as onSnapshot is real-time.
            // If the user wants to "Sync", we can maybe fetch once.

            // Let's rely on onSnapshot for now as it's best for collections.
            setLoading(false);
        } catch (error) {
            console.error("Sync meals failed:", error);
        }
    };

    const updateMeal = async (date: Date, type: 'morning' | 'night', value: boolean) => {
        if (!user) {
            console.warn("Attempted to update meal without user");
            return;
        }
        const dateKey = getDateKey(date);
        console.log(`Updating meal for ${dateKey}: ${type} = ${value}`);

        const docRef = doc(db, "users", user.uid, "meals", dateKey);
        const currentMeal = meals[dateKey] || { morning: null, night: null };
        const updatedMeal = { ...currentMeal, [type]: value };

        try {
            await setDoc(docRef, updatedMeal, { merge: true });
            console.log("Meal updated successfully");
        } catch (error) {
            console.error("Error updating meal:", error);
            throw error;
        }
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
