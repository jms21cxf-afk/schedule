// PWA — 설치 버튼·Chrome 메뉴 안내
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
        aria-label={canNativeInstall ? '앱 설치' : '홈 화면 바로가기 안내'}
      >
        {canNativeInstall ? '⬇ 앱 설치' : '⊕ 바로가기'}
      </button>

      {isMobile && !bannerDismissed && !sheetOpen && !canNativeInstall && (
        <aside className="install-banner" aria-label="홈 화면 추가 안내">
          <p className="install-banner-title">홈 화면에 추가</p>
          <p className="install-banner-text">
            <strong>⊕ 바로가기</strong> → Chrome 메뉴에서{' '}
            <strong>바로가기 만들기</strong>를 찾으세요.
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
              홈 화면 바로가기
            </h2>

            {!isSecure && (
              <p className="install-sheet-note install-sheet-warn">
                Wi‑Fi IP 주소(<code>http://192…</code>)로는 설치가 안 됩니다.
                Vercel HTTPS 주소로 접속해 주세요.
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
                <p className="install-sheet-sub">Android Chrome — 이렇게 하세요</p>
                <ol>
                  <li>
                    주소창 오른쪽 <strong>⋮</strong>(점 3개) 탭
                  </li>
                  <li>
                    <strong>메뉴를 아래로 스크롤</strong> (맨 위 다운로드 아이콘은
                    무시)
                  </li>
                  <li>
                    <strong>바로가기 만들기</strong> 또는{' '}
                    <strong>홈 화면에 추가</strong> 탭
                    <br />
                    <span className="install-sheet-hint">
                      (영문: Install and create shortcut)
                    </span>
                  </li>
                  <li>
                    이름 확인 후 <strong>추가</strong>
                  </li>
                </ol>
                <p className="install-sheet-tip install-sheet-warn">
                  ⋮ 맨 위 <strong>다운로드 ↓</strong> 아이콘은 페이지 저장입니다.
                  바로가기가 아니에요.
                </p>
                {!swReady && (
                  <p className="install-sheet-tip">
                    설치 메뉴가 안 보이면 페이지를 <strong>새로고침</strong>한 뒤
                    다시 시도해 주세요.
                  </p>
                )}
              </div>
            )}

            {platform === 'ios' && (
              <div className="install-sheet-steps">
                <p className="install-sheet-sub">iPhone · iPad (Safari)</p>
                <ol>
                  <li>
                    하단 <strong>공유</strong> 버튼 탭
                  </li>
                  <li>
                    <strong>홈 화면에 추가</strong> 선택
                  </li>
                  <li>
                    <strong>추가</strong> 탭
                  </li>
                </ol>
              </div>
            )}

            {platform === 'desktop' && (
              <div className="install-sheet-steps">
                <p className="install-sheet-sub">PC Chrome · Edge</p>
                <ol>
                  <li>주소창 오른쪽 <strong>⊕ 설치</strong> 아이콘 클릭</li>
                  <li>없으면 ⋮ → <strong>앱 설치</strong> 또는 <strong>바로가기 만들기</strong></li>
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
