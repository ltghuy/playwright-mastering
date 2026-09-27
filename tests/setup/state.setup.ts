import { test as setup, expect } from "@playwright/test";

/**
 * WIKI · Phase 3 · Auth reuse with storageState (week 9 · huge time-saver)
 * -----------------------------------------------------------------------
 * The classic use is: log in ONCE here, save cookies + localStorage to a file,
 * then have every real test reuse that session and skip the login UI.
 *
 * Sky Muzik logs in via OAuth (no username/password form), so instead of faking
 * a login we demonstrate the *mechanism* that makes auth-reuse work: persist
 * browser state to disk and load it back in another test. Swap the body below
 * for real login steps against a form-login site (e.g. saucedemo) and the wiring
 * is identical.
 */
const STATE_FILE = "playwright/.auth/state.json";

setup("save browser state to disk", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Top 100", exact: true }),
  ).toBeVisible();

  // Stand in for "we are now logged in": write a marker into localStorage,
  // exactly where a real app keeps its auth token / session flags.
  await page.evaluate(() => {
    localStorage.setItem("pw-course", "storageState-works");
    localStorage.setItem("pw-saved-at", new Date().toISOString());
  });

  // Persist cookies + localStorage for reuse. (In a real login flow you'd call
  // this right after asserting you landed on the post-login page.)
  await page.context().storageState({ path: STATE_FILE });
});
