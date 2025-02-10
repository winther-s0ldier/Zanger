import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server:{
    port:process.env.PORT || 5173,
    host:'0.0.0.0'
    
  },
  plugins: [react()],
})
