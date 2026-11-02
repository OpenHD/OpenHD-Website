import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir: './tests', testMatch: '**/bugs.spec.ts', timeout: 30000,
  use: {baseURL: 'http://127.0.0.1:3017', trace: 'retain-on-failure'},
  projects: [
    {name: 'desktop', use: {viewport: {width: 1440, height: 1000}, colorScheme: 'light'}},
    {name: 'mobile-dark', use: {viewport: {width: 390, height: 844}, colorScheme: 'dark'}},
  ],
  webServer: {command: 'pnpm exec docusaurus serve --host 127.0.0.1 --port 3017 --no-open', url: 'http://127.0.0.1:3017/bugs', reuseExistingServer: false, timeout: 120000},
});
