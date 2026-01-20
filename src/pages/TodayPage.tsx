import { useState, useEffect } from "react";
import { MealSection } from "@/components/MealSection";
import { StatCard } from "@/components/StatCard";
import { getMealForDate, updateMeal, getMonthlyStats, getSettings } from "@/lib/storage";
import { Utensils, DollarSign } from "lucide-react";

export default function TodayPage() {
  const today = new Date();
  const [meal, setMeal] = useState({ morning: null as boolean | null, night: null as boolean | null });
  const [stats, setStats] = useState({ totalMeals: 0, estimatedCost: 0 });

  const loadData = () => {
    setMeal(getMealForDate(today));
    setStats(getMonthlyStats(today.getFullYear(), today.getMonth()));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMealUpdate = (type: 'morning' | 'night', value: boolean) => {
    updateMeal(today, type, value);
    loadData();
  };

  const settings = getSettings();

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl text-foreground mb-2">Today's Meals</h1>
        <p className="text-muted-foreground font-body">
          {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={<Utensils className="w-4 h-4 text-primary" />}
          label="Meals This Month"
          value={stats.totalMeals}
          suffix="meals"
        />
        <StatCard
          icon={<DollarSign className="w-4 h-4 text-primary" />}
          label="Estimated Cost"
          value={`₹${stats.estimatedCost.toLocaleString()}`}
        />
      </div>

      {/* Meal Sections */}
      <div className="space-y-4">
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
      </div>

      {/* Quick Tip */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 text-center">
        <p className="text-sm text-muted-foreground font-body">
          💡 <span className="text-foreground">Tip:</span> Tap YES or NO to instantly record your meal
        </p>
      </div>
    </div>
  );
}
