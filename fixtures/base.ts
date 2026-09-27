import { test as base, expect } from "@playwright/test";

/**
 * Shared test fixtures.
 * Wiki: Phase 3 · Fixtures — extend the base `test` once, reuse everywhere.
 *
 * `holdAfterTest` is an *auto* fixture: it runs around every test without the
 * test having to ask for it. After the test body finishes it optionally keeps
 * the browser window open for a moment so, in a headed run, you can actually
 * SEE the final UI state (e.g. the "Sơn Tùng M-TP" result) before the window
 * closes and the next spec starts.
 *
 * Controlled by the HOLD env var (milliseconds); the `test:headed` npm script
 * sets it. Unset / 0 means no hold, so `npm run test` and CI stay fast.
 * Override per run, e.g. `HOLD=5000 npm run test:headed`.
 */
export const test = base.extend<{ holdAfterTest: void }>({
  holdAfterTest: [
    async ({ page }, use) => {
      await use();
      // Runs after the test body (pass or fail). Guard against a page that a
      // failing test already closed.
      const hold = process.env.HOLD ? Number(process.env.HOLD) : 0;
      if (hold > 0 && !page.isClosed()) {
        await page.waitForTimeout(hold);
      }
    },
    { auto: true },
  ],
});

export { expect };
