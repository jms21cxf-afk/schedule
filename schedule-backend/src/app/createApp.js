// Express 앱 생성 — 미들웨어·라우트 등록
import express from 'express';
import cors from 'cors';
import healthRouter from '../routes/health.js';
import schedulesRouter from '../routes/schedules.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use('/api/health', healthRouter);
  app.use('/api/schedules', schedulesRouter);

  return app;
}
