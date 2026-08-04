// 일정 타입·폼 옵션 정의
import type { RepeatConfig } from './repeat';
import type { ScheduleIconType } from './scheduleIcon';

export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Schedule {
  _id: string;
  title: string;
  date: string;
  /** 반복 일정 — DB에 저장된 시작일 (펼친 occurrence 조회 시) */
  anchorDate?: string;
  repeat?: RepeatType;
  repeatConfig?: RepeatConfig;
  color?: string;
  icon?: ScheduleIconType;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleFormData {
  title: string;
  repeat: RepeatType;
  repeatConfig?: RepeatConfig;
  color: string;
  icon: ScheduleIconType;
}

export const REPEAT_OPTIONS: { value: RepeatType; label: string }[] = [
  { value: 'none', label: '없음' },
  { value: 'daily', label: '매일' },
  { value: 'weekly', label: '매주' },
  { value: 'monthly', label: '매월' },
  { value: 'yearly', label: '매년' },
];

export const COLOR_OPTIONS = [
  '#333333',
  '#e53935',
  '#1e88e5',
  '#2e7d32',
  '#f9a825',
  '#8e24aa',
] as const;
