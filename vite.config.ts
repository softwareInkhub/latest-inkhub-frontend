import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'https://a4ogr54nnbzbejlk2yygldikh40yqdep.lambda-url.ap-south-1.on.aws',
        changeOrigin: true
      }
    }
  }
}) 