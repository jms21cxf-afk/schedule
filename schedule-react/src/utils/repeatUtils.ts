// 반복 설정 요약 문구 — 폼 행 표시용
import type { RepeatType } from '../types/schedule';
import {
  WEEKDAY_OPTIONS,
  formatMonthWeekdayLabel,
  formatYearDateLabel,
  formatYearNthWeekdayLabel,
  type RepeatConfig,
} from '../types/repeat';
import { REPEAT_OPTIONS } from '../types/schedule';

const INTERVAL_UNIT: Record<Exclude<RepeatType, 'none'>, string> = {
  daily: '일',
  weekly: '주',
  monthly: '개월',
  yearly: '년',
};

/** 반복 행 우측 요약 (예: 매주 · 1주 · 월·수) */
export function formatRepeatSummary(
  repeat: RepeatType,
  config?: RepeatConfig
): string {
  const base =
    REPEAT_OPTIONS.find((opt) => opt.value === repeat)?.label ?? '없음';

  if (repeat === 'none' || !config) return base;

  const unit = INTERVAL_UNIT[repeat];
  const intervalPart = `${config.interval}${unit}`;

  if (repeat === 'weekly' && config.weekdays.length > 0) {
    const dayLabels = WEEKDAY_OPTIONS.filter((d) =>
      config.weekdays.includes(d.value)
    )
      .map((d) => d.label)
      .join('·');
    return `${base} · ${intervalPart} · ${dayLabels}`;
  }

  if (
    repeat === 'monthly' &&
    config.monthOrdinal &&
    config.monthWeekday !== undefined
  ) {
    const monthPart = formatMonthWeekdayLabel(
      config.monthOrdinal,
      config.monthWeekday
    );
    return `${base} · ${intervalPart} · ${monthPart}`;
  }

  if (repeat === 'yearly' && config.yearMonth) {
    const yearlyPart =
      config.yearlyMode === 'nthWeekday' &&
      config.yearOrdinal &&
      config.yearWeekday !== undefined
        ? formatYearNthWeekdayLabel(
            config.yearMonth,
            config.yearOrdinal,
            config.yearWeekday
          )
        : formatYearDateLabel(config.yearMonth, config.yearDay ?? 1);
    return `${base} · ${intervalPart} · ${yearlyPart}`;
  }

  if (config.endType === 'date' && config.endDate) {
    return `${base} · ${intervalPart} · ~${config.endDate}`;
  }

  return `${base} · ${intervalPart}`;
}
