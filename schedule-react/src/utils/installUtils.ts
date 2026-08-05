// PWA 설치 — 배포 URL·로컬 개발 주소 구분
/** 내 일정 앱 (Vercel) — schedule가 두 번 들어감 */
export const DEPLOY_URL = 'https://schedule-schedule-react.vercel.app';

/** 비슷해 보이지만 다른 사람 사이트 — 접속하면 안 됨 */
export const WRONG_URL_EXAMPLES = [
  'schedule-react.vercel.app',
  'schedule.vercel.app',
];

export function isDeployUrl(): boolean {
  return window.location.hostname === 'schedule-schedule-react.vercel.app';
}

/** Wi‑Fi IP·localhost — 홈 화면 추가 불가 */
export function isLocalDevUrl(): boolean {
  const host = window.location.hostname;
  return (
    host === 'localhost' ||
    host.startsWith('192.168.') ||
    host.startsWith('10.') ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host)
  );
}
