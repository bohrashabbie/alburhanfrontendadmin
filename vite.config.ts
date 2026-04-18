import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const cmsTarget = env.VITE_CMS_URL || 'http://13.60.4.75:8002'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      proxy: {
        '/api': { target: cmsTarget, changeOrigin: true },
        '/uploads': { target: cmsTarget, changeOrigin: true },
      },
    },
  }
})
