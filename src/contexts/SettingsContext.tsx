import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AppSettings, getSettings, saveSettings as persistSettings } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface SettingsContextType {
    settings: AppSettings;
    updateSettings: (newSettings: Partial<AppSettings>) => void;
    loading: boolean;
    syncNow: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [settings, setSettings] = useState<AppSettings>(getSettings());
    const [loading, setLoading] = useState(true);

    // Load from Firestore when user logs in
    useEffect(() => {
        if (!user) {
            // Fallback to local storage if not logged in
            setSettings(getSettings());
            setLoading(false);
            return;
        }

        const settingsRef = doc(db, "users", user.uid, "settings", "preferences");

        const unsubscribe = onSnapshot(settingsRef, async (docSnap) => {
            if (docSnap.exists()) {
                // Cloud settings exist, use them
                setSettings({ ...getSettings(), ...docSnap.data() } as AppSettings);
            } else {
                // Cloud settings don't exist yet (first login)
                // Upload current local settings to initialize cloud
                const currentLocal = getSettings();
                await setDoc(settingsRef, currentLocal);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    // Listen for local storage changes (tabs sync)
    useEffect(() => {
        const handleStorageChange = () => {
            if (!user) {
                setSettings(getSettings());
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [user]);

    const updateSettings = async (newSettings: Partial<AppSettings>) => {
        // Optimistic update
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        persistSettings(newSettings); // Always save to local as backup/cache

        if (user) {
            // Sync to cloud
            const settingsRef = doc(db, "users", user.uid, "settings", "preferences");
            await setDoc(settingsRef, newSettings, { merge: true });
        }
    };

    const syncNow = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const settingsRef = doc(db, "users", user.uid, "settings", "preferences");
            const docSnap = await getDoc(settingsRef);

            if (docSnap.exists()) {
                const cloudSettings = docSnap.data() as AppSettings;
                setSettings(prev => ({ ...prev, ...cloudSettings }));
                persistSettings({ ...settings, ...cloudSettings });
            } else {
                // If no cloud settings, push current
                await setDoc(settingsRef, settings);
            }
        } catch (error) {
            console.error("Sync failed:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, loading, syncNow }}>
            {children}
        </SettingsContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}
