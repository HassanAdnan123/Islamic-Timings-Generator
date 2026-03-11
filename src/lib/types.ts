export interface PrayerTime {
  date: string; // "DD-MM-YYYY"
  day: string; // day of week
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface Theme {
  name: string;
  background: string | CanvasGradientConfig;
  tableBackground: string;
  textColor: string;
  headerColor: string;
  headerTextColor: string;
  highlightColor: string;
  highlightTextColor: string;
  accentColor: string;
  gridColor: string;
}

export interface CanvasGradientConfig {
  type: "linear";
  angle: number; // degrees
  stops: { offset: number; color: string }[];
}

export interface CachedMonth {
  city: string;
  country: string;
  year: number;
  month: number;
  data: PrayerTime[];
}

export interface WeekData {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  days: PrayerTime[];
}
