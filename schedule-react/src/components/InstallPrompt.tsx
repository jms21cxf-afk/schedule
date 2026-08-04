// PWA — 바로가기 버튼·설치 안내 시트
import { useState } from 'react';
import { useMobileLayout } from '../hooks/useMobileLayout';
import { usePwaInstall } from '../hooks/usePwaInstall';
import './InstallPrompt.css';

const BANNER_KEY = 'schedule-install-hint-dismissed';

export default function InstallPrompt() {
  const isMobile = useMobileLayout();
  const { platform, isSecure, canNativeInstall, promptInstall, showInstallUi } =
    usePwaInstall();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(
    () => localStorage.getItem(BANNER_KEY) === '1'
  );

  if (!showInstallUi) return null;

  function dismissBanner() {
    localStorage.setItem(BANNER_KEY, '1');
    setBannerDismissed(true);
  }

  async function handleNativeInstall() {
    const accepted = await promptInstall();
    if (accepted) setSheetOpen(false);
  }

  return (
    <>
      {/* 화면 우측 상단 고정 — 스크롤·레이아웃과 무관하게 항상 표시 */}
      <button
        type="button"
        className="install-entry-btn"
        onClick={() => setSheetOpen(true)}
        aria-label="앱 설치 및 바로가기"
      >
        ⊕ 바로가기
      </button>

      {/* 첫 방문 배너 — 모바일만 */}
      {isMobile && !bannerDismissed && !sheetOpen && (
        <aside className="install-banner" aria-label="홈 화면 추가 안내">
          <p className="install-banner-title">홈 화면에 추가</p>
          <p className="install-banner-text">
            <strong>바로가기</strong> 버튼을 누르면 설치 방법을 볼 수 있어요.
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
              앱 설치 · 바로가기
            </h2>

            {!isSecure && (
              <p className="install-sheet-note install-sheet-warn">
                Wi‑Fi IP(<code>http://192…</code>)로는 설치가 안 됩니다.
                <br />
                <strong>Vercel HTTPS 주소</strong>로 접속해 주세요.
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

            {platform === 'android' && (
              <div className="install-sheet-steps">
                <p className="install-sheet-sub">Android (Chrome 권장)</p>
                <ol>
                  {canNativeInstall && isSecure ? (
                    <li>
                      위 <strong>앱 설치</strong> 버튼을 누르세요
                    </li>
                  ) : (
                    <>
                      <li>
                        <strong>Chrome</strong> 브라우저에서 이 페이지를 여세요
                        (카톡·인스타 안에서는 안 됨)
                      </li>
                      <li>
                        우측 상단 <strong>⋮</strong> →{' '}
                        <strong>홈 화면에 추가</strong> 또는 <strong>앱 설치</strong>
                      </li>
                    </>
                  )}
                </ol>
                <p className="install-sheet-tip">
                  ⋮ 메뉴에 <strong>다운로드</strong>만 보이면 바로가기가 아닙니다.
                  Chrome으로 다시 열어 주세요.
                </p>
              </div>
            )}

            {platform === 'desktop' && !canNativeInstall && (
              <div className="install-sheet-steps">
                <p className="install-sheet-sub">PC (Chrome · Edge)</p>
                <ol>
                  <li>주소창 오른쪽 <strong>설치</strong> 아이콘 클릭</li>
                  <li>또는 메뉴 → <strong>앱 설치</strong></li>
                </ol>
              </div>
            )}

            <p className="install-sheet-note">
              설치 후 홈 화면에서 캘린더 아이콘으로 바로 열 수 있어요.
            </p>

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
