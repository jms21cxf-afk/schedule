// 위치 — 브라우저 geolocation, 실패 시 서울 기본값
import { DEFAULT_COORDS, type GeoCoords } from '../api/weatherApi';

const STORAGE_KEY = 'schedule-geo-coords';

function readStoredCoords(): GeoCoords | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GeoCoords;
    if (
      typeof parsed.latitude === 'number' &&
      typeof parsed.longitude === 'number'
    ) {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function storeCoords(coords: GeoCoords) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(coords));
}

/** 한 번 묻고 sessionStorage에 캐시 */
export function resolveGeoCoords(): Promise<GeoCoords> {
  const cached = readStoredCoords();
  if (cached) return Promise.resolve(cached);

  if (!navigator.geolocation) {
    return Promise.resolve(DEFAULT_COORDS);
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        storeCoords(coords);
        resolve(coords);
      },
      () => resolve(DEFAULT_COORDS),
      { timeout: 8000, maximumAge: 600_000 }
    );
  });
}
