import { collection, getDocs, writeBatch, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function deleteAllUserData(userId: string) {
    const batch = writeBatch(db);
    const mealsRef = collection(db, "users", userId, "meals");
    const snapshot = await getDocs(mealsRef);

    // Firestore batches are limited to 500 ops.
    // For a simply diary app, this might be fine, but if user uses it for years...
    // We'll implement a chunked delete.

    const CHUNK_SIZE = 400;
    let currentBatch = writeBatch(db);
    let count = 0;

    for (const docSnapshot of snapshot.docs) {
        currentBatch.delete(docSnapshot.ref);
        count++;

        if (count >= CHUNK_SIZE) {
            await currentBatch.commit();
            currentBatch = writeBatch(db);
            count = 0;
        }
    }

    if (count > 0) {
        await currentBatch.commit();
    }
}
