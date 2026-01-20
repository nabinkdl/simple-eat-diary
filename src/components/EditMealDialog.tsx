import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MealSection } from "./MealSection";
import { getMealForDate, updateMeal, isToday, isPastDate, getSettings } from "@/lib/storage";
import { PinDialog } from "./PinDialog";
import { format } from "date-fns";

interface EditMealDialogProps {
  date: Date | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function EditMealDialog({ date, open, onOpenChange, onUpdate }: EditMealDialogProps) {
  const [meal, setMeal] = useState({ morning: null as boolean | null, night: null as boolean | null });
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const settings = getSettings();

  useEffect(() => {
    if (date) {
      setMeal(getMealForDate(date));
      setIsUnlocked(false);
    }
  }, [date]);

  if (!date) return null;

  const needsPin = isPastDate(date) && settings.pinEnabled && !isUnlocked;
  const isTodayDate = isToday(date);

  const handleMealUpdate = (type: 'morning' | 'night', value: boolean) => {
    if (needsPin) {
      setPinDialogOpen(true);
      return;
    }
    
    updateMeal(date, type, value);
    setMeal(prev => ({ ...prev, [type]: value }));
    onUpdate();
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
