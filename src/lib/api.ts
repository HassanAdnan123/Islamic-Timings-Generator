import type { PrayerTime } from "./types";

const BASE_URL = "https://api.aladhan.com/v1";

interface AladhanTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface AladhanDay {
  timings: AladhanTimings;
  date: {
    readable: string;
    gregorian: {
      date: string; // "DD-MM-YYYY"
      weekday: { en: string };
      day: string;
      month: { number: number; en: string };
      year: string;
    };
  };
}

function formatTime(time: string): string {
  // Aladhan returns "HH:MM (TZ)" - strip the timezone part
  return time.replace(/\s*\(.*\)/, "");
}

function mapDay(day: AladhanDay): PrayerTime {
  return {
    date: day.date.gregorian.date,
    day: day.date.gregorian.weekday.en.slice(0, 3), // "Mon", "Tue", etc.
    fajr: formatTime(day.timings.Fajr),
    sunrise: formatTime(day.timings.Sunrise),
    dhuhr: formatTime(day.timings.Dhuhr),
    asr: formatTime(day.timings.Asr),
    maghrib: formatTime(day.timings.Maghrib),
    isha: formatTime(day.timings.Isha),
  };
}

export async function fetchMonthPrayerTimes(
  city: string,
  country: string,
  year: number,
  month: number
): Promise<PrayerTime[]> {
  const url = `${BASE_URL}/calendarByCity/${year}/${month}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=1`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch prayer times: ${response.statusText}`);
  }

  const json = await response.json();
  if (json.code !== 200 || !json.data) {
    throw new Error("Invalid response from Aladhan API");
  }

  return (json.data as AladhanDay[]).map(mapDay);
}

export async function fetchYearPrayerTimes(
  city: string,
  country: string,
  year: number,
  onProgress?: (completed: number, total: number) => void
): Promise<PrayerTime[]> {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const allDays: PrayerTime[] = [];

  // Fetch in batches of 3 to avoid overwhelming the API
  for (let i = 0; i < months.length; i += 3) {
    const batch = months.slice(i, i + 3);
    const results = await Promise.all(
      batch.map((m) => fetchMonthPrayerTimes(city, country, year, m))
    );
    results.forEach((days) => allDays.push(...days));
    onProgress?.(Math.min(i + 3, 12), 12);
  }

  return allDays;
}
