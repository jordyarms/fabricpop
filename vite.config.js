import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Exclude examples from production build
      external: [/^\/examples\//]
    }
  },
  server: {
    port: 3001,
    proxy: {
      // Proxy IGDB requests to the Node.js proxy server
      '/api/igdb': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
