import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { Buffer } from 'node:buffer'
import process from 'node:process'

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [vue(), vueDevTools(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'https://cwe.salesbinder.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy) => {
            // Add basic auth header
            const auth = Buffer.from(
              `${env.VITE_SALESBINDER_API_KEY}:${env.VITE_SALESBINDER_PASSWORD}`,
            ).toString('base64')
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Authorization', `Basic ${auth}`)
            })
          },
        },
      },
    },
  }
})
