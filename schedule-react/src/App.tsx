// 일정 관리 앱 — 캘린더·일정 패널 조립
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CalendarHeader from './components/CalendarHeader';
import CalendarGrid from './components/CalendarGrid';
import SchedulePanel from './components/SchedulePanel';
import ScheduleFormSheet from './components/ScheduleFormSheet';
import AddScheduleFab from './components/AddScheduleFab';
import InstallPrompt from './components/InstallPrompt';
import {
  createSchedule,
  deleteSchedule,
  fetchSchedulesByMonth,
  updateSchedule,
} from './api/scheduleApi';
import type { Schedule, ScheduleFormData } from './types/schedule';
import {
  formatSelectedLabel,
  isSameDay,
  parseScheduleDate,
  toDateString,
} from './utils/dateUtils';
import { getScheduleAnchorKey } from './utils/scheduleFormUtils';
import { useMobileLayout } from './hooks/useMobileLayout';
import { useSwipeMonth } from './hooks/useSwipeMonth';
import './App.css';

/** 달력 접힘 — 스크롤 임계값 (히스테리시스로 떨림 방지) */
const CALENDAR_COLLAPSE_AT = 72;
const CALENDAR_EXPAND_AT = 16;

function App() {
  const isMobileLayout = useMobileLayout();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [isCalendarCollapsed, setIsCalendarCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const collapsedRef = useRef(false);

  const handleScroll = useCallback(() => {
    if (!isMobileLayout || collapsedRef.current) return;

    const el = scrollRef.current;
    if (!el) return;

    if (el.scrollTop >= CALENDAR_COLLAPSE_AT) {
      collapsedRef.current = true;
      setIsCalendarCollapsed(true);
    }
  }, [isMobileLayout]);

  // 접힌 상태 — 일정 영역 스크롤 맨 위면 달력 다시 펼침
  const handleBodyScroll = useCallback(() => {
    if (!isMobileLayout || !collapsedRef.current) return;

    const el = bodyRef.current;
    if (!el) return;

    if (el.scrollTop <= CALENDAR_EXPAND_AT) {
      collapsedRef.current = false;
      setIsCalendarCollapsed(false);
      scrollRef.current?.scrollTo({ top: 0 });
    }
  }, [isMobileLayout]);

  // PC로 넓혔을 때 접힘 상태 초기화
  useEffect(() => {
    if (!isMobileLayout && isCalendarCollapsed) {
      collapsedRef.current = false;
      setIsCalendarCollapsed(false);
    }
  }, [isMobileLayout, isCalendarCollapsed]);

  const loadSchedules = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchSchedulesByMonth(year, month);
      setSchedules(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '일정 조회 실패');
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  // 날짜별 일정 맵 (캘린더 셀 표시용)
  const schedulesByDay = useMemo(() => {
    const map = new Map<number, Schedule[]>();
    schedules.forEach((schedule) => {
      const date = parseScheduleDate(schedule.date);
      if (date.getFullYear() === year && date.getMonth() + 1 === month) {
        const day = date.getDate();
        const list = map.get(day) ?? [];
        list.push(schedule);
        map.set(day, list);
      }
    });
    return map;
  }, [schedules, year, month]);

  // 선택한 날짜의 일정만 필터
  const selectedSchedules = useMemo(() => {
    if (!selectedDate) return [];
    return schedules.filter((schedule) =>
      isSameDay(parseScheduleDate(schedule.date), selectedDate)
    );
  }, [schedules, selectedDate]);

  function goPrevMonth() {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
      return;
    }
    setMonth((m) => m - 1);
  }

  function goNextMonth() {
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
      return;
    }
    setMonth((m) => m + 1);
  }

  const swipeMonth = useSwipeMonth(goPrevMonth, goNextMonth, isMobileLayout);

  function handleSelectDay(day: number) {
    setSelectedDate(new Date(year, month - 1, day));
  }

  function openAddForm() {
    setEditingSchedule(null);
    setIsFormOpen(true);
  }

  function openEditForm(schedule: Schedule) {
    setEditingSchedule(schedule);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingSchedule(null);
  }

  function getSelectedDateString() {
    if (!selectedDate) return '';
    return toDateString(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      selectedDate.getDate()
    );
  }

  async function handleSaveSchedule(form: ScheduleFormData) {
    if (editingSchedule) {
      const date = getScheduleAnchorKey(editingSchedule);
      await updateSchedule(editingSchedule._id, date, form);
    } else {
      const date = getSelectedDateString();
      if (!date) return;
      await createSchedule(date, form);
    }

    await loadSchedules();
    closeForm();
  }

  async function handleDeleteSchedule() {
    if (!editingSchedule) return;
    await deleteSchedule(editingSchedule._id);
    await loadSchedules();
    closeForm();
  }

  // 데스크톱 — 패널에서 수정·추가 (시트 닫힌 상태)
  async function handlePanelSave(form: ScheduleFormData) {
    if (editingSchedule) {
      const date = getScheduleAnchorKey(editingSchedule);
      await updateSchedule(editingSchedule._id, date, form);
      setEditingSchedule(null);
    } else {
      const date = getSelectedDateString();
      if (!date) return;
      await createSchedule(date, form);
    }

    await loadSchedules();
  }

  async function handlePanelDelete() {
    if (!editingSchedule) return;
    await deleteSchedule(editingSchedule._id);
    await loadSchedules();
    setEditingSchedule(null);
  }

  return (
    <main
      className={`app${isFormOpen ? ' form-open' : ''}${isMobileLayout && isCalendarCollapsed ? ' calendar-collapsed' : ''}`}
    >
      <div
        className="app-scroll"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        <InstallPrompt />
        <div
          className={`calendar-section${isMobileLayout && isCalendarCollapsed ? ' is-collapsed' : ''}`}
          onTouchStart={swipeMonth.onTouchStart}
          onTouchEnd={swipeMonth.onTouchEnd}
        >
          <CalendarHeader
            year={year}
            month={month}
            onPrev={goPrevMonth}
            onNext={goNextMonth}
          />

          <CalendarGrid
            year={year}
            month={month}
            selectedDate={selectedDate}
            schedulesByDay={schedulesByDay}
            onSelectDay={handleSelectDay}
            compact={isMobileLayout && isCalendarCollapsed}
          />

          {/* 접힌 상태 — 선택 날짜를 달력 바로 아래 고정 표시 */}
          {isMobileLayout && isCalendarCollapsed && selectedDate && (
            <h2 className="calendar-selected-date">
              {formatSelectedLabel(selectedDate)}
            </h2>
          )}
        </div>

        <div
          className="app-body"
          ref={bodyRef}
          onScroll={handleBodyScroll}
        >
          {loading && <p className="status">불러오는 중...</p>}
          {error && <p className="status error">{error}</p>}

          <SchedulePanel
            selectedDate={selectedDate}
            schedules={selectedSchedules}
            editingSchedule={editingSchedule}
            onEdit={(schedule) => {
              if (isMobileLayout) {
                openEditForm(schedule);
              } else {
                setEditingSchedule(schedule);
              }
            }}
            onCancelEdit={() => setEditingSchedule(null)}
            onSave={handlePanelSave}
            onDelete={handlePanelDelete}
          />
        </div>
      </div>

      {/* 모바일 — 연필 FAB + 접히는 입력 패널 */}
      <AddScheduleFab
        onClick={openAddForm}
        disabled={!selectedDate}
      />
      <ScheduleFormSheet
        isOpen={isFormOpen}
        anchorDate={selectedDate}
        editingSchedule={editingSchedule}
        onClose={closeForm}
        onSubmit={handleSaveSchedule}
        onDelete={handleDeleteSchedule}
      />
    </main>
  );
}

export default App;
