import { useState, useEffect } from "react";
import { getSettings, saveSettings, type AppSettings } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { User, DollarSign, Lock, Check } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [newPin, setNewPin] = useState("");

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const updateSettings = (updates: Partial<AppSettings>) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    saveSettings(updates);
    toast.success("Settings saved!");
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateSettings({ pricePerMeal: value });
  };

  const handlePinToggle = (enabled: boolean) => {
    if (enabled && !settings.pin) {
      updateSettings({ pinEnabled: false });
      toast.error("Please set a PIN first");
      return;
    }
    updateSettings({ pinEnabled: enabled });
  };

  const handlePinComplete = (value: string) => {
    updateSettings({ pin: value, pinEnabled: true });
    setNewPin("");
    toast.success("PIN updated successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground font-body">
          Customize your meal tracking experience
        </p>
      </div>

      {/* Profile Card */}
      <div className="card-elevated p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <User className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-display text-xl text-foreground">Profile</h2>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm text-muted-foreground">Name</Label>
            <Input
              id="name"
              value={settings.userName}
              onChange={(e) => updateSettings({ userName: e.target.value })}
              className="bg-secondary/50 border-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-muted-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              value={settings.userEmail}
              onChange={(e) => updateSettings({ userEmail: e.target.value })}
              className="bg-secondary/50 border-border"
            />
          </div>
        </div>
      </div>

      {/* App Settings Card */}
      <div className="card-elevated p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-display text-xl text-foreground">App Settings</h2>
        </div>
        
        <div className="space-y-6">
          {/* Price Per Meal */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm text-muted-foreground">
              Price Per Meal (₹)
            </Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="1"
              value={settings.pricePerMeal}
              onChange={handlePriceChange}
              className="bg-secondary/50 border-border"
            />
            <p className="text-xs text-muted-foreground">
              Used to calculate monthly cost estimates
            </p>
          </div>
        </div>
      </div>

      {/* PIN Protection Card */}
      <div className="card-elevated p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-display text-xl text-foreground">PIN Protection</h2>
        </div>
        
        <div className="space-y-6">
          {/* PIN Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Enable PIN</p>
              <p className="text-xs text-muted-foreground">
                Require PIN to edit past entries
              </p>
            </div>
            <Switch
              checked={settings.pinEnabled}
              onCheckedChange={handlePinToggle}
            />
          </div>

          {/* Set/Change PIN */}
          <div className="space-y-3">
            <Label className="text-sm text-muted-foreground">
              {settings.pin ? 'Change PIN' : 'Set PIN'}
            </Label>
            <div className="flex items-center gap-4">
              <InputOTP
                maxLength={4}
                value={newPin}
                onChange={setNewPin}
                onComplete={handlePinComplete}
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot 
                    index={0} 
                    className="w-12 h-14 text-xl rounded-xl border-2 border-border"
                  />
                  <InputOTPSlot 
                    index={1} 
                    className="w-12 h-14 text-xl rounded-xl border-2 border-border"
                  />
                  <InputOTPSlot 
                    index={2} 
                    className="w-12 h-14 text-xl rounded-xl border-2 border-border"
                  />
                  <InputOTPSlot 
                    index={3} 
                    className="w-12 h-14 text-xl rounded-xl border-2 border-border"
                  />
                </InputOTPGroup>
              </InputOTP>
              
              {settings.pin && (
                <div className="flex items-center gap-1 text-success">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">PIN set</span>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Enter 4 digits to {settings.pin ? 'change' : 'set'} your PIN
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
