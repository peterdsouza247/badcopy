import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base. Works at any repo name, on a custom domain, and when opening
// the built dist folder directly. Safe here because there is no client side
// router. If one is ever added, switch to an explicit '/<repo-name>/'.
export default defineConfig({
  plugins: [react()],
  base: './',
})
