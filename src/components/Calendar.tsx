import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  getMealForDate,
  isToday,
  isFutureDate,
} from "@/lib/storage";

interface CalendarProps {
  onDateSelect: (date: Date) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function Calendar({ onDateSelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const days = getDaysInMonth(year, month);
  const firstDayOffset = getFirstDayOfMonth(year, month);
  
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  const getDayStatus = (date: Date): 'success' | 'partial' | 'missed' | 'empty' | 'future' | 'today' => {
    if (isFutureDate(date)) return 'future';
    
    const meal = getMealForDate(date);
    const yesCount = [meal.morning, meal.night].filter(v => v === true).length;
    const hasAnyRecord = meal.morning !== null || meal.night !== null;
    
    if (isToday(date) && !hasAnyRecord) return 'empty';
    if (yesCount === 2) return 'success';
    if (yesCount === 1) return 'partial';
    if (hasAnyRecord || !isFutureDate(date)) return 'missed';
    return 'empty';
  };
  
  return (
    <div className="card-elevated p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-2 rounded-xl hover:bg-secondary transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="font-display text-xl text-foreground">
          {MONTHS[month]} {year}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-xl hover:bg-secondary transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>
      
      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map(day => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for offset */}
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        
        {/* Day cells */}
        {days.map(date => {
          const status = getDayStatus(date);
          const today = isToday(date);
          
          return (
            <button
              key={date.getDate()}
              onClick={() => onDateSelect(date)}
              disabled={status === 'future'}
              className={cn(
                status === 'success' && 'calendar-day-success',
                status === 'partial' && 'calendar-day-partial',
                status === 'missed' && 'calendar-day-missed',
                status === 'empty' && 'calendar-day-empty',
                status === 'future' && 'calendar-day-future cursor-not-allowed',
                today && 'ring-2 ring-primary ring-offset-2 ring-offset-card'
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-border justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded calendar-day-success" />
          <span className="text-xs text-muted-foreground">Both meals</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded calendar-day-partial" />
          <span className="text-xs text-muted-foreground">One meal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded calendar-day-missed" />
          <span className="text-xs text-muted-foreground">No meals</span>
        </div>
      </div>
    </div>
  );
}
