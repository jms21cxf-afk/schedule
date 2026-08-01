// 날짜를 해당 일 00:00:00으로 맞춤 — 캘린더·일별 조회 일관성
export function normalizeDate(input) {
  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) return null;

  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}
