import { localApiPlugin } from './vite-plugin-local-api'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), localApiPlugin()],
  server: {
    headers: {
      'Permissions-Policy': 'camera=(self), microphone=(self)',
    },
  },
})
