import { test, expect } from "../../fixtures/base";

/**
 * WIKI · Phase 3 · Auth reuse with storageState (week 9)
 * -----------------------------------------------------
 * This spec runs in the "authed" project, which is wired in playwright.config.ts
 * to (a) run the setup project first (dependencies: ["setup"]) and (b) load the
 * saved storageState. So this test starts with the browser state the setup
 * captured — no repeated login/setup work. That is the whole time-saver.
 */
test.describe("storageState reuse", () => {
  test("the state saved in setup is present here", async ({ page }) => {
    await page.goto("/");

    // We never wrote this value in THIS test — it came from the saved state.
    const marker = await page.evaluate(() =>
      localStorage.getItem("pw-course"),
    );
    expect(marker).toBe("storageState-works");
  });

  test("the saved timestamp came along too", async ({ page }) => {
    await page.goto("/");
    const savedAt = await page.evaluate(() =>
      localStorage.getItem("pw-saved-at"),
    );
    expect(savedAt).toBeTruthy();
  });
});
