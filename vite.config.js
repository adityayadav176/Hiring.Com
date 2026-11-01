import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  oxc: {
    drop: ['debugger'],
    pure: [
      'console.log',
      'console.debug',
      'console.info',
    ],
  },
})