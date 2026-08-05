// PWA — 홈 화면 추가 (공유 버튼·Vercel URL 안내)
import { useState } from 'react';
import { useMobileLayout } from '../hooks/useMobileLayout';
import { usePwaInstall } from '../hooks/usePwaInstall';
import { DEPLOY_URL, isLocalDevUrl } from '../utils/installUtils';
import './InstallPrompt.css';

const BANNER_KEY = 'schedule-install-hint-dismissed';

export default function InstallPrompt() {
  const isMobile = useMobileLayout();
  const {
    platform,
    swReady,
    canNativeInstall,
    promptInstall,
    showInstallUi,
  } = usePwaInstall();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(
    () => localStorage.getItem(BANNER_KEY) === '1'
  );

  const isLocal = isLocalDevUrl();
  const currentHost = window.location.hostname;

  if (!showInstallUi) return null;

  function openSheet() {
    setSheetOpen(true);
  }

  function dismissBanner() {
    localStorage.setItem(BANNER_KEY, '1');
    setBannerDismissed(true);
  }

  async function handleEntryClick() {
    if (canNativeInstall && !isLocal) {
      const accepted = await promptInstall();
      if (!accepted) openSheet();
      return;
    }
    openSheet();
  }

  async function handleNativeInstall() {
    const accepted = await promptInstall();
    if (accepted) setSheetOpen(false);
  }

  return (
    <>
      {/* 달력 위 — 모바일에서 눈에 잘 띄는 바 */}
      {isMobile && (
        <button type="button" className="install-mobile-bar" onClick={openSheet}>
          📱 폰 홈 화면에 추가 — 방법 보기
        </button>
      )}

      <button
        type="button"
        className={`install-entry-btn${canNativeInstall && !isLocal ? ' install-entry-btn-primary' : ''}`}
        onClick={handleEntryClick}
        aria-label="홈 화면에 추가"
      >
        {canNativeInstall && !isLocal ? '⬇ 앱 설치' : '⊕ 홈 화면'}
      </button>

      {isMobile && !bannerDismissed && !sheetOpen && (
        <aside className="install-banner" aria-label="홈 화면 추가 안내">
          <p className="install-banner-title">⋮ 메뉴에 없어도 됩니다</p>
          <p className="install-banner-text">
            <strong>공유 ↗</strong> 버튼으로 추가할 수 있어요.{' '}
            <strong>📱 폰 홈 화면에 추가</strong> 바를 눌러 보세요.
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

            <p className="install-sheet-url">
              지금 주소: <strong>{currentHost}</strong>
            </p>

            {isLocal && (
              <div className="install-sheet-callout install-sheet-callout-danger">
                <p className="install-sheet-callout-title">
                  172… 로컬 주소 — 홈 화면 추가 안 됩니다
                </p>
                <p className="install-sheet-callout-text">
                  Chrome 첫 화면 ✓ 일정 아이콘이 <strong>172.30…</strong>로
                  연결돼 있으면 홈 화면 메뉴가 안 나올 수 있어요.
                </p>
                <a className="install-sheet-link" href={DEPLOY_URL}>
                  {DEPLOY_URL.replace('https://', '')} 로 열기 →
                </a>
              </div>
            )}

            {canNativeInstall && !isLocal && (
              <button
                type="button"
                className="install-sheet-primary"
                onClick={handleNativeInstall}
              >
                앱 설치
              </button>
            )}

            {platform === 'android' && (
              <>
                <div className="install-sheet-steps install-sheet-steps-highlight">
                  <p className="install-sheet-sub">① 공유 버튼 (⋮에 없을 때 이 방법)</p>
                  <ol>
                    <li>
                      주소창 <strong>오른쪽 공유 ↗</strong> 아이콘 탭
                      <br />
                      <span className="install-sheet-hint">
                        (없으면 ⋮ → <strong>공유</strong>)
                      </span>
                    </li>
                    <li>
                      아래 시트에서 <strong>홈 화면에 추가</strong> 탭
                    </li>
                    <li>
                      <strong>추가</strong>
                    </li>
                  </ol>
                </div>

                <div className="install-sheet-steps">
                  <p className="install-sheet-sub">② ⋮ 메뉴 (있을 때)</p>
                  <ol>
                    <li>
                      주소창 오른쪽 <strong>⋮</strong> 탭
                    </li>
                    <li>
                      <strong>아래로 스크롤</strong> →{' '}
                      <strong>바로가기 만들기</strong>
                    </li>
                    <li>
                      <strong>추가</strong>
                    </li>
                  </ol>
                  <p className="install-sheet-tip install-sheet-warn">
                    ⋮ 맨 위 <strong>↓ 다운로드</strong>는 페이지 저장입니다.
                    바로가기가 아니에요.
                  </p>
                </div>
              </>
            )}

            {platform === 'ios' && (
              <div className="install-sheet-steps">
                <p className="install-sheet-sub">iPhone · iPad (Safari)</p>
                <ol>
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
                <p className="install-sheet-sub">PC Chrome</p>
                <ol>
                  <li>주소창 오른쪽 <strong>⊕ 설치</strong></li>
                </ol>
              </div>
            )}

            {!swReady && !isLocal && (
              <p className="install-sheet-tip">
                메뉴가 안 보이면 <strong>새로고침</strong> 후 다시 시도하세요.
              </p>
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
