import type { Theme, CanvasGradientConfig } from "../lib/types";
import { THEMES, shuffleTheme } from "../lib/themes";

interface Props {
  currentTheme: Theme;
  onSelect: (theme: Theme) => void;
}

function getPreviewColor(theme: Theme): string {
  const bg = theme.background;
  if (typeof bg === "string") return bg;
  const grad = bg as CanvasGradientConfig;
  return grad.stops[grad.stops.length - 1].color;
}

export default function ThemeSelector({ currentTheme, onSelect }: Props) {
  return (
    <div className="theme-selector">
      <div className="theme-label">Theme</div>
      <div className="theme-grid">
        {THEMES.map((theme) => (
          <button
            key={theme.name}
            className={`theme-chip ${currentTheme.name === theme.name ? "active" : ""}`}
            onClick={() => onSelect(theme)}
            title={theme.name}
          >
            <span
              className="theme-dot"
              style={{
                background: getPreviewColor(theme),
                borderColor: theme.accentColor,
              }}
            />
            <span className="theme-name">{theme.name}</span>
          </button>
        ))}
        <button
          className="theme-chip shuffle-btn"
          onClick={() => onSelect(shuffleTheme())}
          title="Random theme variant"
        >
          <span className="shuffle-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="theme-name">Shuffle</span>
        </button>
      </div>
    </div>
  );
}
