import { useState, useMemo } from "react";
import { Calendar } from "@/components/Calendar";
import { EditMealDialog } from "@/components/EditMealDialog";
import { useAllMeals } from "@/contexts/MealsContext";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, Calendar as CalendarIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "@/contexts/SettingsContext";
import NepaliDate from "nepali-date-converter";
import { getDateKey, MealRecord } from "@/lib/storage";

import { useNepaliMonthData } from "@/hooks/useNepaliMonthData";

// ... inside component ...

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const { meals, loading } = useAllMeals(); // Still needed for Calendar grid prop? Actually Calendar uses it internally or we pass it?
  // Calendar component takes `data` prop which is `meals`.

  const { settings } = useSettings();

  // Determine the Nepali Year/Month from the view 'currentDate'
  const nepDate = new NepaliDate(currentDate);
  const nepYear = nepDate.getYear();
  const nepMonth = nepDate.getMonth();

  // Use the shared hook for stats and chart
  const { chartData, totalMeals, totalDays, loading: loadingStats } = useNepaliMonthData(nepYear, nepMonth);

  const stats = useMemo(() => ({
    totalMeals,
    estimatedCost: totalMeals * settings.pricePerMeal,
    totalPossible: totalDays * 2
  }), [totalMeals, totalDays, settings.pricePerMeal]);


  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setDialogOpen(true);
  };

  return (
    <motion.div
      className="space-y-8 pb-24"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {/* Page Title */}
      <div className="flex items-center justify-between pt-6 px-2">
        <div>
          <h1 className="font-display text-4xl font-bold text-foreground tracking-tight">History</h1>
          <p className="text-muted-foreground font-medium">Your consistency graph</p>
        </div>
        <div className="bg-secondary/30 p-3 rounded-full">
          <TrendingUp className="w-6 h-6 text-primary" />
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="glass-card p-6 border-white/40 dark:border-white/5 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Monthly Overview</p>
            {(loading || loadingStats) ? (
              <Skeleton className="h-8 w-24 mt-1 rounded-lg" />
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-display">{stats.totalMeals}</span>
                <span className="text-sm text-muted-foreground font-medium">
                  / {stats.totalPossible}
                </span>
                <span className="text-sm text-emerald-500 font-medium bg-emerald-100/50 px-2 py-0.5 rounded-full ml-2">
                  Meals
                </span>
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-muted-foreground">Est. Cost</p>
            {(loading || loadingStats) ? (
              <Skeleton className="h-8 w-24 mt-1 rounded-lg ml-auto" />
            ) : (
              <span className="text-2xl font-bold font-display">₹{stats.estimatedCost.toLocaleString()}</span>
            )}
          </div>
        </div>

        <div className="h-[200px] w-full -ml-2 min-h-[200px]">
          {loading ? (
            <Skeleton className="w-full h-full rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorMeals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  interval={4}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="meals"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorMeals)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Collapsible/Toggleable Calendar Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <CalendarIcon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Detailed Log</h2>
        </div>

        <div className="glass-card p-1">
          <Calendar
            currentDate={currentDate}
            onMonthChange={setCurrentDate}
            onDateSelect={handleDateSelect}
            data={meals}
          />
        </div>
      </div>

      {/* Edit Dialog - No changes needed, it works with JS Date */}
      <EditMealDialog
        date={selectedDate}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onUpdate={() => { }}
      />
    </motion.div>
  );
}
