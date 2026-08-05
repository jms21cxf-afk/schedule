// 백엔드 일정 API — 접속 기기 hostname 기준 (폰·PC 공통)
import type { Schedule, ScheduleFormData } from '../types/schedule';
import { getApiBase } from './config';

/** 해당 월 일정 목록 조회 */
export async function fetchSchedulesByMonth(
  year: number,
  month: number
): Promise<Schedule[]> {
  const res = await fetch(
    `${getApiBase()}/schedules?year=${year}&month=${month}`
  );

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message ?? '일정 조회에 실패했습니다.');
  }

  return res.json();
}

/** 일정 생성 */
export async function createSchedule(
  date: string,
  form: ScheduleFormData
): Promise<Schedule> {
  const res = await fetch(`${getApiBase()}/schedules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: form.title,
      date,
      repeat: form.repeat,
      repeatConfig: form.repeatConfig,
      color: form.color,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message ?? '일정 생성에 실패했습니다.');
  }

  return res.json();
}

/** 일정 수정 */
export async function updateSchedule(
  id: string,
  date: string,
  form: ScheduleFormData
): Promise<Schedule> {
  const res = await fetch(`${getApiBase()}/schedules/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: form.title,
      date,
      repeat: form.repeat,
      repeatConfig: form.repeatConfig,
      color: form.color,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message ?? '일정 수정에 실패했습니다.');
  }

  return res.json();
}

/** 일정 삭제 */
export async function deleteSchedule(id: string): Promise<void> {
  const res = await fetch(`${getApiBase()}/schedules/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message ?? '일정 삭제에 실패했습니다.');
  }
}
