import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // React + GSAP + Motion ship as one ~180 kB gzip bundle; that's expected for this page.
    chunkSizeWarningLimit: 700,
  },
})
