export interface MealRecord {
  morning: boolean | null;
  night: boolean | null;
}

export interface AppSettings {
  pricePerMeal: number;
  pinEnabled: boolean;
  pin: string;
  userName: string;
  userEmail: string;
}

const MEALS_KEY = 'mealtracker_meals';
const SETTINGS_KEY = 'mealtracker_settings';

const defaultSettings: AppSettings = {
  pricePerMeal: 50,
  pinEnabled: false,
  pin: '',
  userName: 'Guest User',
  userEmail: 'guest@mealtracker.app',
};

export function getDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getAllMeals(): Record<string, MealRecord> {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(MEALS_KEY);
  return data ? JSON.parse(data) : {};
}

export function getMealForDate(date: Date): MealRecord {
  const meals = getAllMeals();
  const key = getDateKey(date);
  return meals[key] || { morning: null, night: null };
}

export function setMealForDate(date: Date, meal: MealRecord): void {
  const meals = getAllMeals();
  const key = getDateKey(date);
  meals[key] = meal;
  localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
}

export function updateMeal(date: Date, type: 'morning' | 'night', value: boolean): void {
  const current = getMealForDate(date);
  current[type] = value;
  setMealForDate(date, current);
}

export function getSettings(): AppSettings {
  if (typeof window === 'undefined') return defaultSettings;
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
}

export function saveSettings(settings: Partial<AppSettings>): void {
  const current = getSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
}

export function getMonthlyStats(year: number, month: number): { totalMeals: number; estimatedCost: number } {
  const meals = getAllMeals();
  const settings = getSettings();
  let totalMeals = 0;

  Object.entries(meals).forEach(([dateKey, record]) => {
    const [y, m] = dateKey.split('-').map(Number);
    if (y === year && m === month + 1) {
      if (record.morning === true) totalMeals++;
      if (record.night === true) totalMeals++;
    }
  });

  return {
    totalMeals,
    estimatedCost: totalMeals * settings.pricePerMeal,
  };
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
}

export function isFutureDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate > today;
}

export function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}
