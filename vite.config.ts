import { localApiPlugin } from './vite-plugin-local-api.ts'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), localApiPlugin()],
})
