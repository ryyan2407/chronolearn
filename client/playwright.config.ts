import { defineConfig, devices } from "@playwright/test";

const backendPort = 4002;
const frontendPort = 4175;

export default defineConfig({
  testDir: "./e2e",
  timeout: 120_000,
  expect: {
    timeout: 10_000
  },
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: `http://127.0.0.1:${frontendPort}`,
    headless: true,
    trace: "on-first-retry",
    viewport: {
      width: 1440,
      height: 1100
    }
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"]
      }
    }
  ],
  webServer: [
    {
      command: `PORT=${backendPort} GROQ_API_KEY= GROQ_API_KEYS= CORS_ORIGINS=http://127.0.0.1:${frontendPort},http://localhost:${frontendPort} npm run dev`,
      url: `http://127.0.0.1:${backendPort}/health`,
      reuseExistingServer: !process.env.CI,
      cwd: "../server",
      timeout: 120_000
    },
    {
      command: `VITE_API_BASE_URL=http://127.0.0.1:${backendPort}/api npm run dev -- --host 127.0.0.1 --port ${frontendPort}`,
      url: `http://127.0.0.1:${frontendPort}`,
      reuseExistingServer: !process.env.CI,
      cwd: ".",
      timeout: 120_000
    }
  ]
});
