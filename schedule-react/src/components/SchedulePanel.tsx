// 선택한 날짜의 일정 목록 — 클릭 시 수정
import type { Schedule, ScheduleFormData } from '../types/schedule';
import { formatSelectedLabel } from '../utils/dateUtils';
import { scheduleToFormData } from '../utils/scheduleFormUtils';
import { useDayWeather } from '../hooks/useDayWeather';
import WeatherHint from './WeatherHint';
import ScheduleIconMark from './ScheduleIconMark';
import ScheduleForm from './ScheduleForm';
import './SchedulePanel.css';

interface SchedulePanelProps {
  selectedDate: Date | null;
  schedules: Schedule[];
  editingSchedule: Schedule | null;
  onEdit: (schedule: Schedule) => void;
  onCancelEdit: () => void;
  onSave: (form: ScheduleFormData) => Promise<void>;
  onDelete: () => Promise<void>;
}

export default function SchedulePanel({
  selectedDate,
  schedules,
  editingSchedule,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
}: SchedulePanelProps) {
  if (!selectedDate) {
    return <p className="schedule-hint">날짜를 선택해 주세요.</p>;
  }

  const isEditing = editingSchedule !== null;
  const dayWeather = useDayWeather(selectedDate);

  return (
    <section className="schedule-panel">
      <div className="schedule-date-row">
        <h2 className="schedule-date">{formatSelectedLabel(selectedDate)}</h2>
        <WeatherHint weather={dayWeather} />
      </div>

      <ul className="schedule-list">
        {schedules.length === 0 ? (
          <li className="empty">등록된 일정이 없습니다.</li>
        ) : (
          schedules.map((schedule) => (
            <li key={schedule._id}>
              <button
                type="button"
                className={`schedule-item-btn${editingSchedule?._id === schedule._id ? ' active' : ''}`}
                style={{ color: schedule.color ?? '#333' }}
                onClick={() => onEdit(schedule)}
              >
                <ScheduleIconMark icon={schedule.icon} />
                <span className="schedule-item-title">{schedule.title}</span>
              </button>
            </li>
          ))
        )}
      </ul>

      {/* 데스크톱 — 추가·수정 폼 */}
      <div className="schedule-panel-form">
        {isEditing && (
          <p className="schedule-form-mode">일정 수정</p>
        )}
        <ScheduleForm
          key={editingSchedule?._id ?? 'new'}
          anchorDate={selectedDate}
          initialValues={
            isEditing ? scheduleToFormData(editingSchedule) : undefined
          }
          onSubmit={onSave}
          onCancel={isEditing ? onCancelEdit : undefined}
          onDelete={isEditing ? onDelete : undefined}
          submitLabel={isEditing ? '수정' : '추가'}
        />
      </div>
    </section>
  );
}
