import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      plugins: [
        ['@swc/plugin-styled-components', { displayName: false, ssr: true }],
      ],
    }),
  ],
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
      { find: '#', replacement: resolve(__dirname, 'src/components') },
    ],
  },
  base: '/NSYSUSelectorHelper/',
});
