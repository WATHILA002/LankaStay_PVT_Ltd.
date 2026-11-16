import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/LankaStay_PVT_Ltd/', // <--- Make sure this matches your exact repository name on GitHub!
})
