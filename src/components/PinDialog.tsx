import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Lock } from "lucide-react";

interface PinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  correctPin: string;
}

export function PinDialog({ open, onOpenChange, onSuccess, correctPin }: PinDialogProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleComplete = (value: string) => {
    if (value === correctPin) {
      setPin("");
      setError(false);
      onSuccess();
      onOpenChange(false);
    } else {
      setError(true);
      setPin("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[340px] bg-card">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="font-display text-xl">Enter PIN</DialogTitle>
          <DialogDescription className="font-body">
            Enter your 4-digit PIN to edit past entries
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4 py-4">
          <InputOTP
            maxLength={4}
            value={pin}
            onChange={setPin}
            onComplete={handleComplete}
          >
            <InputOTPGroup className="gap-2">
              <InputOTPSlot 
                index={0} 
                className={`w-12 h-14 text-xl rounded-xl border-2 ${error ? 'border-destructive' : 'border-border'}`}
              />
              <InputOTPSlot 
                index={1} 
                className={`w-12 h-14 text-xl rounded-xl border-2 ${error ? 'border-destructive' : 'border-border'}`}
              />
              <InputOTPSlot 
                index={2} 
                className={`w-12 h-14 text-xl rounded-xl border-2 ${error ? 'border-destructive' : 'border-border'}`}
              />
              <InputOTPSlot 
                index={3} 
                className={`w-12 h-14 text-xl rounded-xl border-2 ${error ? 'border-destructive' : 'border-border'}`}
              />
            </InputOTPGroup>
          </InputOTP>
          
          {error && (
            <p className="text-sm text-destructive animate-fade-in">
              Incorrect PIN. Please try again.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
