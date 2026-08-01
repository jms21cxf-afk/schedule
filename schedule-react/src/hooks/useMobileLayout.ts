// 모바일 레이아웃 여부 — 768px 이하
import { useEffect, useState } from 'react';

const MOBILE_QUERY = '(max-width: 768px)';

export function useMobileLayout() {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(MOBILE_QUERY).matches
  );

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setIsMobile(media.matches);

    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}
