import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Bind to all network interfaces
    port: 3000,
    open: false // Don't auto-open browser on VPS
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})