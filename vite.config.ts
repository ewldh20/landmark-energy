import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
  server: {
    port: 4050,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:4051',
        changeOrigin: true,
      },
    },
  },
})
