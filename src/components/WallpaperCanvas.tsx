import { useRef, useEffect } from "react";
import type { Theme, WeekData } from "../lib/types";
import { renderWallpaper, type RenderOptions } from "../lib/canvas";

interface Props {
  week: WeekData | null;
  theme: Theme;
  options: RenderOptions;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export default function WallpaperCanvas({ week, theme, options, canvasRef }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !week || week.days.length === 0) return;
    renderWallpaper(canvasRef.current, week, theme, options);
  }, [week, theme, options, canvasRef]);

  return (
    <div ref={containerRef} className="canvas-container">
      <canvas
        ref={canvasRef}
        className="wallpaper-canvas"
      />
    </div>
  );
}
