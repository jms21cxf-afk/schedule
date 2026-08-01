// 캘린더·날짜 포맷 유틸
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

export { WEEKDAYS };

/** YYYY-MM-DD 문자열 생성 */
export function toDateString(year: number, month: number, day: number): string {
  const m = String(month).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

/** Date → YYYY-MM-DD */
export function formatDateKey(date: Date): string {
  return toDateString(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

/** 선택 날짜 헤더 — 예: 7.21.화 */
export function formatSelectedLabel(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAYS[date.getDay()];
  return `${month}.${day}.${weekday}`;
}

/** 월 헤더 — 예: 2026.7 */
export function formatMonthLabel(year: number, month: number): string {
  return `${year}.${month}`;
}

/** 캘린더 그리드 셀 (빈 칸 + 날짜) */
export function buildCalendarCells(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = Array(firstDay).fill(null);

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }

  return cells;
}

/** 두 Date가 같은 날인지 비교 */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** 선택한 날짜가 속한 주(행) 인덱스 */
export function getWeekRowIndex(
  cells: (number | null)[],
  day: number
): number {
  const dayIndex = cells.findIndex((cell) => cell === day);
  if (dayIndex < 0) return 0;
  return Math.floor(dayIndex / 7);
}

/** ISO 날짜 문자열을 로컬 Date로 변환 */
export function parseScheduleDate(iso: string): Date {
  const parsed = new Date(iso);
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}
