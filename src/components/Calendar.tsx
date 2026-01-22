import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import NepaliDate from "nepali-date-converter";
import {
  getDateKey,
  isFutureDate,
  MealRecord
} from "@/lib/storage";
import {
  getDaysInNepaliMonth,
  NEPALI_MONTHS,
  WEEKDAYS
} from "@/lib/nepali-utils";

interface CalendarProps {
  currentDate: Date;
  onMonthChange: (date: Date) => void;
  onDateSelect: (date: Date) => void;
  data: Record<string, MealRecord>;
}

export function Calendar({ currentDate, onMonthChange, onDateSelect, data }: CalendarProps) {
  // Convert current view date to Nepali to determine Year/Month to show
  // We use the passed 'currentDate' as the anchor.
  const currentNepDate = new NepaliDate(currentDate);
  const nepYear = currentNepDate.getYear();
  const nepMonth = currentNepDate.getMonth(); // 0-11

  // Function to get start of a Nepali month in JS Date
  const getNepaliMonthStart = (nYear: number, nMonth: number) => {
    const np = new NepaliDate(nYear, nMonth, 1);
    return new Date(np.toJsDate());
  };

  const prevMonth = () => {
    // Determine previous Nepali month
    let newMonth = nepMonth - 1;
    let newYear = nepYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    const newDate = getNepaliMonthStart(newYear, newMonth);
    onMonthChange(newDate);
  };

  const nextMonth = () => {
    // Determine next Nepali month
    let newMonth = nepMonth + 1;
    let newYear = nepYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    const newDate = getNepaliMonthStart(newYear, newMonth);
    onMonthChange(newDate);
  };

  // Generate days for the current Nepali Month
  // Get 1st of this month
  const startOfMonth = new NepaliDate(nepYear, nepMonth, 1);
  const startOfMonthJs = startOfMonth.toJsDate();

  // Find which day of week (0-6) the 1st falls on
  const startDayOfWeek = startOfMonthJs.getDay(); // 0 = Sunday

  // Get days in this month from util
  const totalDays = getDaysInNepaliMonth(nepYear, nepMonth);

  const daysInMonth: { day: number, jsDate: Date }[] = [];
  for (let d = 1; d <= totalDays; d++) {
    const checkDate = new NepaliDate(nepYear, nepMonth, d);
    // Ensure Date object is robust for key generation
    daysInMonth.push({ day: d, jsDate: checkDate.toJsDate() });
  }

  const getDayStatus = (date: Date): 'success' | 'partial' | 'missed' | 'empty' | 'future' | 'today' => {
    if (isFutureDate(date)) return 'future';

    const key = getDateKey(date);
    const meal = data[key] || { morning: null, night: null };

    const yesCount = [meal.morning, meal.night].filter(v => v === true).length;
    const hasAnyRecord = meal.morning !== null || meal.night !== null;

    // Check if it's strictly today (Standard JS Date "today")
    const now = new Date();
    const isToday = date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday && !hasAnyRecord) return 'empty';
    if (yesCount === 2) return 'success';
    if (yesCount === 1) return 'partial';
    if (hasAnyRecord || !isFutureDate(date)) return 'missed';
    return 'empty';
  };

  return (
    <div className="card-elevated p-6 animate-fade-in bg-card/80 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={prevMonth}
          className="p-2 rounded-xl hover:bg-secondary/80 text-foreground/60 hover:text-foreground transition-all duration-200"
          aria-label="Previous Month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="font-display text-2xl font-bold text-foreground tracking-tight">
          {NEPALI_MONTHS[nepMonth]} <span className="text-primary font-normal">{nepYear}</span>
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-xl hover:bg-secondary/80 text-foreground/60 hover:text-foreground transition-all duration-200"
          aria-label="Next Month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {WEEKDAYS.map(day => (
          <div
            key={day}
            className="text-center text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/80 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty cells for offset */}
        {Array.from({ length: startDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Day cells */}
        {daysInMonth.map(({ day, jsDate }) => {
          const status = getDayStatus(jsDate);

          // Check if today matches this specific cell
          const now = new Date();
          const isToday = jsDate.getDate() === now.getDate() &&
            jsDate.getMonth() === now.getMonth() &&
            jsDate.getFullYear() === now.getFullYear();

          return (
            <button
              key={day}
              onClick={() => onDateSelect(jsDate)}
              disabled={status === 'future'}
              className={cn(
                "rounded-2xl relative transition-all duration-200 aspect-square flex items-center justify-center text-sm font-medium",
                status === 'success' && 'calendar-day-success hover:shadow-md hover:scale-105',
                status === 'partial' && 'calendar-day-partial hover:shadow-md hover:scale-105',
                status === 'missed' && 'calendar-day-missed hover:shadow-md hover:scale-105',
                status === 'empty' && 'calendar-day-empty hover:bg-muted/50 text-foreground',
                status === 'future' && 'calendar-day-future cursor-not-allowed opacity-50 bg-transparent text-muted-foreground',
                isToday && 'ring-2 ring-primary ring-offset-2 ring-offset-card font-bold bg-primary/5'
              )}
            >
              <span className="relative z-10">{day}</span>
              {isToday && (
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-border/50 justify-center">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/30">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-xs font-medium text-muted-foreground">Detailed</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/30">
          <div className="w-3 h-3 rounded-full bg-warning" />
          <span className="text-xs font-medium text-muted-foreground">Partial</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/30">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span className="text-xs font-medium text-muted-foreground">Missed</span>
        </div>
      </div>
    </div>
  );
}
