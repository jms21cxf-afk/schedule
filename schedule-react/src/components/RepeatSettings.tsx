// 반복 상세 UI — 주기·요일(매주)·매월 n번째 요일·반복 종료
import type { RepeatType } from '../types/schedule';
import { REPEAT_OPTIONS } from '../types/schedule';
import {
  WEEKDAY_OPTIONS,
  formatMonthWeekdayLabel,
  formatYearDateLabel,
  formatYearNthWeekdayLabel,
  getMonthWeekdayFromDate,
  getYearlyFromDate,
  type RepeatConfig,
} from '../types/repeat';
import './RepeatSettings.css';

interface RepeatSettingsProps {
  anchorDate: Date;
  repeat: RepeatType;
  config: RepeatConfig;
  onRepeatChange: (repeat: RepeatType) => void;
  onConfigChange: (config: RepeatConfig) => void;
}

const INTERVAL_SUFFIX: Record<Exclude<RepeatType, 'none'>, string> = {
  daily: '일마다',
  weekly: '주마다',
  monthly: '개월마다',
  yearly: '년마다',
};

export default function RepeatSettings({
  anchorDate,
  repeat,
  config,
  onRepeatChange,
  onConfigChange,
}: RepeatSettingsProps) {
  const showDetail = repeat !== 'none';
  const endLabel =
    config.endType === 'date' && config.endDate
      ? config.endDate
      : '없음';

  // 매월 — 선택 날짜 기준 n번째 요일
  const monthWeekdayLabel = (() => {
    const { ordinal, weekday } = getMonthWeekdayFromDate(anchorDate);
    const o = config.monthOrdinal ?? ordinal;
    const w = config.monthWeekday ?? weekday;
    return formatMonthWeekdayLabel(o, w);
  })();

  // 매년 — 8월 1일 / 8월 1번째 토요일
  const yearlyFromAnchor = getYearlyFromDate(anchorDate);
  const yearMonth = config.yearMonth ?? yearlyFromAnchor.yearMonth;
  const yearDay = config.yearDay ?? yearlyFromAnchor.yearDay;
  const yearOrdinal = config.yearOrdinal ?? yearlyFromAnchor.yearOrdinal;
  const yearWeekday = config.yearWeekday ?? yearlyFromAnchor.yearWeekday;
  const yearlyDateLabel = formatYearDateLabel(yearMonth, yearDay);
  const yearlyNthLabel = formatYearNthWeekdayLabel(
    yearMonth,
    yearOrdinal,
    yearWeekday
  );
  const yearlyMode = config.yearlyMode ?? 'date';

  function updateConfig(partial: Partial<RepeatConfig>) {
    onConfigChange({ ...config, ...partial });
  }

  function toggleWeekday(day: number) {
    const has = config.weekdays.includes(day);
    const weekdays = has
      ? config.weekdays.filter((d) => d !== day)
      : [...config.weekdays, day].sort((a, b) => {
          const order = WEEKDAY_OPTIONS.map((w) => w.value);
          return order.indexOf(a) - order.indexOf(b);
        });
    updateConfig({ weekdays });
  }

  function changeInterval(delta: number) {
    updateConfig({ interval: Math.min(99, Math.max(1, config.interval + delta)) });
  }

  return (
    <div className="repeat-settings">
      {/* 반복 주기 칩 — 없음 · 매일 · 매주 … */}
      <div className="repeat-options">
        {REPEAT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`option-chip${repeat === opt.value ? ' active' : ''}`}
            onClick={() => onRepeatChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {showDetail && (
        <>
          {/* N주마다 / N일마다 … */}
          <div className="repeat-interval-row">
            <span className="repeat-interval-label">
              {config.interval}
              {INTERVAL_SUFFIX[repeat]}
            </span>
            <div className="repeat-interval-controls">
              <button
                type="button"
                className="interval-btn"
                onClick={() => changeInterval(-1)}
                disabled={config.interval <= 1}
                aria-label="간격 줄이기"
              >
                −
              </button>
              <span className="interval-value">{config.interval}</span>
              <button
                type="button"
                className="interval-btn"
                onClick={() => changeInterval(1)}
                disabled={config.interval >= 99}
                aria-label="간격 늘리기"
              >
                +
              </button>
            </div>
          </div>

          {/* 매주 — 요일 선택 */}
          {repeat === 'weekly' && (
            <div className="repeat-weekdays">
              {WEEKDAY_OPTIONS.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  className={`weekday-chip${
                    config.weekdays.includes(day.value) ? ' active' : ''
                  }`}
                  onClick={() => toggleWeekday(day.value)}
                >
                  {day.label}
                </button>
              ))}
            </div>
          )}

          {/* 매월 — 선택한 날짜의 n번째 요일 */}
          {repeat === 'monthly' && (
            <p className="repeat-pattern-label">{monthWeekdayLabel}</p>
          )}

          {/* 매년 — 날짜 / n번째 요일 */}
          {repeat === 'yearly' && (
            <div className="repeat-yearly-options">
              <button
                type="button"
                className={`repeat-yearly-option${
                  yearlyMode === 'date' ? ' active' : ''
                }`}
                onClick={() => updateConfig({ yearlyMode: 'date' })}
              >
                {yearlyDateLabel}
              </button>
              <button
                type="button"
                className={`repeat-yearly-option${
                  yearlyMode === 'nthWeekday' ? ' active' : ''
                }`}
                onClick={() => updateConfig({ yearlyMode: 'nthWeekday' })}
              >
                {yearlyNthLabel}
              </button>
            </div>
          )}

          {/* 반복 종료 */}
          <details className="repeat-end-details">
            <summary className="repeat-end-summary">
              <span>반복종료</span>
              <span className="repeat-end-value">{endLabel} &gt;</span>
            </summary>
            <div className="repeat-end-body">
              <div className="repeat-end-options">
                <button
                  type="button"
                  className={`option-chip${
                    config.endType === 'never' ? ' active' : ''
                  }`}
                  onClick={() =>
                    updateConfig({ endType: 'never', endDate: undefined })
                  }
                >
                  없음
                </button>
                <button
                  type="button"
                  className={`option-chip${
                    config.endType === 'date' ? ' active' : ''
                  }`}
                  onClick={() => updateConfig({ endType: 'date' })}
                >
                  날짜 지정
                </button>
              </div>
              {config.endType === 'date' && (
                <input
                  type="date"
                  className="repeat-end-date"
                  value={config.endDate ?? ''}
                  onChange={(e) => updateConfig({ endDate: e.target.value })}
                />
              )}
            </div>
          </details>
        </>
      )}
    </div>
  );
}
