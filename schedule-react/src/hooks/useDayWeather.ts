// 선택 날짜 날씨 — Open-Meteo + 위치
import { useEffect, useState } from 'react';
import { fetchDayWeather, resolveTargetHour } from '../api/weatherApi';
import type { DayWeather } from '../utils/weatherCodeUtils';
import { formatDateKey } from '../utils/dateUtils';
import { resolveGeoCoords } from '../utils/geoUtils';

const MAX_FORECAST_DAYS = 16;

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function isForecastable(date: Date) {
  const today = startOfDay(new Date());
  const target = startOfDay(date);
  if (target < today) return false;
  return target <= addDays(today, MAX_FORECAST_DAYS);
}

export function useDayWeather(selectedDate: Date | null) {
  const [weather, setWeather] = useState<DayWeather | null>(null);

  useEffect(() => {
    if (!selectedDate || !isForecastable(selectedDate)) {
      setWeather(null);
      return;
    }

    let cancelled = false;
    const date = selectedDate;
    const dateKey = formatDateKey(date);

    async function load() {
      try {
        const coords = await resolveGeoCoords();
        const { hour, isToday } = resolveTargetHour(date);
        const data = await fetchDayWeather(dateKey, coords, hour, isToday);
        if (!cancelled) setWeather(data);
      } catch {
        if (!cancelled) setWeather(null);
      }
    }

    load();

    // 오늘 선택 시 — 시간이 바뀌면 다시 조회
    const timer = resolveTargetHour(date).isToday
      ? window.setInterval(load, 60 * 60 * 1000)
      : undefined;

    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
    };
  }, [selectedDate]);

  return weather;
}
