import { useState } from "react";
import { Calendar } from "@/components/Calendar";
import { EditMealDialog } from "@/components/EditMealDialog";
import { getMonthlyStats } from "@/lib/storage";
import { StatCard } from "@/components/StatCard";
import { Utensils, DollarSign } from "lucide-react";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const today = new Date();
  const stats = getMonthlyStats(today.getFullYear(), today.getMonth());

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setDialogOpen(true);
  };

  const handleUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl text-foreground mb-2">Meal Calendar</h1>
        <p className="text-muted-foreground font-body">
          Track your meal consistency over time
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

      {/* Calendar */}
      <Calendar key={refreshKey} onDateSelect={handleDateSelect} />

      {/* Edit Dialog */}
      <EditMealDialog
        date={selectedDate}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
