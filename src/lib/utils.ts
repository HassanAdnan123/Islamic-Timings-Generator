import type { PrayerTime, WeekData } from "./types";

// Get ISO week number (Monday-based)
export function getISOWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

// Get the Monday of the week containing the given date
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Get the Sunday of the week
export function getWeekEnd(date: Date): Date {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return end;
}

// Parse "DD-MM-YYYY" to Date
export function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// Format Date to "DD MMM" (e.g., "11 Mar")
export function formatShortDate(date: Date): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

// Format Date to "DD MMM YYYY"
export function formatFullDate(date: Date): string {
  return `${formatShortDate(date)} ${date.getFullYear()}`;
}

// Get week data from prayer times array for a given date
export function getWeekData(
  allDays: PrayerTime[],
  referenceDate: Date,
  biWeekly: boolean = false
): WeekData {
  const weekStart = getWeekStart(referenceDate);
  const totalDays = biWeekly ? 14 : 7;
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + totalDays - 1);
  const weekNum = getISOWeekNumber(referenceDate);

  const days: PrayerTime[] = [];

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const dateStr = `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;

    const found = allDays.find((pt) => pt.date === dateStr);
    if (found) {
      days.push(found);
    }
  }

  return {
    weekNumber: weekNum,
    startDate: weekStart,
    endDate: weekEnd,
    days,
  };
}

// Check if two dates are the same calendar day
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Navigate weeks
export function addWeeks(date: Date, weeks: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + weeks * 7);
  return d;
}
