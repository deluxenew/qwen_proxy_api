import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import fs from 'node:fs'

function backendPort(): number {
  try {
    const env = fs.readFileSync(path.resolve(__dirname, '../.env'), 'utf-8')
    const line = env.split('\n').map(l => l.trim()).find(l => l.startsWith('PORT='))
    if (line) {
      const n = Number(line.split('=')[1])
      if (Number.isInteger(n)) return n
    }
  } catch { /* no .env, use default */ }
  return 3000
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/admin/',
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/admin/api': {
        target: `http://127.0.0.1:${process.env.PORT || backendPort()}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        advancedChunks: {
          groups: [
            {
              name: 'react',
              test: /\/node_modules\/(react|react-dom)\//
            },
            {
              name: 'charts',
              test: /\/node_modules\/recharts\//
            },
            {
              name: 'radix',
              test: /\/node_modules\/@radix-ui\/(react-dialog|react-select|react-switch|react-tabs)\//
            }
          ]
        }
      }
    }
  }
})