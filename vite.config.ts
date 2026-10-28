
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
  },

  plugins: [
    devtools(),
    tailwindcss(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    viteReact(),

    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      includeAssets: ['favicon.ico'],
      manifest: {
        id: '/',
        name: 'Tailoring Management System',
        short_name: 'TailorHub',
        description: 'Manage customers, measurements and tailoring payments.',
        theme_color: '#6d28d9',
        background_color: '#f8fafc',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',

        screenshots: [
          {
            src: '/screenshots/mobile-home.png',
            sizes: '480x800',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Tailoring Management System on mobile',
          },
          {
            src: '/screenshots/desktop-home.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Tailoring Management System on desktop',
          },
        ],

        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },

    }),
  ],
})

export default config
