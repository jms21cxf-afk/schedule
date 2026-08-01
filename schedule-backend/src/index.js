// 서버 진입점 — DB 연결 → 앱 생성 → 서버 시작 흐름만 담당
import { PORT } from './config/env.js';
import { connectDb } from './db/connect.js';
import { createApp } from './app/createApp.js';
import { startServer } from './server/start.js';

async function main() {
  await connectDb();
  const app = createApp();
  startServer(app, PORT);
}

main().catch((error) => {
  console.error('MongoDB 연결 실패:', error.message);
  process.exit(1);
});
