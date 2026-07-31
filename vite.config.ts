import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change `base` to match your GitHub Pages repo name.
// For https://<user>.github.io/bad-copy/ this must be '/bad-copy/'.
export default defineConfig({
  plugins: [react()],
  base: '/badcopy/',
})
