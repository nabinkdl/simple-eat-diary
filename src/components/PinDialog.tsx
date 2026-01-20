import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState, useEffect } from "react";
import { Lock, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface PinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  correctPin: string;
}

export function PinDialog({ open, onOpenChange, onSuccess, correctPin }: PinDialogProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (open) {
      setPin("");
      setError(false);
    }
  }, [open]);

  const handleComplete = (value: string) => {
    if (value === correctPin) {
      onSuccess();
      onOpenChange(false);
    } else {
      setError(true);
      setPin("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 shadow-2xl rounded-[2rem] p-8 gap-8">
        <DialogHeader className="items-center text-center space-y-4">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-500",
            error ? "bg-red-100 text-red-500 animate-pulse" : "bg-indigo-50 text-indigo-500"
          )}>
            {error ? <ShieldAlert className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
          </div>
          <div>
            <DialogTitle className="font-display text-2xl font-bold tracking-tight">
              {error ? "Incorrect PIN" : "Security Check"}
            </DialogTitle>
            <p className="text-muted-foreground mt-2 font-medium">
              Enter your security PIN to unlock past entries
            </p>
          </div>
        </DialogHeader>

        <div className="flex justify-center pb-4">
          <InputOTP
            maxLength={4}
            value={pin}
            onChange={(val) => {
              setPin(val);
              if (error) setError(false);
            }}
            onComplete={handleComplete}
          >
            <InputOTPGroup className="gap-4">
              {[0, 1, 2, 3].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className={cn(
                    "w-14 h-16 text-2xl rounded-2xl border-2 transition-all duration-300",
                    error
                      ? "border-red-200 bg-red-50 text-red-500"
                      : "border-slate-100 bg-slate-50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  )}
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
      </DialogContent>
    </Dialog>
  );
}
