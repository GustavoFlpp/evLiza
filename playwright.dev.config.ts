import { defineConfig } from '@playwright/test';
import productionConfig from './playwright.config';
export default defineConfig({
  ...productionConfig,
  timeout: 90000,
  outputDir: 'artifacts/dev-browser-results',
  webServer: {
    command: 'npm run dev -- --port 3000',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: true,
    timeout: 90000,
  },
  use: { ...productionConfig.use, baseURL: 'http://127.0.0.1:3000' },
});
