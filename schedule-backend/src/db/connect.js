// MongoDB 연결 — mongoose connect 및 성공 로그
import dns from 'dns';
import mongoose from 'mongoose';
import { MONGODB_URI } from '../config/env.js';

// Windows·일부 ISP DNS는 mongodb+srv SRV 조회를 거부함 → 공용 DNS 사용
dns.setServers(['8.8.8.8', '1.1.1.1']);

export async function connectDb() {
  await mongoose.connect(MONGODB_URI);
  console.log('연결성공');
}
