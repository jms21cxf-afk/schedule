// 일정 아이콘 — emoji·SVG·선택 옵션
export type ScheduleIconType =
  | 'none'
  | 'birthday'
  | 'important'
  | 'work'
  | 'meeting'
  | 'health'
  | 'travel'
  | 'shopping'
  | 'study'
  | 'reminder';

export interface ScheduleIconOption {
  value: ScheduleIconType;
  label: string;
  emoji: string;
  /** emoji 대신 쓸 SVG (원형 딸기 케이크 등) */
  image?: string;
}

export const SCHEDULE_ICON_OPTIONS: ScheduleIconOption[] = [
  { value: 'none', label: '없음', emoji: '' },
  {
    value: 'birthday',
    label: '생일',
    emoji: '',
    image: '/schedule-icons/birthday-strawberry.svg',
  },
  { value: 'important', label: '중요', emoji: '⭐' },
  { value: 'work', label: '업무', emoji: '💼' },
  { value: 'meeting', label: '모임', emoji: '👯' },
  { value: 'health', label: '운동', emoji: '💪' },
  { value: 'travel', label: '여행', emoji: '✈️' },
  { value: 'shopping', label: '쇼핑', emoji: '🛒' },
  { value: 'study', label: '공부', emoji: '📚' },
  { value: 'reminder', label: '알림', emoji: '🔔' },
];

export function getScheduleIconOption(
  icon?: ScheduleIconType | string | null
): ScheduleIconOption | undefined {
  if (!icon || icon === 'none') return undefined;
  return SCHEDULE_ICON_OPTIONS.find((o) => o.value === icon);
}

/** 아이콘 키 → emoji (SVG 전용이면 빈 문자열) */
export function getScheduleIconEmoji(
  icon?: ScheduleIconType | string | null
): string {
  return getScheduleIconOption(icon)?.emoji ?? '';
}

/** 아이콘 키 → SVG 경로 */
export function getScheduleIconImage(
  icon?: ScheduleIconType | string | null
): string | undefined {
  return getScheduleIconOption(icon)?.image;
}

export function hasScheduleIcon(icon?: ScheduleIconType | string | null): boolean {
  if (!icon || icon === 'none') return false;
  const opt = getScheduleIconOption(icon);
  return Boolean(opt?.emoji || opt?.image);
}

/** 아이콘 키 → 한글 라벨 */
export function getScheduleIconLabel(
  icon?: ScheduleIconType | string | null
): string {
  if (!icon || icon === 'none') return '없음';
  return getScheduleIconOption(icon)?.label ?? '없음';
}
