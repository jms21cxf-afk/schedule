// 캘린더 월 이동 헤더 — < 2026.7 >
import { formatMonthLabel } from '../utils/dateUtils';
import './CalendarHeader.css';

interface CalendarHeaderProps {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}

/** 꺾인괄호(chevron) — 이전/다음 달 */
function NavChevron({ direction }: { direction: 'prev' | 'next' }) {
  const path =
    direction === 'prev'
      ? 'M16 5 L8 12 L16 19'
      : 'M8 5 L16 12 L8 19';

  return (
    <svg
      className="nav-chevron"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CalendarHeader({
  year,
  month,
  onPrev,
  onNext,
}: CalendarHeaderProps) {
  return (
    <div className="calendar-header">
      <button type="button" className="nav-btn" onClick={onPrev} aria-label="이전 달">
        <NavChevron direction="prev" />
      </button>
      <span className="month-label">{formatMonthLabel(year, month)}</span>
      <button type="button" className="nav-btn" onClick={onNext} aria-label="다음 달">
        <NavChevron direction="next" />
      </button>
    </div>
  );
}
