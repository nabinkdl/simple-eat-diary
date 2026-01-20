import { writeBatch, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getDateKey, MealRecord } from "@/lib/storage";

export async function seedUserData(userId: string) {
    const batch = writeBatch(db);
    const today = new Date();

    // Seed last 30 days
    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // Skip today (let user decide)
        if (i === 0) continue;

        const dateKey = getDateKey(date);
        const docRef = doc(db, "users", userId, "meals", dateKey);

        // Randomize data
        // 70% chance of tracking, mostly good habits
        if (Math.random() > 0.3) {
            const morning = Math.random() > 0.2; // 80% chance true
            const night = Math.random() > 0.2;   // 80% chance true

            const record: MealRecord = {
                morning,
                night
            };

            batch.set(docRef, record);
        }
    }

    try {
        await batch.commit();
        console.log("Mock data seeded for user:", userId);
    } catch (error) {
        console.error("Error seeding mock data:", error);
    }
}
