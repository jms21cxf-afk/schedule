// 캘린더 월 이동 헤더 — ◀ 2026.7 ▶
import { formatMonthLabel } from '../utils/dateUtils';
import './CalendarHeader.css';

interface CalendarHeaderProps {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}

/** 가로로 긴 채워진 삼각형 — 꼭짓점만 Q 곡선으로 부드럽게 */
function NavArrow({ direction }: { direction: 'prev' | 'next' }) {
  const path =
    direction === 'prev'
      ? 'M22 4 L22 20 L9 13.1 Q 1 12 9 10.9 Z'
      : 'M2 4 L2 20 L15 13.1 Q 23 12 15 10.9 Z';

  return (
    <svg
      className="nav-arrow"
      viewBox="0 0 24 24"
      width="20"
      height="11"
      aria-hidden="true"
    >
      <path d={path} fill="currentColor" />
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
        <NavArrow direction="prev" />
      </button>
      <span className="month-label">{formatMonthLabel(year, month)}</span>
      <button type="button" className="nav-btn" onClick={onNext} aria-label="다음 달">
        <NavArrow direction="next" />
      </button>
    </div>
  );
}
