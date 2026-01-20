import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MealSection } from "./MealSection";
import { isToday, isPastDate, getSettings } from "@/lib/storage";
import { PinDialog } from "./PinDialog";
import { format } from "date-fns";
import { useMeals } from "@/hooks/useMeals";

interface EditMealDialogProps {
  date: Date | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function EditMealDialog({ date, open, onOpenChange, onUpdate }: EditMealDialogProps) {
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const settings = getSettings();

  // Conditionally hook usage is generally bad, but date can be null here.
  // We need to ensure useMeals can handle null date or we pass a dummy date.
  // Passing dummy date when closed is safer.
  const hookDate = date || new Date();
  const { meal, updateMealRecord, loading } = useMeals(hookDate);

  if (!date) return null;

  const needsPin = isPastDate(date) && settings.pinEnabled && !isUnlocked;
  const isTodayDate = isToday(date);

  const handleMealUpdate = async (type: 'morning' | 'night', value: boolean) => {
    if (needsPin) {
      setPinDialogOpen(true);
      return;
    }

    await updateMealRecord(type, value);
    onUpdate(); // Trigger refresh if parent needs it (though parent should use real-time listeners now)
  };

  const handlePinSuccess = () => {
    setIsUnlocked(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px] bg-card">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-center">
              {format(date, 'EEEE, MMMM d')}
              {isTodayDate && <span className="text-primary ml-2">(Today)</span>}
            </DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="py-8 text-center text-muted-foreground animate-pulse">Loading...</div>
          ) : (
            <div className="space-y-4 py-4">
              <MealSection
                title="Morning Meal"
                type="morning"
                value={meal.morning}
                onSelect={(value) => handleMealUpdate('morning', value)}
              />

              <MealSection
                title="Night Meal"
                type="night"
                value={meal.night}
                onSelect={(value) => handleMealUpdate('night', value)}
              />

              {needsPin && (
                <p className="text-sm text-muted-foreground text-center bg-muted/50 rounded-xl p-3">
                  🔒 PIN required to edit past entries
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <PinDialog
        open={pinDialogOpen}
        onOpenChange={setPinDialogOpen}
        onSuccess={handlePinSuccess}
        correctPin={settings.pin}
      />
    </>
  );
}
