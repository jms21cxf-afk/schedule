// PWA — 홈 화면 추가 안내 (공유 메뉴 ≠ 홈 화면)
import { useState } from 'react';
import { useMobileLayout } from '../hooks/useMobileLayout';
import { usePwaInstall } from '../hooks/usePwaInstall';
import { DEPLOY_URL, isLocalDevUrl, isDeployUrl, WRONG_URL_EXAMPLES } from '../utils/installUtils';
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
  const onDeploy = isDeployUrl();
  const currentHost = window.location.hostname;
  const deployHost = DEPLOY_URL.replace('https://', '');
  const onWrongVercel = WRONG_URL_EXAMPLES.includes(currentHost);

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
              {onDeploy && ' ✅ 맞는 주소'}
              {onWrongVercel && ' ❌ 다른 사람 앱'}
            </p>

            <div className="install-sheet-callout install-sheet-callout-ok">
              <p className="install-sheet-callout-title">내 일정 앱 주소 (전부 입력)</p>
              <p className="install-sheet-callout-text install-sheet-exact-url">
                {deployHost}
              </p>
              <p className="install-sheet-callout-text">
                <strong>schedule</strong>가 <strong>두 번</strong> (
                schedule-<strong>schedule</strong>-react).{' '}
                <strong>schedule-react</strong>만 있으면 다른 사이트입니다.
              </p>
              <a className="install-sheet-link" href={DEPLOY_URL}>
                이 주소로 열기 →
              </a>
              <button
                type="button"
                className="install-sheet-copy"
                onClick={copyDeployUrl}
              >
                {copied ? '복사됨!' : '주소 복사'}
              </button>
            </div>

            {onWrongVercel && (
              <div className="install-sheet-callout install-sheet-callout-danger">
                <p className="install-sheet-callout-title">
                  지금 주소는 내 앱이 아닙니다
                </p>
                <p className="install-sheet-callout-text">
                  <strong>{currentHost}</strong>는 다른 사람 일정/스케줄
                  사이트예요. 위 <strong>{deployHost}</strong>로 다시 접속하세요.
                </p>
              </div>
            )}

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

            {(isLocal || (!onDeploy && !onWrongVercel)) && (
              <div className="install-sheet-callout install-sheet-callout-danger">
                <p className="install-sheet-callout-title">
                  {isLocal ? '로컬 주소 — 홈 화면 추가 불가' : '배포 주소가 아닙니다'}
                </p>
                <p className="install-sheet-callout-text">
                  {isLocal ? (
                    <>
                      <strong>172…</strong>는 PC 개발용입니다. 아래 정확한 주소로
                      접속하세요.
                    </>
                  ) : (
                    <>주소창에 아래 주소를 <strong>전부</strong> 입력하세요.</>
                  )}
                </p>
              </div>
            )}

            {canNativeInstall && onDeploy && (
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
                      주소창에 아래 주소 <strong>전부</strong> 입력 후 이동
                      <br />
                      <span className="install-sheet-hint">
                        <strong>{deployHost}</strong>
                      </span>
                    </li>
                    <li>
                      달력·「일정」 제목이 보이면 맞는 사이트
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
