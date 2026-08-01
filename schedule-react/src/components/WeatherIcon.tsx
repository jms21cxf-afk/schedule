// 날씨 아이콘 SVG — 맑음·비·흐림 등
import type { WeatherIconType } from '../utils/weatherCodeUtils';

interface WeatherIconProps {
  type: WeatherIconType;
}

export default function WeatherIcon({ type }: WeatherIconProps) {
  switch (type) {
    case 'clear':
      return (
        <svg className="weather-icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="5" fill="#f9a825" />
          <g stroke="#f9a825" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="2" x2="12" y2="5" />
            <line x1="12" y1="19" x2="12" y2="22" />
            <line x1="2" y1="12" x2="5" y2="12" />
            <line x1="19" y1="12" x2="22" y2="12" />
            <line x1="4.2" y1="4.2" x2="6.4" y2="6.4" />
            <line x1="17.6" y1="17.6" x2="19.8" y2="19.8" />
            <line x1="4.2" y1="19.8" x2="6.4" y2="17.6" />
            <line x1="17.6" y1="6.4" x2="19.8" y2="4.2" />
          </g>
        </svg>
      );
    case 'partly-cloudy':
      return (
        <svg className="weather-icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="9" cy="9" r="3.5" fill="#f9a825" />
          <path
            d="M7 17h9a4 4 0 0 0 .5-8 5 5 0 0 0-9.6 1.2A3.5 3.5 0 0 0 7 17z"
            fill="#90a4ae"
          />
        </svg>
      );
    case 'cloudy':
    case 'fog':
      return (
        <svg className="weather-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 16h11a4 4 0 0 0 .4-8 5.5 5.5 0 0 0-10.5 1.8A3.8 3.8 0 0 0 6 16z"
            fill="#90a4ae"
          />
        </svg>
      );
    case 'snow':
      return (
        <svg className="weather-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 15h11a4 4 0 0 0 .4-8 5.5 5.5 0 0 0-10.5 1.8A3.8 3.8 0 0 0 6 15z"
            fill="#90a4ae"
          />
          <circle cx="8" cy="19" r="1" fill="#64b5f6" />
          <circle cx="12" cy="20" r="1" fill="#64b5f6" />
          <circle cx="16" cy="19" r="1" fill="#64b5f6" />
        </svg>
      );
    case 'thunder':
      return (
        <svg className="weather-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 14h11a4 4 0 0 0 .4-8 5.5 5.5 0 0 0-10.5 1.8A3.8 3.8 0 0 0 6 14z"
            fill="#607d8b"
          />
          <path d="M13 13l-2 4h2l-1 3 4-5h-2l1-2z" fill="#f9a825" />
        </svg>
      );
    case 'rain':
    default:
      return (
        <svg className="weather-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 14h11a4 4 0 0 0 .4-8 5.5 5.5 0 0 0-10.5 1.8A3.8 3.8 0 0 0 6 14z"
            fill="#607d8b"
          />
          <line x1="9" y1="17" x2="8" y2="20" stroke="#1e88e5" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="13" y1="17" x2="12" y2="20" stroke="#1e88e5" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="17" y1="17" x2="16" y2="20" stroke="#1e88e5" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
  }
}
