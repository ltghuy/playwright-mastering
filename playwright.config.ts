import { defineConfig, devices } from "@playwright/test";

/**
 * Central config — this is the "control panel" for the whole suite.
 * Maps to the wiki: Phase 2 · "Test structure & config" (week 7).
 * Docs: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",

  // The site under test. `page.goto("/")` and relative URLs resolve against this.
  use: {
    baseURL: "https://sky-muzik.vercel.app",

    // Capture a trace on the first retry so failures always leave something to replay
    // with `npx playwright show-trace`. (Wiki: Phase 2 · Debugging tools.)n
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",

    // This is a real, remote site behind a CDN with async/skeleton loading.
    // Give actions and navigations a little breathing room.
    actionTimeout: 15_000,
    navigationTimeout: 30_000,

    locale: "vi-VN",

    // Slow every action down so a headed run is watchable step-by-step. Note:
    // slowMo only pauses before *actions* (click/fill/press), not assertions —
    // to linger on the final UI state after a test's last expect(), see the
    // HOLD env var and the holdAfterTest fixture in fixtures/base.ts.
    // Off by default (fast); the `test:headed` script sets SLOWMO=1500 (ms).
    launchOptions: {
      slowMo: process.env.SLOWMO ? Number(process.env.SLOWMO) : 0,
    },
  },

  // A single expect() should wait up to this long for a web-first assertion to pass.
  // The home feed hydrates from a separate serverless backend (sky-muzik-be.vercel.app),
  // which cold-starts and has been measured taking ~10s to return /api/home. 10s here
  // left the "Top 100" heading assertion racing the API and failing the whole suite at
  // HomePage.goto(); 30s matches navigationTimeout and absorbs those cold starts.
  expect: { timeout: 30_000 },

  // Per-test budget. MUST be comfortably larger than expect.timeout above: a single
  // slow goto() can spend up to 30s waiting for the Top 100 heading, and the default
  // 30s test timeout left zero room for the rest of the test (it timed out before the
  // assertions ran). 60s = one slow hydration + the actual test steps.
  timeout: 60_000,

  // Retry once locally, twice on CI — remote sites have occasional network blips.
  retries: process.env.CI ? 2 : 0,
  forbidOnly: !!process.env.CI,

  // Run files in parallel; limit workers on CI so we don't hammer the site.
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,

  reporter: [["html", { open: "never" }], ["list"]],

  projects: [
    // --- Auth-reuse demo (Wiki: Phase 3 · storageState) ---
    // "setup" runs first and saves browser state; "authed" reuses it.
    { name: "setup", testMatch: /\.setup\.ts$/ },
    {
      name: "authed",
      testMatch: /authed\/.*\.spec\.ts/,
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/state.json",
      },
    },

    // --- Cross-browser E2E (Wiki: Phase 4 · cross-browser) ---
    // These run every spec EXCEPT the setup/authed ones.
    {
      name: "chromium",
      testIgnore: [/\.setup\.ts$/, /authed\//],
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      testIgnore: [/\.setup\.ts$/, /authed\//],
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      testIgnore: [/\.setup\.ts$/, /authed\//],
      use: { ...devices["Desktop Safari"] },
    },
    // A mobile viewport, because a music app gets a lot of phone traffic.
    {
      name: "mobile-chrome",
      testIgnore: [/\.setup\.ts$/, /authed\//],
      use: { ...devices["Pixel 7"] },
    },
  ],
});
