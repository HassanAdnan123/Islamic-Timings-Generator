import { useState, useEffect, useCallback } from "react";
import type { PrayerTime } from "../lib/types";
import { fetchMonthPrayerTimes } from "../lib/api";
import { getCachedMonth, cacheMonth, getFullYear, isYearCached } from "../lib/db";

interface UsePrayerTimesResult {
  data: PrayerTime[];
  loading: boolean;
  progress: number; // 0-12
  error: string | null;
  refetch: () => void;
}

export function usePrayerTimes(
  city: string,
  country: string,
  year: number
): UsePrayerTimesResult {
  const [data, setData] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setProgress(0);
    setError(null);

    try {
      // Check if full year is cached
      const cached = await isYearCached(city, year);
      if (cached) {
        const allDays = await getFullYear(city, year);
        setData(allDays);
        setProgress(12);
        setLoading(false);
        return;
      }

      // Fetch month by month, caching as we go
      const allDays: PrayerTime[] = [];
      for (let m = 1; m <= 12; m += 3) {
        const batch = [m, m + 1, m + 2].filter((x) => x <= 12);
        const results = await Promise.all(
          batch.map(async (month) => {
            const existing = await getCachedMonth(city, year, month);
            if (existing) return existing;
            const fetched = await fetchMonthPrayerTimes(city, country, year, month);
            await cacheMonth(city, country, year, month, fetched);
            return fetched;
          })
        );
        results.forEach((days) => allDays.push(...days));
        setProgress(Math.min(m + 2, 12));
      }

      setData(allDays);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch prayer times");
    } finally {
      setLoading(false);
    }
  }, [city, country, year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, progress, error, refetch: fetchData };
}
