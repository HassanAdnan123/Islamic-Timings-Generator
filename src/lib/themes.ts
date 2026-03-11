import type { Theme, CanvasGradientConfig } from "./types";

function linearGradient(
  angle: number,
  ...stops: [number, string][]
): CanvasGradientConfig {
  return {
    type: "linear",
    angle,
    stops: stops.map(([offset, color]) => ({ offset, color })),
  };
}

export const THEMES: Theme[] = [
  {
    name: "Islamic Emerald",
    background: linearGradient(
      180,
      [0, "#0a1a0f"],
      [0.4, "#0d2818"],
      [1, "#1a4a2e"]
    ),
    tableBackground: "rgba(5, 20, 10, 0.85)",
    textColor: "#e8dcc8",
    headerColor: "#c9a84c",
    headerTextColor: "#1a0e00",
    highlightColor: "rgba(201, 168, 76, 0.25)",
    highlightTextColor: "#f5e6b8",
    accentColor: "#c9a84c",
    gridColor: "rgba(201, 168, 76, 0.15)",
  },
  {
    name: "Islamic Ivory",
    background: linearGradient(
      180,
      [0, "#f5f0e1"],
      [0.5, "#ebe4d0"],
      [1, "#ddd5bc"]
    ),
    tableBackground: "rgba(255, 252, 245, 0.9)",
    textColor: "#2d3a2e",
    headerColor: "#2d6b45",
    headerTextColor: "#f0ebe0",
    highlightColor: "rgba(45, 107, 69, 0.15)",
    highlightTextColor: "#1a4a2e",
    accentColor: "#2d6b45",
    gridColor: "rgba(45, 107, 69, 0.12)",
  },
  {
    name: "Midnight Sapphire",
    background: linearGradient(
      135,
      [0, "#0a0e27"],
      [0.5, "#101845"],
      [1, "#1a2980"]
    ),
    tableBackground: "rgba(8, 12, 35, 0.88)",
    textColor: "#c8d6e5",
    headerColor: "#4a90d9",
    headerTextColor: "#ffffff",
    highlightColor: "rgba(74, 144, 217, 0.2)",
    highlightTextColor: "#a8d0ff",
    accentColor: "#5ba3ec",
    gridColor: "rgba(74, 144, 217, 0.12)",
  },
  {
    name: "Purple Dusk",
    background: linearGradient(
      160,
      [0, "#1a0a2e"],
      [0.5, "#2d1b54"],
      [1, "#4a2c7a"]
    ),
    tableBackground: "rgba(15, 5, 30, 0.88)",
    textColor: "#d4c5f0",
    headerColor: "#b388ff",
    headerTextColor: "#1a0a2e",
    highlightColor: "rgba(179, 136, 255, 0.2)",
    highlightTextColor: "#d4b8ff",
    accentColor: "#b388ff",
    gridColor: "rgba(179, 136, 255, 0.1)",
  },
  {
    name: "Ocean Depths",
    background: linearGradient(
      170,
      [0, "#0a1628"],
      [0.4, "#0d2137"],
      [1, "#134e5e"]
    ),
    tableBackground: "rgba(8, 18, 32, 0.88)",
    textColor: "#b8d8e8",
    headerColor: "#48b1bf",
    headerTextColor: "#0a1628",
    highlightColor: "rgba(72, 177, 191, 0.18)",
    highlightTextColor: "#80e0ec",
    accentColor: "#48b1bf",
    gridColor: "rgba(72, 177, 191, 0.1)",
  },
  {
    name: "Warm Sunset",
    background: linearGradient(
      170,
      [0, "#1a0a0a"],
      [0.4, "#3d1a1a"],
      [1, "#6b2d2d"]
    ),
    tableBackground: "rgba(15, 5, 5, 0.88)",
    textColor: "#f0d0c0",
    headerColor: "#e8845a",
    headerTextColor: "#1a0a0a",
    highlightColor: "rgba(232, 132, 90, 0.2)",
    highlightTextColor: "#ffb088",
    accentColor: "#e8845a",
    gridColor: "rgba(232, 132, 90, 0.1)",
  },
  {
    name: "Charcoal Minimal",
    background: linearGradient(
      180,
      [0, "#1a1a1a"],
      [0.5, "#222222"],
      [1, "#2a2a2a"]
    ),
    tableBackground: "rgba(18, 18, 18, 0.92)",
    textColor: "#e0e0e0",
    headerColor: "#404040",
    headerTextColor: "#ffffff",
    highlightColor: "rgba(255, 255, 255, 0.08)",
    highlightTextColor: "#ffffff",
    accentColor: "#888888",
    gridColor: "rgba(255, 255, 255, 0.06)",
  },
  {
    name: "Royal Navy",
    background: linearGradient(
      150,
      [0, "#0a0f1e"],
      [0.5, "#141e3d"],
      [1, "#1e2d5c"]
    ),
    tableBackground: "rgba(8, 12, 25, 0.9)",
    textColor: "#c8d0e8",
    headerColor: "#d4af37",
    headerTextColor: "#0a0f1e",
    highlightColor: "rgba(212, 175, 55, 0.15)",
    highlightTextColor: "#f0d875",
    accentColor: "#d4af37",
    gridColor: "rgba(212, 175, 55, 0.1)",
  },
  {
    name: "Rose Gold",
    background: linearGradient(
      165,
      [0, "#1a0f14"],
      [0.5, "#2d1a22"],
      [1, "#4a2d3a"]
    ),
    tableBackground: "rgba(18, 10, 14, 0.88)",
    textColor: "#f0d0d8",
    headerColor: "#e8a0b0",
    headerTextColor: "#1a0f14",
    highlightColor: "rgba(232, 160, 176, 0.18)",
    highlightTextColor: "#ffc0d0",
    accentColor: "#e8a0b0",
    gridColor: "rgba(232, 160, 176, 0.1)",
  },
  {
    name: "Forest Night",
    background: linearGradient(
      175,
      [0, "#0a1410"],
      [0.4, "#122218"],
      [1, "#1a3520"]
    ),
    tableBackground: "rgba(6, 14, 10, 0.9)",
    textColor: "#b8d8c0",
    headerColor: "#5cb85c",
    headerTextColor: "#0a1410",
    highlightColor: "rgba(92, 184, 92, 0.18)",
    highlightTextColor: "#80e880",
    accentColor: "#5cb85c",
    gridColor: "rgba(92, 184, 92, 0.1)",
  },
];

// Slightly shift a hex color's hue/saturation/lightness
function hslShift(
  hex: string,
  hShift: number,
  sShift: number,
  lShift: number
): string {
  // Handle rgba format
  if (hex.startsWith("rgba")) return hex;

  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }

  const newH = ((h + hShift / 360 + 1) % 1);
  const newS = Math.max(0, Math.min(1, s + sShift));
  const newL = Math.max(0, Math.min(1, l + lShift));

  // HSL to RGB
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let nr, ng, nb;
  if (newS === 0) {
    nr = ng = nb = newL;
  } else {
    const q = newL < 0.5 ? newL * (1 + newS) : newL + newS - newL * newS;
    const p = 2 * newL - q;
    nr = hue2rgb(p, q, newH + 1 / 3);
    ng = hue2rgb(p, q, newH);
    nb = hue2rgb(p, q, newH - 1 / 3);
  }

  const toHex = (c: number) =>
    Math.round(c * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(nr)}${toHex(ng)}${toHex(nb)}`;
}

function shiftGradient(
  grad: CanvasGradientConfig,
  hShift: number,
  sShift: number,
  lShift: number
): CanvasGradientConfig {
  return {
    ...grad,
    stops: grad.stops.map((s) => ({
      offset: s.offset,
      color: hslShift(s.color, hShift, sShift, lShift),
    })),
  };
}

export function shuffleTheme(): Theme {
  const base = THEMES[Math.floor(Math.random() * THEMES.length)];
  const hShift = (Math.random() - 0.5) * 40; // +-20 degrees
  const sShift = (Math.random() - 0.5) * 0.1;
  const lShift = (Math.random() - 0.5) * 0.06;

  const bg =
    typeof base.background === "string"
      ? hslShift(base.background, hShift, sShift, lShift)
      : shiftGradient(base.background, hShift, sShift, lShift);

  return {
    ...base,
    name: `${base.name} (Shuffled)`,
    background: bg,
    headerColor: hslShift(base.headerColor, hShift, sShift, 0),
    accentColor: hslShift(base.accentColor, hShift, sShift, 0),
    highlightColor: base.highlightColor, // keep alpha-based colors as-is
    gridColor: base.gridColor,
  };
}
