import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AppSettings } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { Shield, CreditCard, Download, Share, PlusSquare, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { UserCard } from "@/components/settings/UserCard";
import { PreferenceItem } from "@/components/settings/PreferenceItem";
import { usePWA } from "@/hooks/usePWA";
import { PinDialog } from "@/components/PinDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { settings, updateSettings, loading: settingsLoading, syncNow } = useSettings();
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [isDirty, setIsDirty] = useState(false);
  const { isInstallable, isStandalone, isIOS, install } = usePWA();
  const [pinCheckOpen, setPinCheckOpen] = useState(false);
  const [iosHelpOpen, setIosHelpOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync local state if context updates
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncNow();
      toast("Sync Complete", {
        description: "Your settings are up to date.",
      });
    } catch (error) {
      toast.error("Sync Failed", {
        description: "Check your connection and try again.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setIsDirty(false);
  };

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleResetData = () => {
    if (settings.pinEnabled) {
      setPinCheckOpen(true);
    } else {
      performReset();
    }
  };

  const performReset = () => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      import("@/lib/cleanup").then(({ deleteAllUserData }) => {
        if (user) deleteAllUserData(user.uid);
      });
    }
  };

  if (settingsLoading) {
    return (
      <div className="space-y-8 pb-24 pt-6 px-2">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted/20 rounded-lg animate-pulse" />
          <div className="h-4 w-32 bg-muted/20 rounded-lg animate-pulse" />
        </div>
        <div className="h-24 w-full bg-muted/20 rounded-3xl animate-pulse" />
        <div className="space-y-4">
          <div className="h-4 w-24 bg-muted/20 rounded animate-pulse" />
          <div className="h-64 w-full bg-muted/20 rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8 pb-24"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {/* Header */}
      <div className="pt-6 px-2">
        <h1 className="font-display text-4xl font-bold text-foreground tracking-tight">Settings</h1>
        <p className="text-muted-foreground font-medium">Manage your preferences</p>
      </div>

      {/* User Card */}
      <UserCard user={user} onLogout={() => logout()} />

      {/* Preferences Group */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest px-2">Preferences</h3>

        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl overflow-hidden divide-y divide-border/50">
          {/* Install App - Only visible if installable or iOS not installed */}
          {(!isStandalone && (isInstallable || isIOS)) && (
            <PreferenceItem
              icon={<Download className="w-5 h-5" />}
              title="Install App"
              description="Add to your home screen"
              iconBgColor="bg-blue-100/50"
              iconColor="text-blue-600"
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => isIOS ? setIosHelpOpen(true) : install()}
                  className="rounded-xl border-blue-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  Install
                </Button>
              }
            />
          )}

          {/* Sync Data */}
          <PreferenceItem
            icon={<RefreshCw className={`w-5 h-5 ${isSyncing ? "animate-spin" : ""}`} />}
            title="Cloud Sync"
            description={user ? "Syncing with your account" : "Sign in to sync data"}
            iconBgColor="bg-violet-100/50"
            iconColor="text-violet-600"
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={isSyncing || !user}
                className="rounded-xl border-violet-200 text-violet-600 hover:text-violet-700 hover:bg-violet-50"
              >
                {isSyncing ? "Syncing..." : "Sync Now"}
              </Button>
            }
          />

          {/* Price Setting */}
          <PreferenceItem
            icon={<CreditCard className="w-5 h-5" />}
            title="Meal Price"
            description="Cost estimation per meal"
            iconBgColor="bg-emerald-100/50"
            iconColor="text-emerald-600"
            action={
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">₹</span>
                <Input
                  type="number"
                  value={localSettings.pricePerMeal}
                  onChange={(e) => updateSetting('pricePerMeal', Number(e.target.value))}
                  className="w-20 text-right bg-transparent border-none focus-visible:ring-0 font-bold text-lg p-0 h-auto"
                />
              </div>
            }
          />

          {/* PIN Security */}
          <PreferenceItem
            icon={<Shield className="w-5 h-5" />}
            title="PIN Protection"
            description="Secure past entries"
            iconBgColor="bg-orange-100/50"
            iconColor="text-orange-600"
            action={
              <Switch
                checked={localSettings.pinEnabled}
                onCheckedChange={(c) => updateSetting('pinEnabled', c)}
              />
            }
          />

          {/* PIN Input (Conditional) */}
          {localSettings.pinEnabled && (
            <div className="p-4 pl-14 bg-muted/20">
              <div className="space-y-2">
                <Label htmlFor="pin" className="text-xs">Security PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  maxLength={4}
                  value={localSettings.pin}
                  onChange={(e) => updateSetting('pin', e.target.value)}
                  placeholder="****"
                  className="bg-background/80"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-destructive uppercase tracking-widest px-2">Danger Zone</h3>
        <div className="bg-destructive/10 backdrop-blur-sm border border-destructive/20 rounded-3xl overflow-hidden p-4 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-destructive">Reset Data</h4>
            <p className="text-xs text-destructive/80">Permanently delete all meal history</p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleResetData}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Save Button */}
      {
        isDirty && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-24 left-4 right-4 max-w-4xl mx-auto z-40"
          >
            <Button
              onClick={handleSave}
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground shadow-elevated font-bold text-lg"
            >
              Save Changes
            </Button>
          </motion.div>
        )
      }

      {/* Footer Info */}
      <div className="text-center text-xs text-muted-foreground/40 pt-8">
        Simple Eat Diary v2.0
      </div>

      {/* Security Check Dialog */}
      <PinDialog
        open={pinCheckOpen}
        onOpenChange={setPinCheckOpen}
        onSuccess={performReset}
        correctPin={settings.pin}
      />

      {/* iOS Install Help Dialog */}
      <Dialog open={iosHelpOpen} onOpenChange={setIosHelpOpen}>
        <DialogContent className="sm:max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 shadow-2xl rounded-[2rem] p-6">
          <DialogHeader>
            <DialogTitle>Install on iOS</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">To install this app on your iPhone:</p>
            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
              <div className="p-2 bg-background rounded-lg shadow-sm">
                <Share className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-sm font-medium">1. Tap the Share button</p>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
              <div className="p-2 bg-background rounded-lg shadow-sm">
                <PlusSquare className="w-5 h-5 text-foreground" />
              </div>
              <p className="text-sm font-medium">2. Select "Add to Home Screen"</p>
            </div>
            <Button className="w-full rounded-xl" onClick={() => setIosHelpOpen(false)}>Got it</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div >
  );
}
