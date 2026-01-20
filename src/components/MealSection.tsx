import { motion } from "framer-motion";
import { Check, Sun, Moon, Utensils } from "lucide-react";
import { hapticFeedback } from "@/lib/haptics";
import { cn } from "@/lib/utils";

interface MealSectionProps {
  title: string;
  type: 'morning' | 'night';
  value: boolean | null;
  onSelect: (value: boolean | null) => void;
}

export function MealSection({ title, type, value, onSelect }: MealSectionProps) {
  const Icon = type === 'morning' ? Sun : Moon;
  const isEaten = value === true;

  const handleToggle = () => {
    if (isEaten) {
      onSelect(false);
      hapticFeedback.light();
    } else {
      onSelect(true);
      hapticFeedback.success();
    }
  };

  return (
    <div className="bg-card/40 backdrop-blur-sm border border-white/40 dark:border-white/5 rounded-[2rem] p-5 shadow-soft hover:shadow-card transition-all duration-500 group relative overflow-hidden">
      {/* Background Gradient Hint */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none",
        type === 'morning' ? "bg-gradient-to-br from-orange-400 to-yellow-200" : "bg-gradient-to-br from-indigo-400 to-purple-400"
      )} />

      <div className="flex items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-3 rounded-2xl transition-colors duration-300",
            type === 'morning' ? "bg-orange-100/50 text-orange-500" : "bg-indigo-100/50 text-indigo-500"
          )}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-foreground tracking-tight">{title}</h3>
            <p className="text-sm text-muted-foreground font-medium">
              {isEaten ? "Recorded" : "Skipped / Not Eaten"}
            </p>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleToggle}
          className={cn(
            "h-14 min-w-[5rem] px-6 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 border-2 font-bold",
            isEaten
              ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/30"
              : "bg-secondary/50 border-transparent text-muted-foreground hover:bg-primary/10 hover:border-primary/20 hover:text-primary"
          )}
          aria-label={isEaten ? "Mark as not eaten" : "Mark as eaten"}
        >
          {isEaten ? (
            <>
              <Check className="w-5 h-5" />
              <span className="text-sm">Eaten</span>
            </>
          ) : (
            <>
              <Utensils className="w-5 h-5" />
              <span className="text-sm">Eat</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
