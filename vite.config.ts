import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  // import.meta.env.VITE_PORT available here with: process.env.VITE_PORT
  return defineConfig({
    plugins: [
      react({
        babel: {
          plugins: [
            [
              '@locator/babel-jsx/dist',
              {
                env: 'development',
              },
            ],
          ],
        },
      }),
    ],
    css: {
      postcss: './postcss.config.js',
    },
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    },
    server: {
      port: parseInt(process.env.VITE_PORT),
      host: true,
      hmr: { path: '/hmr' },
    },
  });
};
