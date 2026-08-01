// 헬스체크 라우트 — 서버·Node.js 동작 확인용
import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ ok: true, message: 'schedule-backend is running' });
});

export default router;
