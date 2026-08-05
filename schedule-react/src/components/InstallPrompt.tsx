// PWA — 홈 화면 추가 안내 (Chrome 새 탭 ✓ 과 구분)
import { useState } from 'react';
import { useMobileLayout } from '../hooks/useMobileLayout';
import { usePwaInstall } from '../hooks/usePwaInstall';
import './InstallPrompt.css';

const BANNER_KEY = 'schedule-install-hint-dismissed';

export default function InstallPrompt() {
  const isMobile = useMobileLayout();
  const {
    platform,
    isSecure,
    swReady,
    canNativeInstall,
    promptInstall,
    showInstallUi,
  } = usePwaInstall();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(
    () => localStorage.getItem(BANNER_KEY) === '1'
  );

  if (!showInstallUi) return null;

  function dismissBanner() {
    localStorage.setItem(BANNER_KEY, '1');
    setBannerDismissed(true);
  }

  async function handleEntryClick() {
    if (canNativeInstall) {
      const accepted = await promptInstall();
      if (!accepted) setSheetOpen(true);
      return;
    }
    setSheetOpen(true);
  }

  async function handleNativeInstall() {
    const accepted = await promptInstall();
    if (accepted) setSheetOpen(false);
  }

  return (
    <>
      <button
        type="button"
        className={`install-entry-btn${canNativeInstall ? ' install-entry-btn-primary' : ''}`}
        onClick={handleEntryClick}
        aria-label="홈 화면에 추가"
      >
        {canNativeInstall ? '⬇ 앱 설치' : '⊕ 홈 화면'}
      </button>

      {isMobile && !bannerDismissed && !sheetOpen && !canNativeInstall && (
        <aside className="install-banner" aria-label="홈 화면 추가 안내">
          <p className="install-banner-title">폰 홈 화면에 추가</p>
          <p className="install-banner-text">
            Chrome 첫 화면 ✓ 체크 ≠ 홈 화면.{' '}
            <strong>⊕ 홈 화면</strong> 버튼을 눌러 방법을 확인하세요.
          </p>
          <button type="button" className="install-banner-close" onClick={dismissBanner}>
            닫기
          </button>
        </aside>
      )}

      {sheetOpen && (
        <div
          className="install-sheet-backdrop"
          role="presentation"
          onClick={() => setSheetOpen(false)}
        >
          <div
            className="install-sheet"
            role="dialog"
            aria-labelledby="install-sheet-title"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="install-sheet-title" className="install-sheet-title">
              폰 홈 화면에 추가
            </h2>

            {/* Chrome 새 탭 ✓ — 사용자가 본 화면 */}
            <div className="install-sheet-callout">
              <p className="install-sheet-callout-title">
                ✓ 체크 + 이름 밑줄 = Chrome 첫 화면 바로가기
              </p>
              <p className="install-sheet-callout-text">
                Chrome을 열었을 때 보이는 <strong>일정·로컬·고스톱</strong>{' '}
                아이콘 줄에서 ✓가 있으면, 그건 <strong>Chrome 안</strong>에만
                고정된 것입니다. <strong>폰 바탕화면(홈 화면)</strong>과는
                다릅니다.
              </p>
            </div>

            {!isSecure && (
              <p className="install-sheet-note install-sheet-warn">
                Wi‑Fi IP(<code>http://192…</code>)로는 추가가 안 됩니다. Vercel
                HTTPS 주소로 접속해 주세요.
              </p>
            )}

            {canNativeInstall && isSecure && (
              <button
                type="button"
                className="install-sheet-primary"
                onClick={handleNativeInstall}
              >
                앱 설치
              </button>
            )}

            {platform === 'android' && isSecure && (
              <div className="install-sheet-steps">
                <p className="install-sheet-sub">홈 화면에 넣는 방법</p>
                <ol>
                  <li>
                    Chrome 첫 화면에서 <strong>일정 아이콘을 탭</strong>해{' '}
                    <strong>사이트를 연다</strong>
                  </li>
                  <li>
                    주소창 오른쪽 <strong>⋮</strong> 탭
                  </li>
                  <li>
                    <strong>아래로 스크롤</strong> →{' '}
                    <strong>바로가기 만들기</strong> 또는{' '}
                    <strong>홈 화면에 추가</strong>
                  </li>
                  <li>
                    <strong>추가</strong> → 폰 홈 화면에 아이콘 생김
                  </li>
                </ol>
                <p className="install-sheet-tip install-sheet-warn">
                  ⋮ 맨 위 <strong>↓ 다운로드</strong>는 페이지 저장입니다.
                </p>
                <p className="install-sheet-tip">
                  추가했는데 홈 화면에 없으면{' '}
                  <strong>앱 서랍(전체 앱 목록)</strong>에서 「일정」을 찾아{' '}
                  <strong>길게 누르기 → 홈 화면에 추가</strong>하세요.
                </p>
                <p className="install-sheet-tip">
                  아이콘 왼쪽 아래에 <strong>작은 Chrome 마크</strong>가 있으면
                  앱 설치가 아니라 바로가기입니다. Play 스토어에{' '}
                  <strong>Google 로그인</strong> 후 다시 시도해 보세요.
                </p>
                {!swReady && (
                  <p className="install-sheet-tip">
                    메뉴가 안 보이면 페이지를 <strong>새로고침</strong> 후
                    다시 시도하세요.
                  </p>
                )}
              </div>
            )}

            {platform === 'ios' && (
              <div className="install-sheet-steps">
                <p className="install-sheet-sub">iPhone · iPad (Safari)</p>
                <ol>
                  <li>
                    <strong>일정 사이트</strong>를 Safari에서 연다
                  </li>
                  <li>
                    하단 <strong>공유</strong> → <strong>홈 화면에 추가</strong>
                  </li>
                  <li>
                    <strong>추가</strong>
                  </li>
                </ol>
              </div>
            )}

            {platform === 'desktop' && (
              <div className="install-sheet-steps">
                <p className="install-sheet-sub">PC Chrome · Edge</p>
                <ol>
                  <li>주소창 오른쪽 <strong>⊕ 설치</strong> 클릭</li>
                  <li>없으면 ⋮ → <strong>앱 설치</strong></li>
                </ol>
              </div>
            )}

            <button
              type="button"
              className="install-sheet-close"
              onClick={() => setSheetOpen(false)}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
