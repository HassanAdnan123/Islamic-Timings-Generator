import { openDB, type IDBPDatabase } from "idb";
import type { PrayerTime, CachedMonth } from "./types";

const DB_NAME = "prayer-times-db";
const DB_VERSION = 1;
const STORE_NAME = "monthly-data";

async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    },
  });
}

function makeKey(city: string, year: number, month: number): string {
  return `${city.toLowerCase()}-${year}-${month}`;
}

export async function getCachedMonth(
  city: string,
  year: number,
  month: number
): Promise<PrayerTime[] | null> {
  const db = await getDB();
  const record = await db.get(STORE_NAME, makeKey(city, year, month));
  return record ? record.data : null;
}

export async function cacheMonth(
  city: string,
  country: string,
  year: number,
  month: number,
  data: PrayerTime[]
): Promise<void> {
  const db = await getDB();
  const entry: CachedMonth & { key: string } = {
    key: makeKey(city, year, month),
    city,
    country,
    year,
    month,
    data,
  };
  await db.put(STORE_NAME, entry);
}

export async function isYearCached(
  city: string,
  year: number
): Promise<boolean> {
  const db = await getDB();
  for (let m = 1; m <= 12; m++) {
    const record = await db.get(STORE_NAME, makeKey(city, year, m));
    if (!record) return false;
  }
  return true;
}

export async function getFullYear(
  city: string,
  year: number
): Promise<PrayerTime[]> {
  const db = await getDB();
  const allDays: PrayerTime[] = [];
  for (let m = 1; m <= 12; m++) {
    const record = await db.get(STORE_NAME, makeKey(city, year, m));
    if (record) {
      allDays.push(...record.data);
    }
  }
  return allDays;
}

export async function clearCache(): Promise<void> {
  const db = await getDB();
  await db.clear(STORE_NAME);
}
