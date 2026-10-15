import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        id: '/',
        name: 'Ihsanly – Muslim Daily',
        short_name: 'Ihsanly',
        description: 'Ihsanly – Muslim Daily hadir sebagai teman harian muslim dengan Al-Qur’an, hadits, doa, dzikir, jadwal sholat, serta inspirasi Islami yang menenangkan hati.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        display_override: ['standalone', 'window-controls-overlay'],
        background_color: '#ffffff',
        theme_color: '#ffffff',
        orientation: 'portrait',
        lang: 'id',
        dir: 'ltr',
        categories: ['education', 'books', 'utilities', 'lifestyle'],
        icons: [
          {
            src: '/icons/icon-192-maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          }
        ]
      }
    })
  ]
})
