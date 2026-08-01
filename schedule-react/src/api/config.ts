// API 베이스 URL — dev는 Vite 프록시(/api), 배포는 VITE_API_URL
function getApiBase(): string {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }

  // dev: PC·폰 모두 같은 주소(5173)만 쓰면 Vite가 백엔드로 연결
  if (import.meta.env.DEV) {
    return '/api';
  }

  return 'http://localhost:5000/api';
}

export { getApiBase };
