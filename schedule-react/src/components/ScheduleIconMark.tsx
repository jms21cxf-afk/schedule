// 일정 목록·달력 — 제목 앞 아이콘 (emoji 또는 SVG)
import {
  getScheduleIconEmoji,
  getScheduleIconImage,
  hasScheduleIcon,
} from '../types/scheduleIcon';
import type { ScheduleIconType } from '../types/scheduleIcon';
import './ScheduleIconMark.css';

interface ScheduleIconMarkProps {
  icon?: ScheduleIconType | string | null;
}

export default function ScheduleIconMark({ icon }: ScheduleIconMarkProps) {
  if (!hasScheduleIcon(icon)) return null;

  const image = getScheduleIconImage(icon);
  if (image) {
    return (
      <img
        src={image}
        alt=""
        className="schedule-icon-mark schedule-icon-img"
        aria-hidden="true"
      />
    );
  }

  const emoji = getScheduleIconEmoji(icon);
  return (
    <span className="schedule-icon-mark" aria-hidden="true">
      {emoji}
    </span>
  );
}
