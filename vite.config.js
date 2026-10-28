import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Any request starting with /api goes to the Node backend
    proxy: { '/api': 'http://localhost:5000' },
  },
})
