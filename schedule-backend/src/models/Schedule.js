// 일정 Mongoose 스키마 — 캘린더 날짜별 할 일(제목) 저장
import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema(
  {
    // 일정 제목 (예: 영화보기)
    title: {
      type: String,
      required: [true, '일정 제목은 필수입니다.'],
      trim: true,
      maxlength: [100, '일정 제목은 100자 이내입니다.'],
    },
    // 일정 날짜 — 해당 일 00:00:00 기준 Date (캘린더·일별 목록 조회용)
    date: {
      type: Date,
      required: [true, '일정 날짜는 필수입니다.'],
    },
    // 반복 설정 — none, daily, weekly, monthly, yearly
    repeat: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'],
      default: 'none',
    },
    // 반복 상세 — 간격·요일·종료일·매월 n번째 요일
    repeatConfig: {
      interval: { type: Number, min: 1, max: 99, default: 1 },
      weekdays: { type: [Number], default: [] },
      monthOrdinal: { type: Number, min: 1, max: 5, default: null },
      monthWeekday: { type: Number, min: 0, max: 6, default: null },
      monthlyMode: { type: String, enum: ['date', 'nthWeekday'], default: null },
      monthDay: { type: Number, min: 1, max: 31, default: null },
      yearlyMode: { type: String, enum: ['date', 'nthWeekday'], default: 'date' },
      yearMonth: { type: Number, min: 1, max: 12, default: null },
      yearDay: { type: Number, min: 1, max: 31, default: null },
      yearOrdinal: { type: Number, min: 1, max: 5, default: null },
      yearWeekday: { type: Number, min: 0, max: 6, default: null },
      endType: { type: String, enum: ['never', 'date'], default: 'never' },
      endDate: { type: Date, default: null },
    },
    // 일정 표시 색상
    color: {
      type: String,
      default: '#333333',
    },
    // 일정 아이콘 — none이면 표시 안 함
    icon: {
      type: String,
      enum: [
        'none',
        'birthday',
        'important',
        'work',
        'meeting',
        'health',
        'travel',
        'shopping',
        'study',
        'reminder',
      ],
      default: 'none',
    },
  },
  {
    timestamps: true,
    collection: 'schedules',
  }
);

// 같은 날짜 일정 여러 개 가능 — date 기준 월별·일별 조회
scheduleSchema.index({ date: 1 });

export const Schedule = mongoose.model('Schedule', scheduleSchema);
