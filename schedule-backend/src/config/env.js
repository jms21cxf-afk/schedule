// 환경 변수·상수 — PORT, MongoDB URI 등
import 'dotenv/config';

export const PORT = Number(process.env.PORT) || 5000;

const LOCAL_URI = 'mongodb://127.0.0.1:27017/schedule';

/** Render·배포 환경 — Atlas URI 필수 */
function resolveMongoUri() {
  const uri = process.env.MONGODB_URI ?? process.env.MONGO_URI;
  if (uri) return uri;

  if (process.env.RENDER || process.env.NODE_ENV === 'production') {
    throw new Error(
      'MONGODB_URI 환경 변수가 없습니다. Render Environment에 Atlas URI를 등록하세요.'
    );
  }

  return LOCAL_URI;
}

export const MONGODB_URI = resolveMongoUri();
