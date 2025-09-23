import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 3000,
    strictPort: true,
    proxy: {
      '/identitytoolkit': {
        target: 'http://localhost:9099',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})