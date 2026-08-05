// PWA 설치 — 배포 URL·로컬 개발 주소 구분
export const DEPLOY_URL = 'https://schedule-schedule-react.vercel.app';

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
