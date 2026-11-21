import { defineConfig, devices } from '@playwright/test'

const deployedUrl = process.env.PLAYWRIGHT_BASE_URL

export default defineConfig({
  testDir: './tests/e2e', fullyParallel: false,
  use: { baseURL: deployedUrl || 'http://127.0.0.1:3006', channel: 'chrome', launchOptions: { chromiumSandbox: true }, screenshot: 'only-on-failure' },
  projects: [{ name: 'desktop', use: { ...devices['Desktop Chrome'] } }, { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } }],
  webServer: deployedUrl ? undefined : { command: 'pnpm dev', url: 'http://127.0.0.1:3006', reuseExistingServer: !process.env.CI },
})
