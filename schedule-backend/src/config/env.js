// 환경 변수·상수 — PORT, MongoDB URI 등
import 'dotenv/config';

export const PORT = Number(process.env.PORT) || 5000;
export const MONGODB_URI =
  process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/schedule';
