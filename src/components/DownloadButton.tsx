import { downloadCanvas } from "../lib/canvas";
import { formatShortDate } from "../lib/utils";
import type { WeekData } from "../lib/types";

interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  week: WeekData | null;
}

export default function DownloadButton({ canvasRef, week }: Props) {
  const handleDownload = () => {
    if (!canvasRef.current || !week) return;
    const startStr = formatShortDate(week.startDate).replace(" ", "-");
    const endStr = formatShortDate(week.endDate).replace(" ", "-");
    downloadCanvas(canvasRef.current, `prayer-times-${startStr}-to-${endStr}.png`);
  };

  return (
    <button
      className="download-btn"
      onClick={handleDownload}
      disabled={!week || week.days.length === 0}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Download Wallpaper
    </button>
  );
}
