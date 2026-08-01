// 좌우 스와이프 — 이전/다음 달 이동 (모바일)
import { useCallback, useRef } from 'react';

const SWIPE_THRESHOLD = 50;

export function useSwipeMonth(
  onPrev: () => void,
  onNext: () => void,
  enabled = true
) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return;
      const touch = e.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
    },
    [enabled]
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || !touchStart.current) return;

      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStart.current.x;
      const dy = touch.clientY - touchStart.current.y;
      touchStart.current = null;

      // 짧은 스와이프·세로 스크롤은 무시
      if (Math.abs(dx) < SWIPE_THRESHOLD) return;
      if (Math.abs(dx) < Math.abs(dy)) return;

      // 왼쪽으로 밀기 → 다음 달, 오른쪽 → 이전 달
      if (dx < 0) onNext();
      else onPrev();
    },
    [enabled, onPrev, onNext]
  );

  return { onTouchStart, onTouchEnd };
}
