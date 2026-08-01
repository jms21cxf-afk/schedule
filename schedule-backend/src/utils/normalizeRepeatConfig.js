// 반복 상세 설정 정규화 — API 저장 전 검증
import { normalizeDate } from './normalizeDate.js';

export function normalizeRepeatConfig(repeat, raw) {
  if (repeat === 'none' || !raw) return undefined;

  const interval = Math.min(99, Math.max(1, Number(raw.interval) || 1));
  const weekdays = Array.isArray(raw.weekdays)
    ? raw.weekdays.filter((d) => Number.isInteger(d) && d >= 0 && d <= 6)
    : [];

  const endType = raw.endType === 'date' ? 'date' : 'never';
  let endDate = null;

  if (endType === 'date' && raw.endDate) {
    endDate = normalizeDate(raw.endDate);
  }

  const result = {
    interval,
    weekdays: repeat === 'weekly' ? weekdays : [],
    endType,
    endDate,
  };

  if (repeat === 'monthly') {
    const monthOrdinal = Math.min(
      5,
      Math.max(1, Number(raw.monthOrdinal) || 1)
    );
    const monthWeekday =
      raw.monthWeekday !== undefined && raw.monthWeekday !== null
        ? Math.min(6, Math.max(0, Number(raw.monthWeekday)))
        : 0;
    result.monthOrdinal = monthOrdinal;
    result.monthWeekday = monthWeekday;
  }

  if (repeat === 'yearly') {
    result.yearlyMode =
      raw.yearlyMode === 'nthWeekday' ? 'nthWeekday' : 'date';
    result.yearMonth = Math.min(
      12,
      Math.max(1, Number(raw.yearMonth) || 1)
    );
    result.yearDay = Math.min(31, Math.max(1, Number(raw.yearDay) || 1));
    result.yearOrdinal = Math.min(
      5,
      Math.max(1, Number(raw.yearOrdinal) || 1)
    );
    result.yearWeekday =
      raw.yearWeekday !== undefined && raw.yearWeekday !== null
        ? Math.min(6, Math.max(0, Number(raw.yearWeekday)))
        : 0;
  }

  return result;
}
