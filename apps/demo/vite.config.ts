import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

const ui = (p: string) => fileURLToPath(new URL(`../../packages/ui/src/${p}`, import.meta.url))

// In dev the demo consumes the kit straight from source (HMR, no rebuild).
// A real consumer just installs `nusa-admin` and imports `nusa-admin/style.css`.
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      { find: /^nusa-admin\/style\.css$/, replacement: ui('styles/index.css') },
      { find: /^nusa-admin$/, replacement: ui('index.ts') },
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
    ],
  },
})
