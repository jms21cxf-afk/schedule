// 날씨 아이콘 + 라벨 — 선택 날짜·시간
import type { DayWeather } from '../utils/weatherCodeUtils';
import WeatherIcon from './WeatherIcon';
import './WeatherHint.css';

interface WeatherHintProps {
  weather: DayWeather | null;
}

export default function WeatherHint({ weather }: WeatherHintProps) {
  if (!weather) return null;

  const timeLabel = weather.isToday
    ? `지금 ${weather.hour}시`
    : `${weather.hour}시`;

  const ariaLabel = weather.needsUmbrella
    ? `${timeLabel}, ${weather.label}, 강수 확률 ${weather.rainProbability}%`
    : `${timeLabel}, ${weather.label}`;

  return (
    <div
      className={`weather-hint${weather.needsUmbrella ? ' is-rainy' : ''}`}
      role="status"
      aria-label={ariaLabel}
      title={
        weather.isToday
          ? '현재 시각 기준 시간별 예보입니다.'
          : '해당 날짜 오후 12시 기준 예보입니다.'
      }
    >
      <span className="weather-hint-time">{timeLabel}</span>
      <WeatherIcon type={weather.icon} />
      <span className="weather-hint-label">{weather.label}</span>
      {weather.needsUmbrella && weather.rainProbability > 0 && (
        <span className="weather-hint-extra">
          강수 {weather.rainProbability}%
        </span>
      )}
    </div>
  );
}
