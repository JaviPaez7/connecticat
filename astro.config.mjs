// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

// https://astro.build/config
export default defineConfig({
  site: 'https://connecticat.javistudio.dev',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [react()],
  // Behind Traefik, Origin (https) can disagree with the internal request URL (http).
  // Browser uploads would otherwise get 403 "Cross-site POST form submissions are forbidden".
  security: {
    checkOrigin: false,
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});

