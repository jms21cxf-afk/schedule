import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 같은 Wi‑Fi 폰에서 PC IP로 접속 가능하게
    host: true,
    port: 5173,
    // 폰은 5173만 열면 됨 — /api 요청을 PC의 백엔드(5000)로 전달
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: true,
    port: 5173,
  },
})
