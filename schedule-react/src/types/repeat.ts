// 반복 상세 설정 타입 — interval·요일·종료일
import type { RepeatType } from './schedule';

export type RepeatEndType = 'never' | 'date';

/** 매년 — 날짜(8월 1일) vs n번째 요일(8월 1번째 토요일) */
export type YearlyMode = 'date' | 'nthWeekday';

/** 매월 — 고정 일(26일) vs n번째 요일(4번째 수요일) */
export type MonthlyMode = 'date' | 'nthWeekday';

export interface RepeatConfig {
  interval: number;
  /** 0=일 … 6=토 (Date.getDay) — 매주 */
  weekdays: number[];
  /** 매월 — 반복 방식 */
  monthlyMode?: MonthlyMode;
  /** 매월 — 일 (1~31) */
  monthDay?: number;
  /** 매월 — 해당 월 n번째 (1~5) */
  monthOrdinal?: number;
  /** 매월 — 요일 0=일 … 6=토 */
  monthWeekday?: number;
  /** 매년 — 반복 방식 */
  yearlyMode?: YearlyMode;
  /** 매년 — 월 (1~12) */
  yearMonth?: number;
  /** 매년 — 일 (1~31) */
  yearDay?: number;
  /** 매년 — n번째 (1~5) */
  yearOrdinal?: number;
  /** 매년 — 요일 0=일 … 6=토 */
  yearWeekday?: number;
  endType: RepeatEndType;
  endDate?: string;
}

export const WEEKDAY_OPTIONS = [
  { value: 1, label: '월' },
  { value: 2, label: '화' },
  { value: 3, label: '수' },
  { value: 4, label: '목' },
  { value: 5, label: '금' },
  { value: 6, label: '토' },
  { value: 0, label: '일' },
] as const;

const WEEKDAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'] as const;

/** 선택 날짜가 그 달에서 몇 번째 해당 요일인지 */
export function getMonthWeekdayFromDate(date: Date): {
  ordinal: number;
  weekday: number;
} {
  const weekday = date.getDay();
  const dayOfMonth = date.getDate();
  let ordinal = 0;

  for (let d = 1; d <= dayOfMonth; d++) {
    if (new Date(date.getFullYear(), date.getMonth(), d).getDay() === weekday) {
      ordinal++;
    }
  }

  return { ordinal, weekday };
}

/** 매월 반복 라벨 — 예: 1번째 금요일 */
export function formatMonthWeekdayLabel(
  ordinal: number,
  weekday: number
): string {
  const name = WEEKDAY_NAMES[weekday] ?? '?';
  return `${ordinal}번째 ${name}요일`;
}

/** 매월 고정 일 라벨 — 예: 26일 */
export function formatMonthDateLabel(day: number): string {
  return `${day}일`;
}

/** 매년 날짜 라벨 — 예: 8월 1일 */
export function formatYearDateLabel(month: number, day: number): string {
  return `${month}월 ${day}일`;
}

/** 매년 n번째 요일 라벨 — 예: 8월 1번째 토요일 */
export function formatYearNthWeekdayLabel(
  month: number,
  ordinal: number,
  weekday: number
): string {
  const name = WEEKDAY_NAMES[weekday] ?? '?';
  return `${month}월 ${ordinal}번째 ${name}요일`;
}

/** 선택 날짜 → 매년 옵션 값 */
export function getYearlyFromDate(date: Date) {
  const { ordinal, weekday } = getMonthWeekdayFromDate(date);
  return {
    yearMonth: date.getMonth() + 1,
    yearDay: date.getDate(),
    yearOrdinal: ordinal,
    yearWeekday: weekday,
  };
}

/** 달력 날짜 변경 시 반복 상세 동기화 */
export function syncRepeatConfigWithAnchorDate(
  config: RepeatConfig,
  anchorDate: Date,
  repeat: RepeatType
): RepeatConfig {
  const { ordinal, weekday } = getMonthWeekdayFromDate(anchorDate);
  const yearly = getYearlyFromDate(anchorDate);

  if (repeat === 'weekly') {
    return { ...config, weekdays: [anchorDate.getDay()] };
  }
  if (repeat === 'monthly') {
    return {
      ...config,
      monthDay: anchorDate.getDate(),
      monthOrdinal: ordinal,
      monthWeekday: weekday,
    };
  }
  if (repeat === 'yearly') {
    return { ...config, ...yearly };
  }
  return config;
}

export function createDefaultRepeatConfig(
  anchorDate: Date,
  repeat: RepeatType
): RepeatConfig {
  const { ordinal, weekday } = getMonthWeekdayFromDate(anchorDate);
  const yearly = getYearlyFromDate(anchorDate);

  return {
    interval: 1,
    weekdays: repeat === 'weekly' ? [anchorDate.getDay()] : [],
    monthlyMode: repeat === 'monthly' ? 'date' : undefined,
    monthDay: repeat === 'monthly' ? anchorDate.getDate() : undefined,
    monthOrdinal: repeat === 'monthly' ? ordinal : undefined,
    monthWeekday: repeat === 'monthly' ? weekday : undefined,
    yearlyMode: repeat === 'yearly' ? 'date' : undefined,
    yearMonth: repeat === 'yearly' ? yearly.yearMonth : undefined,
    yearDay: repeat === 'yearly' ? yearly.yearDay : undefined,
    yearOrdinal: repeat === 'yearly' ? yearly.yearOrdinal : undefined,
    yearWeekday: repeat === 'yearly' ? yearly.yearWeekday : undefined,
    endType: 'never',
  };
}

export function normalizeRepeatConfig(
  config: Partial<RepeatConfig> | undefined,
  anchorDate: Date,
  repeat: RepeatType
): RepeatConfig {
  const base = createDefaultRepeatConfig(anchorDate, repeat);

  if (!config) return base;

  const interval = Math.min(99, Math.max(1, Number(config.interval) || 1));
  const weekdays =
    repeat === 'weekly' && Array.isArray(config.weekdays) && config.weekdays.length > 0
      ? config.weekdays.filter((d) => d >= 0 && d <= 6)
      : repeat === 'weekly'
        ? base.weekdays
        : [];

  let monthlyFields = {};
  if (repeat === 'monthly') {
    monthlyFields = {
      monthlyMode:
        config.monthlyMode === 'date' ? 'date' : ('nthWeekday' as const),
      monthDay: Math.min(
        31,
        Math.max(1, Number(config.monthDay) || base.monthDay || anchorDate.getDate())
      ),
      monthOrdinal: Math.min(
        5,
        Math.max(1, Number(config.monthOrdinal) || base.monthOrdinal || 1)
      ),
      monthWeekday: config.monthWeekday ?? base.monthWeekday,
    };
  }

  let yearlyFields = {};
  if (repeat === 'yearly') {
    const y = getYearlyFromDate(anchorDate);
    yearlyFields = {
      yearlyMode:
        config.yearlyMode === 'nthWeekday' ? 'nthWeekday' : ('date' as const),
      yearMonth: config.yearMonth ?? y.yearMonth,
      yearDay: config.yearDay ?? y.yearDay,
      yearOrdinal: Math.min(
        5,
        Math.max(1, Number(config.yearOrdinal) || y.yearOrdinal)
      ),
      yearWeekday: config.yearWeekday ?? y.yearWeekday,
    };
  }

  return {
    interval,
    weekdays,
    ...monthlyFields,
    ...yearlyFields,
    endType: config.endType === 'date' ? 'date' : 'never',
    endDate: config.endType === 'date' ? config.endDate : undefined,
  };
}
