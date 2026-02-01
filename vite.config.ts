// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['@tma.js/sdk'],  // ← Вот это главное! Делаем пакет внешним
    },
  },
})