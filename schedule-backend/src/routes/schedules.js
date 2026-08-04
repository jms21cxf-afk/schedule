// 일정 API 라우터 — 생성 등 CRUD 엔드포인트
import { Router } from 'express';
import { Schedule } from '../models/Schedule.js';
import { normalizeDate } from '../utils/normalizeDate.js';
import { normalizeRepeatConfig } from '../utils/normalizeRepeatConfig.js';
import { expandSchedulesForMonth } from '../logic/expandRepeats.js';

const router = Router();

// GET /api/schedules?year=2026&month=7 — 해당 월 일정 목록
router.get('/', async (req, res) => {
  try {
    const year = Number(req.query.year);
    const month = Number(req.query.month);

    if (!year || !month || month < 1 || month > 12) {
      return res.status(400).json({ message: 'year, month(1~12)는 필수입니다.' });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    // 반복 일정 — 시작일이 조회 월 이전이어도 해당 월에 펼침
    const schedules = await Schedule.find({
      $or: [
        { date: { $gte: start, $lt: end } },
        { repeat: { $nin: ['none', null] }, date: { $lt: end } },
      ],
    }).sort({ date: 1, createdAt: 1 });

    const expanded = expandSchedulesForMonth(schedules, year, month);

    res.json(expanded);
  } catch (error) {
    console.error('일정 조회 오류:', error);
    res.status(500).json({ message: '일정 조회에 실패했습니다.' });
  }
});

// POST /api/schedules — 일정 생성
router.post('/', async (req, res) => {
  try {
    const { title, date, repeat = 'none', repeatConfig, color = '#333333', icon = 'none' } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: '일정 제목은 필수입니다.' });
    }
    if (!date) {
      return res.status(400).json({ message: '일정 날짜는 필수입니다.' });
    }

    const normalizedDate = normalizeDate(date);
    if (!normalizedDate) {
      return res.status(400).json({ message: '유효하지 않은 날짜입니다.' });
    }

    const schedule = await Schedule.create({
      title: title.trim(),
      date: normalizedDate,
      repeat,
      repeatConfig: normalizeRepeatConfig(repeat, repeatConfig),
      color,
      icon,
    });

    res.status(201).json(schedule);
  } catch (error) {
    // Mongoose 스키마 검증 실패
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors)
        .map((e) => e.message)
        .join(', ');
      return res.status(400).json({ message });
    }

    console.error('일정 생성 오류:', error);
    res.status(500).json({ message: '일정 생성에 실패했습니다.' });
  }
});

// PATCH /api/schedules/:id — 일정 수정
router.patch('/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: '일정을 찾을 수 없습니다.' });
    }

    const { title, date, repeat, repeatConfig, color, icon } = req.body;

    if (title !== undefined) {
      if (!title?.trim()) {
        return res.status(400).json({ message: '일정 제목은 필수입니다.' });
      }
      schedule.title = title.trim();
    }

    if (date !== undefined) {
      const normalizedDate = normalizeDate(date);
      if (!normalizedDate) {
        return res.status(400).json({ message: '유효하지 않은 날짜입니다.' });
      }
      schedule.date = normalizedDate;
    }

    if (repeat !== undefined) {
      schedule.repeat = repeat;
      if (repeat === 'none') {
        schedule.repeatConfig = undefined;
      }
    }
    if (repeatConfig !== undefined || repeat !== undefined) {
      const nextRepeat = repeat ?? schedule.repeat;
      schedule.repeatConfig = normalizeRepeatConfig(
        nextRepeat,
        repeatConfig ?? schedule.repeatConfig
      );
    }
    if (color !== undefined) schedule.color = color;
    if (icon !== undefined) schedule.icon = icon;

    await schedule.save();
    res.json(schedule);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors)
        .map((e) => e.message)
        .join(', ');
      return res.status(400).json({ message });
    }

    console.error('일정 수정 오류:', error);
    res.status(500).json({ message: '일정 수정에 실패했습니다.' });
  }
});

// DELETE /api/schedules/:id — 일정 삭제
router.delete('/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: '일정을 찾을 수 없습니다.' });
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('일정 삭제 오류:', error);
    res.status(500).json({ message: '일정 삭제에 실패했습니다.' });
  }
});

export default router;
