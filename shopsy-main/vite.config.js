import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'icons': ['react-icons'],
          'carousel': ['react-slick', 'slick-carousel'],
        }
      }
    },
    // Set chunk size warning limit
    chunkSizeWarningLimit: 500,
  }
})
