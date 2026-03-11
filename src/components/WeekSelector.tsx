import { formatShortDate, getWeekStart, isSameDay } from "../lib/utils";

interface Props {
  weekStart: Date;
  weekEnd: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export default function WeekSelector({
  weekStart,
  weekEnd,
  onPrev,
  onNext,
  onToday,
}: Props) {
  const todayWeekStart = getWeekStart(new Date());
  const isCurrentWeek = isSameDay(weekStart, todayWeekStart);

  return (
    <div className="week-selector">
      <button className="week-btn" onClick={onPrev} title="Previous week">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className="week-info">
        <span className="week-range">
          {formatShortDate(weekStart)} — {formatShortDate(weekEnd)}
        </span>
        {!isCurrentWeek && (
          <button className="today-btn" onClick={onToday}>
            Go to current week
          </button>
        )}
      </div>

      <button className="week-btn" onClick={onNext} title="Next week">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
