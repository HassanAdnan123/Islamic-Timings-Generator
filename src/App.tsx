import { useState, useRef, useCallback, useMemo } from "react";
import type { Theme, WeekData } from "./lib/types";
import type { RenderOptions } from "./lib/canvas";
import { THEMES } from "./lib/themes";
import { getWeekData, getWeekStart, addWeeks } from "./lib/utils";
import { usePrayerTimes } from "./hooks/usePrayerTimes";
import WallpaperCanvas from "./components/WallpaperCanvas";
import WeekSelector from "./components/WeekSelector";
import ThemeSelector from "./components/ThemeSelector";
import CitySelector from "./components/CitySelector";
import DownloadButton from "./components/DownloadButton";
import "./App.css";

export default function App() {
  const [city, setCity] = useState("Karachi");
  const [country, setCountry] = useState("Pakistan");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [theme, setTheme] = useState<Theme>(THEMES[0]);
  const [highlightToday, setHighlightToday] = useState(false);
  const [biWeekly, setBiWeekly] = useState(false);
  const [use24hr, setUse24hr] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const year = selectedDate.getFullYear();
  const { data, loading, progress, error, refetch } = usePrayerTimes(city, country, year);

  const weekData: WeekData | null =
    data.length > 0 ? getWeekData(data, selectedDate, biWeekly) : null;

  const renderOptions: RenderOptions = useMemo(
    () => ({ highlightToday, use24hr }),
    [highlightToday, use24hr]
  );

  const handlePrev = useCallback(
    () => setSelectedDate((d) => addWeeks(d, biWeekly ? -2 : -1)),
    [biWeekly]
  );
  const handleNext = useCallback(
    () => setSelectedDate((d) => addWeeks(d, biWeekly ? 2 : 1)),
    [biWeekly]
  );
  const handleToday = useCallback(() => setSelectedDate(new Date()), []);

  const handleCityChange = useCallback(
    (newCity: string, newCountry: string) => {
      setCity(newCity);
      setCountry(newCountry);
    },
    []
  );

  const weekStart = getWeekStart(selectedDate);
  const weekEnd = weekData?.endDate ?? new Date(weekStart.getTime() + (biWeekly ? 13 : 6) * 86400000);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">
          <span className="title-icon">&#9774;</span>
          Prayer Times
        </h1>
        <CitySelector city={city} country={country} onCityChange={handleCityChange} />
      </header>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner" />
            <p className="loading-text">Fetching prayer times...</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(progress / 12) * 100}%` }}
              />
            </div>
            <p className="progress-text">{progress}/12 months</p>
          </div>
        </div>
      )}

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={refetch}>Retry</button>
        </div>
      )}

      <main className="app-main">
        <WeekSelector
          weekStart={weekStart}
          weekEnd={weekEnd}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
        />

        <div className="preview-section">
          <WallpaperCanvas
            week={weekData}
            theme={theme}
            options={renderOptions}
            canvasRef={canvasRef}
          />
        </div>

        <div className="controls-section">
          <ThemeSelector currentTheme={theme} onSelect={setTheme} />
          <div className="toggles-row">
            <label className="highlight-toggle">
              <input
                type="checkbox"
                checked={highlightToday}
                onChange={(e) => setHighlightToday(e.target.checked)}
              />
              <span className="toggle-track">
                <span className="toggle-thumb" />
              </span>
              Highlight today
            </label>
            <label className="highlight-toggle">
              <input
                type="checkbox"
                checked={biWeekly}
                onChange={(e) => setBiWeekly(e.target.checked)}
              />
              <span className="toggle-track">
                <span className="toggle-thumb" />
              </span>
              Bi-weekly
            </label>
            <label className="highlight-toggle">
              <input
                type="checkbox"
                checked={!use24hr}
                onChange={(e) => setUse24hr(!e.target.checked)}
              />
              <span className="toggle-track">
                <span className="toggle-thumb" />
              </span>
              12-hr
            </label>
          </div>
          <DownloadButton canvasRef={canvasRef} week={weekData} />
        </div>
      </main>
    </div>
  );
}
