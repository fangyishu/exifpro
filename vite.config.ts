/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'

const landingPagePlugin = () => {
  let config: any;
  return {
    name: 'landing-page-html-transform',
    configResolved(resolvedConfig: any) {
      config = resolvedConfig;
    },
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        // Simple regex to catch locale paths like /en/ or /zh-CN/
        if (req.url && !req.url.startsWith('/@') && !req.url.includes('.')) {
          const match = req.url.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)\/?$/);
          if (match) {
            const lang = match[1];
            if (fs.existsSync(resolve(__dirname, `locales/landing/${lang}.json`))) {
              req.url = '/index.html?lang=' + lang;
            }
          }
        }
        next();
      });
    },
    transformIndexHtml: {
      order: 'pre' as const,
      handler(html: string, ctx: { path: string, originalUrl?: string }) {
        if (ctx.path !== '/index.html' && ctx.path !== '/') {
          return html;
        }

        try {
          let lang = 'en'; // Default to English for build

          // During dev, detect language from URL
          if (config.command === 'serve') {
            const urlObj = ctx.originalUrl ? new URL(ctx.originalUrl, 'http://localhost') : null;

            if (urlObj) {
              const match = urlObj.pathname.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)\/?$/);
              if (match && fs.existsSync(resolve(__dirname, `locales/landing/${match[1]}.json`))) {
                lang = match[1];
              }
              if (urlObj.searchParams.get('lang')) {
                lang = urlObj.searchParams.get('lang')!;
              }
            }
          }

          const localePath = resolve(__dirname, `locales/landing/${lang}.json`);
          if (!fs.existsSync(localePath)) {
            console.warn(`Locale file not found for ${lang}, falling back to en`);
          }
          const finalLocalePath = fs.existsSync(localePath) ? localePath : resolve(__dirname, 'locales/landing/en.json');

          if (fs.existsSync(finalLocalePath)) {
            const localeData = JSON.parse(fs.readFileSync(finalLocalePath, 'utf-8'));

            const flatten = (obj: any, prefix = '') => {
              return Object.keys(obj).reduce((acc: any, k) => {
                const pre = prefix.length ? prefix + '.' : '';
                if (typeof obj[k] === 'object' && obj[k] !== null) {
                  Object.assign(acc, flatten(obj[k], pre + k));
                } else {
                  acc[pre + k] = obj[k];
                }
                return acc;
              }, {});
            };

            const replacements = flatten(localeData);
            let newHtml = html;
            for (const [key, value] of Object.entries(replacements)) {
              newHtml = newHtml.split(`%${key}%`).join(String(value));
            }

            newHtml = newHtml.replace('<html lang="zh-CN">', `<html lang="${lang}">`);
            newHtml = newHtml.replace('<html lang="en">', `<html lang="${lang}">`);

            return newHtml;
          }
          return html;
        } catch (e) {
          console.error("Error transforming HTML:", e);
          return html;
        }
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), landingPagePlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        app: resolve(__dirname, 'app/index.html'),
      },
    },
  },
})
