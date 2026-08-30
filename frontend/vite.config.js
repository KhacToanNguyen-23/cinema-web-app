import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // [AI UPDATE - Polyfill bien global cho thu vien sockjs-client tuong thich voi moi truong Vite]
  define: {
    global: 'window',
  },
})

