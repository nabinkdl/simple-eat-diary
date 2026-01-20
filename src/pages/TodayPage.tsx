import { MealSection } from "@/components/MealSection";
import { StatCard } from "@/components/StatCard";
import { Utensils, DollarSign, Sparkles, Check } from "lucide-react";
import { useMeals } from "@/hooks/useMeals";
import { useMonthData } from "@/hooks/useMonthData";
import { useSettings } from "@/contexts/SettingsContext";
import { motion, Variants } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useMemo } from "react";

export default function TodayPage() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const { meal, updateMealRecord, loading: loadingMeals } = useMeals(today);

  // Use useMonthData for consistency and real-time updates
  const { data, loading: loadingStats } = useMonthData(year, month);
  const { settings } = useSettings();

  // Calculate stats locally
  const stats = useMemo(() => {
    let totalMeals = 0;

    Object.values(data).forEach(record => {
      if (record.morning) totalMeals++;
      if (record.night) totalMeals++;
    });

    return {
      totalMeals,
      estimatedCost: totalMeals * settings.pricePerMeal
    };
  }, [data, settings.pricePerMeal]);

  const handleMealUpdate = (type: 'morning' | 'night', value: boolean | null) => {
    const previousValue = meal[type];

    // update immediately
    updateMealRecord(type, value);

    // Show undo toast
    toast("Meal updated", {
      description: value ? `Great job on your ${type} meal!` : `Marked ${type} meal as skipped`,
      action: {
        label: "Undo",
        onClick: () => updateMealRecord(type, previousValue as boolean)
      },
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 5) return "Late Night?";
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <motion.div
      className="space-y-8 pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Daily Dashboard Card */}
      <motion.div variants={itemVariants}>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-card/50 to-secondary/10 border border-white/20 dark:border-white/5 p-6 md:p-8 backdrop-blur-md shadow-elevated group">

          {/* Ambient Background Glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/20 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />

          <div className="relative z-10 flex flex-col gap-6">
            {/* Header: Greeting & Date */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                  {getGreeting()}
                </h1>
                <p className="text-muted-foreground font-medium mt-1">
                  Ready to track your nutrition?
                </p>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-background/50 backdrop-blur-md border border-white/10 text-xs font-semibold text-foreground/80 flex items-center gap-2 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              </div>
            </div>

            {/* Progress Section */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-foreground/90">Daily Progress</span>
                <span className="text-primary">{meal.morning && meal.night ? "100%" : meal.morning || meal.night ? "50%" : "0%"}</span>
              </div>
              <div className="h-4 w-full bg-secondary/30 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-primary/80"
                  initial={{ width: 0 }}
                  animate={{ width: meal.morning && meal.night ? "100%" : meal.morning || meal.night ? "50%" : "0%" }}
                  transition={{ type: "spring", stiffness: 50, damping: 20 }}
                />
              </div>
            </div>

            {/* Mini Stats Row */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-background/40 rounded-2xl p-3 border border-white/10 flex items-center gap-3">
                <div className="p-2 bg-emerald-100/80 dark:bg-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Est. Cost</p>
                  <p className="font-bold text-foreground">
                    {loadingStats ? "..." : `₹${stats.estimatedCost.toLocaleString()}`}
                  </p>
                </div>
              </div>
              <div className="bg-background/40 rounded-2xl p-3 border border-white/10 flex items-center gap-3">
                <div className="p-2 bg-blue-100/80 dark:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Monthly</p>
                  <p className="font-bold text-foreground">
                    {loadingStats ? "..." : `${stats.totalMeals} / 60`}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.div>

      {/* Meal Focus Section */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            Your Meals
            {meal.morning && meal.night && (
              <Check className="w-4 h-4 text-primary" />
            )}
          </h2>
          {meal.morning && meal.night && (
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              ALL DONE
            </span>
          )}
        </div>

        <div className="grid gap-5">
          {loadingMeals ? (
            <>
              <Skeleton className="h-40 w-full rounded-[2rem]" />
              <Skeleton className="h-40 w-full rounded-[2rem]" />
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </motion.div>

      {/* Motivational Quote */}
      <motion.div variants={itemVariants}>
        <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 border border-primary/10 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <p className="text-sm md:text-base font-medium text-foreground/80 relative z-10">
            "The only bad workout is the one that didn't happen. The same goes for healthy meals."
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
