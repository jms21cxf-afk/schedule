// WMO weathercode → 아이콘·라벨
export type WeatherIconType =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'rain'
  | 'snow'
  | 'thunder';

export interface DayWeather {
  icon: WeatherIconType;
  label: string;
  rainProbability: number;
  needsUmbrella: boolean;
  /** 표시 기준 시각 (0~23) */
  hour: number;
  /** 선택일이 오늘이면 true — 현재 시각 기준 */
  isToday: boolean;
  /** 상대 습도 (%) */
  humidity: number;
}

/** Open-Meteo WMO 코드 → 표시용 날씨 (시간별 값) */
export function weatherFromCode(
  code: number,
  rainProbability: number,
  precipitationAmount: number
): DayWeather {
  let icon: WeatherIconType = 'partly-cloudy';
  let label = '흐림';

  if (code === 0) {
    icon = 'clear';
    label = '맑음';
  } else if (code === 1 || code === 2) {
    icon = 'partly-cloudy';
    label = '구름 조금';
  } else if (code === 3) {
    icon = 'cloudy';
    label = '흐림';
  } else if (code === 45 || code === 48) {
    icon = 'fog';
    label = '안개';
  } else if (code >= 71 && code <= 77) {
    icon = 'snow';
    label = '눈';
  } else if (code >= 95) {
    icon = 'thunder';
    label = '천둥·비';
  } else if (code >= 51 && code <= 55) {
    icon = 'rain';
    label = '이슬비';
  } else if (code >= 56 && code <= 67) {
    icon = 'rain';
    label = '비';
  } else if (code >= 80 && code <= 82) {
    icon = 'rain';
    label = '소나기';
  } else if (precipitationAmount >= 0.2 || rainProbability >= 70) {
    icon = 'rain';
    label = '비';
  }

  const needsUmbrella =
    icon === 'rain' ||
    icon === 'thunder' ||
    rainProbability >= 50 ||
    precipitationAmount >= 0.1 ||
    (code >= 51 && code <= 67) ||
    (code >= 80 && code <= 82) ||
    code >= 95;

  return {
    icon,
    label,
    rainProbability: Math.round(rainProbability),
    needsUmbrella,
    hour: 0,
    isToday: false,
    humidity: 0,
  };
}
