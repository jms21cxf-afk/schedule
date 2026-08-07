// Schedule → 폼 초기값 변환
import type { Schedule, ScheduleFormData } from '../types/schedule';
import { COLOR_OPTIONS } from '../types/schedule';
import type { ScheduleIconType } from '../types/scheduleIcon';
import type { RepeatConfig } from '../types/repeat';
import { formatDateKey, parseScheduleDate } from './dateUtils';

function mapRepeatConfig(config?: Schedule['repeatConfig']): RepeatConfig | undefined {
  if (!config) return undefined;

  return {
    interval: config.interval ?? 1,
    weekdays: config.weekdays ?? [],
    monthOrdinal: config.monthOrdinal,
    monthWeekday: config.monthWeekday,
    monthlyMode: config.monthlyMode,
    monthDay: config.monthDay,
    yearlyMode: config.yearlyMode,
    yearMonth: config.yearMonth,
    yearDay: config.yearDay,
    yearOrdinal: config.yearOrdinal,
    yearWeekday: config.yearWeekday,
    endType: config.endType ?? 'never',
    endDate:
      config.endType === 'date' && config.endDate
        ? String(config.endDate).slice(0, 10)
        : undefined,
  };
}

export function scheduleToFormData(schedule: Schedule): ScheduleFormData {
  const repeat = schedule.repeat ?? 'none';

  return {
    title: schedule.title,
    repeat,
    repeatConfig: mapRepeatConfig(schedule.repeatConfig),
    color: schedule.color ?? COLOR_OPTIONS[0],
    icon: (schedule.icon ?? 'none') as ScheduleIconType,
  };
}

/** 수정 API용 — 반복 일정은 DB 시작일(anchor) 유지 */
export function getScheduleAnchorKey(schedule: Schedule): string {
  const source = schedule.anchorDate ?? schedule.date;
  return formatDateKey(parseScheduleDate(source));
}
