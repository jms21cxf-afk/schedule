// 반복 일정 → 해당 월 occurrence 목록으로 펼치기
import { normalizeDate } from '../utils/normalizeDate.js';

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function daysBetween(from, to) {
  return Math.round((startOfDay(to) - startOfDay(from)) / 86400000);
}

function monthsBetween(from, to) {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
}

function yearsBetween(from, to) {
  return to.getFullYear() - from.getFullYear();
}

/** 해당 월 n번째 weekday 날짜 (없으면 null) */
function getNthWeekdayOfMonth(year, monthIndex, ordinal, weekday) {
  let count = 0;
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();

  for (let day = 1; day <= lastDay; day++) {
    const candidate = new Date(year, monthIndex, day);
    if (candidate.getDay() === weekday) {
      count++;
      if (count === ordinal) return candidate;
    }
  }

  return null;
}

function getRepeatEndDate(repeatConfig) {
  if (repeatConfig?.endType !== 'date' || !repeatConfig.endDate) return null;
  return normalizeDate(repeatConfig.endDate);
}

function isWithinEnd(occurrence, endDate) {
  if (!endDate) return true;
  return startOfDay(occurrence) <= endDate;
}

function toScheduleJson(schedule, occurrenceDate) {
  const doc =
    typeof schedule.toObject === 'function' ? schedule.toObject() : { ...schedule };
  const anchor = startOfDay(normalizeDate(doc.date));

  return {
    ...doc,
    anchorDate: anchor,
    date: startOfDay(occurrenceDate),
  };
}

function eachDayInRange(rangeStart, rangeEnd, callback) {
  const cursor = startOfDay(rangeStart);
  const end = startOfDay(rangeEnd);

  while (cursor < end) {
    callback(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
}

/** 매일 — N일마다 */
function matchesDaily(anchor, day, interval) {
  const diff = daysBetween(anchor, day);
  return diff >= 0 && diff % interval === 0;
}

/** 매주 — N주마다 선택 요일 */
function matchesWeekly(anchor, day, interval, weekdays) {
  if (daysBetween(anchor, day) < 0) return false;
  if (!weekdays.includes(day.getDay())) return false;

  const weekDiff = Math.floor(daysBetween(anchor, day) / 7);
  return weekDiff % interval === 0;
}

/** 매월 — N개월마다 n번째 요일 또는 고정 일 */
function getMonthlyOccurrence(year, monthIndex, config) {
  if (config.monthlyMode === 'date') {
    const day = config.monthDay ?? 1;
    const candidate = new Date(year, monthIndex, day);
    if (candidate.getMonth() !== monthIndex) return null;
    return candidate;
  }

  const ordinal = config.monthOrdinal ?? 1;
  const weekday = config.monthWeekday ?? 0;
  return getNthWeekdayOfMonth(year, monthIndex, ordinal, weekday);
}

function matchesMonthly(anchor, day, interval, config) {
  if (startOfDay(day) < startOfDay(anchor)) return false;

  const monthDiff = monthsBetween(anchor, day);
  if (monthDiff < 0 || monthDiff % interval !== 0) return false;

  const occurrence = getMonthlyOccurrence(
    day.getFullYear(),
    day.getMonth(),
    config
  );
  if (!occurrence) return false;

  return startOfDay(occurrence).getTime() === startOfDay(day).getTime();
}

/** 매년 — N년마다 (날짜 or n번째 요일) */
function getYearlyOccurrence(year, config) {
  const monthIndex = (config.yearMonth ?? 1) - 1;

  if (config.yearlyMode === 'nthWeekday') {
    return getNthWeekdayOfMonth(
      year,
      monthIndex,
      config.yearOrdinal ?? 1,
      config.yearWeekday ?? 0
    );
  }

  const day = config.yearDay ?? 1;
  const candidate = new Date(year, monthIndex, day);
  if (candidate.getMonth() !== monthIndex) return null;
  return candidate;
}

function matchesYearly(anchor, day, interval, config) {
  if (startOfDay(day) < startOfDay(anchor)) return false;

  const yearDiff = yearsBetween(anchor, day);
  if (yearDiff < 0 || yearDiff % interval !== 0) return false;

  const occurrence = getYearlyOccurrence(day.getFullYear(), config);
  if (!occurrence) return false;

  return startOfDay(occurrence).getTime() === startOfDay(day).getTime();
}

function matchesRepeat(anchor, day, repeat, config) {
  const interval = Math.max(1, config?.interval ?? 1);

  switch (repeat) {
    case 'daily':
      return matchesDaily(anchor, day, interval);
    case 'weekly':
      return matchesWeekly(
        anchor,
        day,
        interval,
        config?.weekdays?.length ? config.weekdays : [anchor.getDay()]
      );
    case 'monthly':
      return matchesMonthly(anchor, day, interval, config ?? {});
    case 'yearly':
      return matchesYearly(anchor, day, interval, config ?? {});
    default:
      return false;
  }
}

/** 한 일정의 해당 월 반복 occurrence 펼치기 */
export function expandScheduleInRange(schedule, rangeStart, rangeEnd) {
  const anchor = startOfDay(normalizeDate(schedule.date));
  const repeat = schedule.repeat ?? 'none';
  const config = schedule.repeatConfig ?? { interval: 1 };
  const endDate = getRepeatEndDate(config);

  if (repeat === 'none') {
    if (anchor >= rangeStart && anchor < rangeEnd) {
      return [toScheduleJson(schedule, anchor)];
    }
    return [];
  }

  if (anchor >= rangeEnd) return [];

  const occurrences = [];

  eachDayInRange(rangeStart, rangeEnd, (day) => {
    if (day < anchor) return;
    if (!isWithinEnd(day, endDate)) return;
    if (!matchesRepeat(anchor, day, repeat, config)) return;

    occurrences.push(toScheduleJson(schedule, day));
  });

  return occurrences;
}

/** 월별 조회 — 반복 일정 포함 펼친 목록 */
export function expandSchedulesForMonth(schedules, year, month) {
  const rangeStart = new Date(year, month - 1, 1);
  const rangeEnd = new Date(year, month, 1);
  const expanded = [];

  for (const schedule of schedules) {
    expanded.push(...expandScheduleInRange(schedule, rangeStart, rangeEnd));
  }

  expanded.sort((a, b) => {
    const dateDiff = new Date(a.date) - new Date(b.date);
    if (dateDiff !== 0) return dateDiff;
    return String(a.createdAt).localeCompare(String(b.createdAt));
  });

  return expanded;
}
