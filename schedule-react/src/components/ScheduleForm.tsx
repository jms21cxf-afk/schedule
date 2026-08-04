// 일정 입력 폼 — 추가·수정 공용 (제목·반복·색상)

import { useEffect, useState } from 'react';

import type { RepeatType, ScheduleFormData } from '../types/schedule';

import { COLOR_OPTIONS } from '../types/schedule';

import type { ScheduleIconType } from '../types/scheduleIcon';

import {
  SCHEDULE_ICON_OPTIONS,
  getScheduleIconEmoji,
  getScheduleIconImage,
  getScheduleIconLabel,
  hasScheduleIcon,
} from '../types/scheduleIcon';

import {

  createDefaultRepeatConfig,

  normalizeRepeatConfig,

  syncRepeatConfigWithAnchorDate,

} from '../types/repeat';

import { formatRepeatSummary } from '../utils/repeatUtils';

import RepeatSettings from './RepeatSettings';

import './ScheduleForm.css';



interface ScheduleFormProps {

  /** 반복 기본 요일 등 — 선택한 날짜 */

  anchorDate: Date;

  initialValues?: ScheduleFormData;

  onSubmit: (data: ScheduleFormData) => Promise<void>;

  onCancel?: () => void;

  onDelete?: () => Promise<void>;

  submitLabel?: string;

}



export default function ScheduleForm({

  anchorDate,

  initialValues,

  onSubmit,

  onCancel,

  onDelete,

  submitLabel = '저장',

}: ScheduleFormProps) {

  const initialRepeat = initialValues?.repeat ?? 'none';



  const [title, setTitle] = useState(initialValues?.title ?? '');

  const [repeat, setRepeat] = useState<RepeatType>(initialRepeat);

  const [repeatConfig, setRepeatConfig] = useState(() =>

    normalizeRepeatConfig(

      initialValues?.repeatConfig,

      anchorDate,

      initialRepeat

    )

  );

  const [color, setColor] = useState<string>(

    initialValues?.color ?? COLOR_OPTIONS[0]

  );

  const [icon, setIcon] = useState<ScheduleIconType>(

    initialValues?.icon ?? 'none'

  );

  const [showRepeat, setShowRepeat] = useState(false);

  const [showIcon, setShowIcon] = useState(false);

  const [showColor, setShowColor] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState('');



  const isEditMode = Boolean(initialValues);

  const selectedRepeatLabel = formatRepeatSummary(repeat, repeatConfig);



  function handleRepeatChange(next: RepeatType) {

    setRepeat(next);

    setRepeatConfig(createDefaultRepeatConfig(anchorDate, next));

  }



  // 달력 날짜 변경 시 매월·매년·매주 패턴 동기화

  useEffect(() => {

    if (repeat === 'none') return;

    setRepeatConfig((prev) =>

      syncRepeatConfigWithAnchorDate(prev, anchorDate, repeat)

    );

  }, [anchorDate, repeat]);



  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault();

    if (!title.trim()) return;



    setSubmitting(true);

    setError('');



    const payload: ScheduleFormData = {

      title: title.trim(),

      repeat,

      color,

      icon,

      repeatConfig:

        repeat === 'none'

          ? undefined

          : normalizeRepeatConfig(repeatConfig, anchorDate, repeat),

    };



    try {

      await onSubmit(payload);

      if (!isEditMode) {

        setTitle('');

        setRepeat('none');

        setRepeatConfig(createDefaultRepeatConfig(anchorDate, 'none'));

        setColor(COLOR_OPTIONS[0]);

        setIcon('none');

        setShowRepeat(false);

        setShowIcon(false);

        setShowColor(false);

      }

    } catch (err) {

      setError(err instanceof Error ? err.message : '저장 실패');

    } finally {

      setSubmitting(false);

    }

  }



  async function handleDelete() {

    if (!onDelete) return;



    setSubmitting(true);

    setError('');



    try {

      await onDelete();

    } catch (err) {

      setError(err instanceof Error ? err.message : '삭제 실패');

      setSubmitting(false);

    }

  }



  return (

    <form className="schedule-form" onSubmit={handleSubmit}>

      <input

        type="text"

        className="schedule-form-title"

        value={title}

        onChange={(e) => setTitle(e.target.value)}

        placeholder="일정을 입력하세요"

        disabled={submitting}

      />



      {/* 아이콘 선택 — 제목 앞 emoji */}

      <button

        type="button"

        className="schedule-form-row"

        onClick={() => setShowIcon((prev) => !prev)}

      >

        <span>아이콘</span>

        <span className="row-value">

          {hasScheduleIcon(icon) && (
            getScheduleIconImage(icon) ? (
              <img
                src={getScheduleIconImage(icon)}
                alt=""
                className="icon-preview-img"
              />
            ) : (
              <span className="icon-preview">{getScheduleIconEmoji(icon)}</span>
            )
          )}

          {getScheduleIconLabel(icon)} &gt;

        </span>

      </button>

      {showIcon && (

        <div className="schedule-form-options">

          <p className="options-label">아이콘</p>

          <div className="icon-options">

            {SCHEDULE_ICON_OPTIONS.map((opt) => (

              <button

                key={opt.value}

                type="button"

                className={`icon-chip${icon === opt.value ? ' active' : ''}`}

                onClick={() => setIcon(opt.value)}

                aria-label={opt.label}

              >

                <span className="icon-chip-emoji">

                  {opt.value === 'none' ? (
                    '—'
                  ) : opt.image ? (
                    <img src={opt.image} alt="" className="icon-chip-img" />
                  ) : (
                    opt.emoji
                  )}

                </span>

                <span className="icon-chip-label">{opt.label}</span>

              </button>

            ))}

          </div>

        </div>

      )}



      {/* 반복 설정 — > 클릭 시 옵션 펼침 */}

      <button

        type="button"

        className="schedule-form-row"

        onClick={() => setShowRepeat((prev) => !prev)}

      >

        <span>반복</span>

        <span className="row-value">{selectedRepeatLabel} &gt;</span>

      </button>

      {showRepeat && (

        <div className="schedule-form-options">

          <RepeatSettings

            anchorDate={anchorDate}

            repeat={repeat}

            config={repeatConfig}

            onRepeatChange={handleRepeatChange}

            onConfigChange={setRepeatConfig}

          />

        </div>

      )}



      {/* 색상 설정 */}

      <button

        type="button"

        className="schedule-form-row"

        onClick={() => setShowColor((prev) => !prev)}

      >

        <span>색상</span>

        <span className="row-value">

          <span className="color-preview" style={{ backgroundColor: color }} />

          &gt;

        </span>

      </button>

      {showColor && (

        <div className="schedule-form-options">

          <p className="options-label">색상</p>

          <div className="color-options">

            {COLOR_OPTIONS.map((opt) => (

              <button

                key={opt}

                type="button"

                className={`color-chip${color === opt ? ' active' : ''}`}

                style={{ backgroundColor: opt }}

                aria-label={`색상 ${opt}`}

                onClick={() => setColor(opt)}

              />

            ))}

          </div>

        </div>

      )}



      <div className="schedule-form-actions">

        {onDelete && (

          <button

            type="button"

            className="btn-delete"

            onClick={handleDelete}

            disabled={submitting}

          >

            삭제

          </button>

        )}

        {onCancel && (

          <button type="button" className="btn-cancel" onClick={onCancel}>

            취소

          </button>

        )}

        <button

          type="submit"

          className="btn-submit"

          disabled={submitting || !title.trim()}

        >

          {submitLabel}

        </button>

      </div>



      {error && <p className="schedule-form-error">{error}</p>}

    </form>

  );

}

