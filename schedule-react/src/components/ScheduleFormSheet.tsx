// 모바일용 접히는 일정 입력 패널 — 추가·수정
import type { Schedule, ScheduleFormData } from '../types/schedule';
import { scheduleToFormData } from '../utils/scheduleFormUtils';
import ScheduleForm from './ScheduleForm';
import './ScheduleFormSheet.css';

interface ScheduleFormSheetProps {
  isOpen: boolean;
  anchorDate: Date | null;
  editingSchedule: Schedule | null;
  onClose: () => void;
  onSubmit: (data: ScheduleFormData) => Promise<void>;
  onDelete: () => Promise<void>;
}

export default function ScheduleFormSheet({
  isOpen,
  anchorDate,
  editingSchedule,
  onClose,
  onSubmit,
  onDelete,
}: ScheduleFormSheetProps) {
  if (!isOpen || !anchorDate) return null;

  const isEditing = editingSchedule !== null;

  async function handleSubmit(data: ScheduleFormData) {
    await onSubmit(data);
    onClose();
  }

  async function handleDelete() {
    await onDelete();
    onClose();
  }

  return (
    <>
      <div className="sheet-backdrop open" onClick={onClose} />

      <section className="schedule-form-sheet open" aria-hidden={false}>
        <div className="sheet-handle" aria-hidden="true" />
        <ScheduleForm
          key={editingSchedule?._id ?? 'new'}
          anchorDate={anchorDate}
          initialValues={
            isEditing ? scheduleToFormData(editingSchedule) : undefined
          }
          onSubmit={handleSubmit}
          onCancel={onClose}
          onDelete={isEditing ? handleDelete : undefined}
          submitLabel={isEditing ? '수정' : '저장'}
        />
      </section>
    </>
  );
}
