// PWA 설치 — beforeinstallprompt·서비스워커·플랫폼 감지
import { useCallback, useEffect, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export type InstallPlatform = 'ios' | 'android' | 'desktop' | 'unknown';

function detectPlatform(): InstallPlatform {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  if (/Mobi|Mobile/.test(ua)) return 'unknown';
  return 'desktop';
}

export function isStandaloneMode() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [canNativeInstall, setCanNativeInstall] = useState(false);
  const [swReady, setSwReady] = useState(false);
  const platform = detectPlatform();
  const isStandalone = isStandaloneMode();
  const isSecure = window.isSecureContext;

  useEffect(() => {
    function onBeforeInstall(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setCanNativeInstall(true);
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () =>
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  // 서비스 워커 등록 여부 — Chrome 설치 조건
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.ready
      .then(() => setSwReady(true))
      .catch(() => setSwReady(false));
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setCanNativeInstall(false);
    return outcome === 'accepted';
  }, [deferredPrompt]);

  return {
    platform,
    isStandalone,
    isSecure,
    swReady,
    canNativeInstall,
    promptInstall,
    showInstallUi: !isStandalone,
  };
}
