// 모바일 — 홈 화면 바로가기 안내 (한 번만 표시)
import { useState } from 'react';
import { useMobileLayout } from '../hooks/useMobileLayout';
import './InstallHint.css';

const STORAGE_KEY = 'schedule-install-hint-dismissed';

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export default function InstallHint() {
  const isMobile = useMobileLayout();
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === '1'
  );

  if (!isMobile || dismissed || isStandalone()) return null;

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1');
    setDismissed(true);
  }

  return (
    <aside className="install-hint" aria-label="홈 화면 추가 안내">
      <p className="install-hint-title">홈 화면에 추가</p>
      <p className="install-hint-text">
        iPhone: Safari <strong>공유</strong> → <strong>홈 화면에 추가</strong>
        <br />
        Android: Chrome <strong>⋮</strong> → <strong>홈 화면에 추가</strong> 또는{' '}
        <strong>앱 설치</strong>
      </p>
      <button type="button" className="install-hint-close" onClick={dismiss}>
        닫기
      </button>
    </aside>
  );
}
