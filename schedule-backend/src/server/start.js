// HTTP 서버 시작 — 0.0.0.0 바인딩으로 같은 Wi‑Fi 폰 접속 허용
import { getLanAddresses } from '../utils/getLanAddresses.js';

const HOST = '0.0.0.0';

function logPhoneAccessHint(port) {
  const lan = getLanAddresses();

  console.log('');
  console.log('── 폰 접속 (같은 Wi‑Fi) ──');
  console.log('프론트(Vite) Network 주소로 접속하세요. API는 Vite가 대신 연결합니다.');
  console.log(`예: http://<PC IP>:5173  (백엔드 ${port} 포트는 폰에서 직접 열 필요 없음)`);

  if (lan.length === 0) {
    console.log('LAN IP를 찾지 못했습니다. ipconfig 로 IPv4 주소를 확인하세요.');
  } else {
    for (const { name, address } of lan) {
      console.log(`  · ${address}  (${name})  →  http://${address}:5173`);
    }
  }

  console.log('');
}

export function startServer(app, port) {
  const server = app.listen(port, HOST, () => {
    console.log(`schedule-backend listening on http://localhost:${port}`);
    logPhoneAccessHint(port);
  });

  // 포트 충돌 등 listen 실패 시 명확한 메시지 출력
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(
        `포트 ${port}이(가) 이미 사용 중입니다. 기존 서버를 종료한 뒤 다시 실행해 주세요.`
      );
      process.exit(1);
    }

    throw error;
  });

  return server;
}
