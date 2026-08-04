// 캘린더 그리드 — 요일·날짜·셀 안 일정 표시
import { WEEKDAYS, buildCalendarCells, isSameDay } from '../utils/dateUtils';
import { getHolidayName } from '../utils/koreanHolidays';
import ScheduleIconMark from './ScheduleIconMark';
import type { Schedule } from '../types/schedule';
import './CalendarGrid.css';

interface CalendarGridProps {
  year: number;
  month: number;
  selectedDate: Date | null;
  schedulesByDay: Map<number, Schedule[]>;
  onSelectDay: (day: number) => void;
  /** true — 모든 주 동일한 작은 세로 높이 (접힌 상태) */
  compact?: boolean;
}

export default function CalendarGrid({
  year,
  month,
  selectedDate,
  schedulesByDay,
  onSelectDay,
  compact = false,
}: CalendarGridProps) {
  const cells = buildCalendarCells(year, month);
  const today = new Date();
  const totalRows = Math.ceil(cells.length / 7);

  /** 날짜 색상 — 공휴일 > 오늘 > 주말 */
  function getDayNumClass(
    cellDate: Date,
    isToday: boolean,
    holidayName: string | null
  ): string {
    if (holidayName) return 'holiday';
    if (isToday) return 'today';
    const weekday = cellDate.getDay();
    if (weekday === 0) return 'sunday';
    if (weekday === 6) return 'saturday';
    return '';
  }

  return (
    <table className={`calendar-grid${compact ? ' compact' : ''}`}>
      <thead>
        <tr>
          {WEEKDAYS.map((day, index) => (
            <th
              key={day}
              className={
                index === 0 ? 'sunday' : index === 6 ? 'saturday' : undefined
              }
            >
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: totalRows }, (_, rowIndex) => (
          <tr key={rowIndex}>
            {cells.slice(rowIndex * 7, rowIndex * 7 + 7).map((day, colIndex) => {
              const cellKey = `${rowIndex}-${colIndex}`;
              if (day === null) {
                return <td key={cellKey} />;
              }

              const cellDate = new Date(year, month - 1, day);
              const holidayName = getHolidayName(cellDate);
              const isSelected =
                selectedDate !== null && isSameDay(cellDate, selectedDate);
              const isToday = isSameDay(cellDate, today);
              const dayNumClass = getDayNumClass(cellDate, isToday, holidayName);
              const daySchedules = schedulesByDay.get(day) ?? [];

              return (
                <td key={cellKey}>
                  <button
                    type="button"
                    className={`day-btn${isSelected ? ' selected' : ''}`}
                    onClick={() => onSelectDay(day)}
                  >
                    <div className="day-num-row">
                      <span className={`day-num ${dayNumClass}`}>{day}</span>
                      {!compact && isToday && (
                        <span className="today-label">오늘</span>
                      )}
                    </div>
                    {!compact && holidayName && (
                      <span className="holiday-label" title={holidayName}>
                        {holidayName}
                      </span>
                    )}
                    {/* 접힌 상태에서는 셀 안 일정 숨김 — 아래 목록에서 표시 */}
                    {!compact && daySchedules.length > 0 && (
                      <ul className="day-schedules">
                        {daySchedules.map((schedule) => (
                          <li
                            key={schedule._id}
                            className="day-schedule-item"
                            style={{ color: schedule.color ?? '#333' }}
                          >
                            <ScheduleIconMark icon={schedule.icon} />
                            <span className="day-schedule-title">{schedule.title}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </button>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
