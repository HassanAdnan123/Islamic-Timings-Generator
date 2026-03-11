import type { Theme, CanvasGradientConfig, WeekData } from "./types";
import { parseDate, isSameDay, formatShortDate } from "./utils";

const W = 1080;
const H = 1920;
const FONT = "Inter, system-ui, sans-serif";

function createGradient(
  ctx: CanvasRenderingContext2D,
  config: CanvasGradientConfig
): CanvasGradient {
  const angleRad = (config.angle * Math.PI) / 180;
  const cx = W / 2;
  const cy = H / 2;
  const len = Math.max(W, H);
  const x1 = cx - Math.sin(angleRad) * len;
  const y1 = cy - Math.cos(angleRad) * len;
  const x2 = cx + Math.sin(angleRad) * len;
  const y2 = cy + Math.cos(angleRad) * len;

  const grad = ctx.createLinearGradient(x1, y1, x2, y2);
  config.stops.forEach((s) => grad.addColorStop(s.offset, s.color));
  return grad;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export interface RenderOptions {
  highlightToday?: boolean;
  use24hr?: boolean;
}

function formatTimeTo12hr(time: string): string {
  const [hStr, mStr] = time.split(":");
  let h = parseInt(hStr, 10);
  h = h % 12 || 12;
  return `${h}:${mStr}`;
}

export function renderWallpaper(
  canvas: HTMLCanvasElement,
  week: WeekData,
  theme: Theme,
  options: RenderOptions = {}
) {
  const { highlightToday = false, use24hr = true } = options;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // === BACKGROUND ===
  if (typeof theme.background === "string") {
    ctx.fillStyle = theme.background;
  } else {
    ctx.fillStyle = createGradient(ctx, theme.background);
  }
  ctx.fillRect(0, 0, W, H);

  // === Subtle decorative elements in upper area ===
  drawDecoration(ctx, theme);

  // === TABLE in lower half ===
  const dayCount = week.days.length;
  const tableMargin = 40;
  const tableX = tableMargin;
  const tableW = W - tableMargin * 2;
  const headerHeight = 56;
  const rowHeight = 68;
  const tableH = headerHeight + rowHeight * dayCount + 20;
  const tableY = H - tableH - 80;

  // Table background with rounded corners
  ctx.save();
  roundRect(ctx, tableX, tableY, tableW, tableH, 20);
  ctx.fillStyle = theme.tableBackground;
  ctx.fill();
  ctx.restore();

  // Column widths
  const cols = [
    { label: "Day", width: 145 },
    { label: "Fajr", width: 120 },
    { label: "Rise", width: 120 },
    { label: "Dhuhr", width: 125 },
    { label: "Asr", width: 120 },
    { label: "Mgrb", width: 120 },
    { label: "Isha", width: 120 },
  ];

  // Adjust widths to fit
  const totalColW = cols.reduce((s, c) => s + c.width, 0);
  const scale = (tableW - 60) / totalColW; // 60 for inner padding
  cols.forEach((c) => (c.width = Math.floor(c.width * scale)));

  const innerX = tableX + 30;
  const innerY = tableY + 14;

  // === HEADER ROW ===
  ctx.save();
  roundRect(ctx, innerX - 10, innerY, tableW - 40, headerHeight, 12);
  ctx.fillStyle = theme.headerColor;
  ctx.fill();
  ctx.restore();

  const headerFontSize = 26;
  const dayFontSize = 24;
  const timeFontSize = 26;

  ctx.font = `600 ${headerFontSize}px ${FONT}`;
  ctx.fillStyle = theme.headerTextColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  let colX = innerX;
  cols.forEach((col) => {
    ctx.fillText(col.label, colX + col.width / 2, innerY + headerHeight / 2);
    colX += col.width;
  });

  // === AM/PM group labels & separator (12hr mode) ===
  if (!use24hr) {
    // Vertical separator line between Rise and Dhuhr columns
    const sepX = innerX + cols[0].width + cols[1].width + cols[2].width;
    ctx.save();
    ctx.strokeStyle = theme.accentColor;
    ctx.globalAlpha = 0.25;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(sepX, innerY + headerHeight + 12);
    ctx.lineTo(sepX, innerY + headerHeight + 8 + rowHeight * dayCount - 4);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // AM label above Fajr-Rise group
    const amCenterX = innerX + cols[0].width + (cols[1].width + cols[2].width) / 2;
    ctx.save();
    ctx.font = `700 16px ${FONT}`;
    ctx.fillStyle = theme.accentColor;
    ctx.globalAlpha = 0.5;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("AM", amCenterX, innerY - 4);
    ctx.restore();

    // PM label above Dhuhr-Isha group
    const pmCenterX = sepX + (cols[3].width + cols[4].width + cols[5].width + cols[6].width) / 2;
    ctx.save();
    ctx.font = `700 16px ${FONT}`;
    ctx.fillStyle = theme.accentColor;
    ctx.globalAlpha = 0.5;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("PM", pmCenterX, innerY - 4);
    ctx.restore();
  }

  // === DATA ROWS ===
  const today = new Date();
  const dataY = innerY + headerHeight + 8;
  const fmt = (t: string) => use24hr ? t : formatTimeTo12hr(t);

  week.days.forEach((day, i) => {
    const rowY = dataY + i * rowHeight;
    const dayDate = parseDate(day.date);
    const isToday = highlightToday && isSameDay(dayDate, today);

    // Alternating row background (disabled when highlight today is on)
    if (!highlightToday && i % 2 === 1) {
      ctx.save();
      roundRect(ctx, innerX - 10, rowY, tableW - 40, rowHeight - 4, 10);
      ctx.fillStyle = theme.gridColor;
      ctx.fill();
      ctx.restore();
    }

    // Highlight current day (when enabled)
    if (isToday) {
      ctx.save();
      roundRect(ctx, innerX - 10, rowY, tableW - 40, rowHeight - 4, 10);
      ctx.fillStyle = theme.highlightColor;
      ctx.fill();

      // Accent bar on left
      roundRect(ctx, innerX - 10, rowY + 2, 4, rowHeight - 8, 2);
      ctx.fillStyle = theme.accentColor;
      ctx.fill();
      ctx.restore();
    }

    ctx.fillStyle = isToday ? theme.highlightTextColor : theme.textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const textY = rowY + (rowHeight - 4) / 2;

    // Day + Date column
    colX = innerX;
    ctx.font = isToday ? `700 ${dayFontSize}px ${FONT}` : `500 ${dayFontSize}px ${FONT}`;
    const dayLabel = `${day.day} ${formatShortDate(dayDate)}`;
    ctx.fillText(dayLabel, colX + cols[0].width / 2, textY);

    // Prayer times
    ctx.font = isToday ? `600 ${timeFontSize}px ${FONT}` : `400 ${timeFontSize}px ${FONT}`;
    const times = [
      fmt(day.fajr),
      fmt(day.sunrise),
      fmt(day.dhuhr),
      fmt(day.asr),
      fmt(day.maghrib),
      fmt(day.isha),
    ];

    colX = innerX + cols[0].width;
    times.forEach((time, ti) => {
      ctx.fillText(time, colX + cols[ti + 1].width / 2, textY);
      colX += cols[ti + 1].width;
    });
  });

  // === Week label above table ===
  const weekStartStr = formatShortDate(week.startDate);
  const weekEndStr = formatShortDate(week.endDate);
  ctx.font = `500 28px ${FONT}`;
  ctx.fillStyle = theme.accentColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText(
    `${weekStartStr} - ${weekEndStr}`,
    W / 2,
    tableY - 16
  );
}

function drawDecoration(ctx: CanvasRenderingContext2D, theme: Theme) {
  ctx.save();
  const color = theme.accentColor;

  // === CRESCENT MOON + STAR icon (top center) ===
  ctx.globalAlpha = 0.07;
  ctx.fillStyle = color;
  ctx.font = "220px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("\u262A", W / 2, H * 0.18);

  // === STARS scattered ===
  ctx.globalAlpha = 0.06;
  const stars = [
    { x: 160, y: 120, s: 14 },
    { x: 920, y: 100, s: 12 },
    { x: 780, y: 200, s: 10 },
    { x: 120, y: 320, s: 8 },
    { x: 960, y: 350, s: 11 },
    { x: 300, y: 180, s: 9 },
    { x: 700, y: 130, s: 13 },
    { x: 480, y: 80, s: 7 },
    { x: 850, y: 450, s: 9 },
    { x: 200, y: 500, s: 10 },
    { x: 540, y: 380, s: 6 },
    { x: 400, y: 280, s: 8 },
  ];
  stars.forEach(({ x, y, s }) => drawStar(ctx, x, y, s, color));

  // === HANGING LANTERNS (ornate, solid fill, bigger) ===
  ctx.globalAlpha = 0.05;
  drawLantern(ctx, W * 0.22, 40, 1.1, color);
  ctx.globalAlpha = 0.05;
  drawLantern(ctx, W * 0.78, 25, 0.9, color);
  ctx.globalAlpha = 0.04;
  drawLantern(ctx, W * 0.5, 5, 0.7, color);

  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const r = i % 2 === 0 ? size : size * 0.4;
    const x = cx + Math.cos(angle - Math.PI / 2) * r;
    const y = cy + Math.sin(angle - Math.PI / 2) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawLantern(
  ctx: CanvasRenderingContext2D,
  cx: number,
  topY: number,
  scale: number,
  color: string
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  const s = scale;

  // Chain
  ctx.beginPath();
  ctx.moveTo(cx, topY);
  ctx.lineTo(cx, topY + 100 * s);
  ctx.lineWidth = 1.5 * s;
  ctx.stroke();

  const lampTop = topY + 100 * s;

  // Top cap
  ctx.beginPath();
  ctx.moveTo(cx - 14 * s, lampTop);
  ctx.lineTo(cx + 14 * s, lampTop);
  ctx.lineTo(cx + 10 * s, lampTop + 10 * s);
  ctx.lineTo(cx - 10 * s, lampTop + 10 * s);
  ctx.closePath();
  ctx.fill();

  // Lamp body (ornate solid shape — no cutouts)
  ctx.beginPath();
  ctx.moveTo(cx - 10 * s, lampTop + 10 * s);
  ctx.quadraticCurveTo(cx - 32 * s, lampTop + 40 * s, cx - 26 * s, lampTop + 70 * s);
  ctx.quadraticCurveTo(cx - 18 * s, lampTop + 88 * s, cx - 24 * s, lampTop + 105 * s);
  ctx.quadraticCurveTo(cx - 28 * s, lampTop + 128 * s, cx, lampTop + 140 * s);
  ctx.quadraticCurveTo(cx + 28 * s, lampTop + 128 * s, cx + 24 * s, lampTop + 105 * s);
  ctx.quadraticCurveTo(cx + 18 * s, lampTop + 88 * s, cx + 26 * s, lampTop + 70 * s);
  ctx.quadraticCurveTo(cx + 32 * s, lampTop + 40 * s, cx + 10 * s, lampTop + 10 * s);
  ctx.closePath();
  ctx.fill();

  // Small dot at bottom
  ctx.beginPath();
  ctx.arc(cx, lampTop + 148 * s, 4 * s, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
