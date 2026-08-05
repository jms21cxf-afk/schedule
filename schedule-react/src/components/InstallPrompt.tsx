// PWA — 홈 화면 추가 안내 (공유 메뉴 ≠ 홈 화면)
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
  const [copied, setCopied] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(
    () => localStorage.getItem(BANNER_KEY) === '1'
  );

  const isLocal = isLocalDevUrl();
  const currentHost = window.location.hostname;
  const deployHost = DEPLOY_URL.replace('https://', '');

  if (!showInstallUi) return null;

  function openSheet() {
    setSheetOpen(true);
  }

  function dismissBanner() {
    localStorage.setItem(BANNER_KEY, '1');
    setBannerDismissed(true);
  }

  async function copyDeployUrl() {
    try {
      await navigator.clipboard.writeText(DEPLOY_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
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
          <p className="install-banner-title">공유 ↗ 는 링크 보내기입니다</p>
          <p className="install-banner-text">
            <strong>📱 폰 홈 화면에 추가</strong> 바에서 ⋮·북마크 방법을
            확인하세요.
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

            <div className="install-sheet-callout">
              <p className="install-sheet-callout-title">
                공유 ↗ = 링크복사·QR코드 (홈 화면 아님)
              </p>
              <p className="install-sheet-callout-text">
                공유를 눌렀을 때 <strong>링크 복사·긴 스크린샷·QR코드</strong>만
                보이면 정상입니다. 홈 화면 추가는 <strong>⋮ 메뉴</strong> 또는{' '}
                <strong>북마크</strong>로 합니다.
              </p>
            </div>

            {(isLocal || currentHost !== deployHost) && (
              <div className="install-sheet-callout install-sheet-callout-danger">
                <p className="install-sheet-callout-title">
                  먼저 배포 주소로 접속하세요
                </p>
                <p className="install-sheet-callout-text">
                  Chrome 첫 화면 ✓ <strong>일정</strong>이 172… 로컬 주소면 홈
                  화면 메뉴가 안 나올 수 있습니다.
                </p>
                <a className="install-sheet-link" href={DEPLOY_URL}>
                  {deployHost} 로 열기 →
                </a>
                <button
                  type="button"
                  className="install-sheet-copy"
                  onClick={copyDeployUrl}
                >
                  {copied ? '복사됨!' : '주소 복사'}
                </button>
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
                  <p className="install-sheet-sub">① ⋮ 메뉴 (가장 흔함)</p>
                  <ol>
                    <li>
                      주소창에 <strong>{deployHost}</strong> 입력 후 접속
                    </li>
                    <li>
                      주소창 오른쪽 <strong>⋮</strong> 탭
                    </li>
                    <li>
                      맨 위 <strong>아이콘 줄(↓다운로드)</strong> 말고,{' '}
                      <strong>글자 메뉴를 아래로 스크롤</strong>
                    </li>
                    <li>
                      <strong>바로가기 만들기</strong> 또는{' '}
                      <strong>홈 화면에 추가</strong> 탭 → <strong>추가</strong>
                    </li>
                  </ol>
                </div>

                <div className="install-sheet-steps">
                  <p className="install-sheet-sub">② ⋮에 없을 때 — 북마크로</p>
                  <ol>
                    <li>
                      주소창 왼쪽 <strong>☆ 별</strong> 탭 → 북마크 저장
                    </li>
                    <li>
                      <strong>⋮</strong> → <strong>북마크</strong>
                    </li>
                    <li>
                      <strong>일정</strong> 길게 누르기 →{' '}
                      <strong>홈 화면에 추가</strong>
                      <br />
                      <span className="install-sheet-hint">
                        (메뉴 이름은 기기마다 조금 다를 수 있음)
                      </span>
                    </li>
                  </ol>
                </div>

                <div className="install-sheet-steps">
                  <p className="install-sheet-sub">③ 추가 후 확인</p>
                  <ol>
                    <li>
                      <strong>폰 바탕화면</strong> 또는 <strong>앱 서랍</strong>에
                      「일정」 아이콘 확인
                    </li>
                    <li>
                      아이콘 길게 누르기 → <strong>제거</strong>면 바로가기,{' '}
                      <strong>삭제/제거</strong>면 앱 설치
                    </li>
                  </ol>
                </div>
              </>
            )}

            {platform === 'ios' && (
              <div className="install-sheet-steps">
                <p className="install-sheet-sub">iPhone · iPad (Safari)</p>
                <ol>
                  <li>
                    Safari에서 <strong>{deployHost}</strong> 접속
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
                <p className="install-sheet-sub">PC Chrome</p>
                <ol>
                  <li>주소창 오른쪽 <strong>⊕ 설치</strong></li>
                </ol>
              </div>
            )}

            {!swReady && !isLocal && (
              <p className="install-sheet-tip">
                ⋮에 메뉴가 없으면 <strong>새로고침</strong> 후 ①·②를 다시
                시도하세요.
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
