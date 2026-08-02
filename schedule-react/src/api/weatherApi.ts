// Open-Meteo — 선택 날짜·시간별 날씨 (키 없음)
import {
  weatherFromCode,
  type DayWeather,
} from '../utils/weatherCodeUtils';

export interface GeoCoords {
  latitude: number;
  longitude: number;
}

interface HourlyForecastResponse {
  hourly?: {
    time?: string[];
    precipitation_probability?: number[];
    precipitation?: number[];
    weathercode?: number[];
    relative_humidity_2m?: number[];
  };
}

const SEOUL: GeoCoords = { latitude: 37.5665, longitude: 126.9780 };

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** 오늘이면 현재 시, 다른 날이면 12시 */
export function resolveTargetHour(selectedDate: Date): {
  hour: number;
  isToday: boolean;
} {
  const today = startOfDay(new Date());
  const target = startOfDay(selectedDate);
  const isToday = target.getTime() === today.getTime();

  return {
    hour: isToday ? new Date().getHours() : 12,
    isToday,
  };
}

function findHourIndex(times: string[], dateKey: string, hour: number) {
  const prefix = `${dateKey}T${String(hour).padStart(2, '0')}:`;
  const idx = times.findIndex((t) => t.startsWith(prefix));
  if (idx >= 0) return idx;

  return times.findIndex((t) => t.startsWith(dateKey));
}

/** 해당 날짜·시간 날씨 (hourly API) */
export async function fetchDayWeather(
  dateKey: string,
  coords: GeoCoords = SEOUL,
  targetHour = 12,
  isToday = false
): Promise<DayWeather | null> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(coords.latitude));
  url.searchParams.set('longitude', String(coords.longitude));
  url.searchParams.set(
    'hourly',
    'precipitation_probability,precipitation,weathercode,relative_humidity_2m'
  );
  url.searchParams.set('timezone', 'Asia/Seoul');
  url.searchParams.set('start_date', dateKey);
  url.searchParams.set('end_date', dateKey);

  const res = await fetch(url.toString());
  if (!res.ok) return null;

  const data = (await res.json()) as HourlyForecastResponse;
  const times = data.hourly?.time ?? [];
  if (times.length === 0) return null;

  const idx = findHourIndex(times, dateKey, targetHour);
  if (idx < 0) return null;

  const prob = data.hourly?.precipitation_probability?.[idx] ?? 0;
  const amount = data.hourly?.precipitation?.[idx] ?? 0;
  const code = data.hourly?.weathercode?.[idx] ?? 0;
  const humidity = data.hourly?.relative_humidity_2m?.[idx] ?? 0;

  const weather = weatherFromCode(code, prob, amount);
  return {
    ...weather,
    hour: targetHour,
    isToday,
    humidity: Math.round(humidity),
  };
}

export { SEOUL as DEFAULT_COORDS };
