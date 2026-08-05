// 캘린더 월 이동 헤더 — ‹ 2026.7 ›
import { formatMonthLabel } from '../utils/dateUtils';
import './CalendarHeader.css';

interface CalendarHeaderProps {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}

/** 꺾인 괄호(chevron) — 이전·다음 달 */
function NavChevron({ direction }: { direction: 'prev' | 'next' }) {
  return (
    <svg
      className="nav-chevron"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <path
        d={direction === 'prev' ? 'M15 6 L9 12 L15 18' : 'M9 6 L15 12 L9 18'}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
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
