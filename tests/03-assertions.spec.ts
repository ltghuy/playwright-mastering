import { test, expect } from "../fixtures/base";
import { HomePage } from "../pages/HomePage";
import { SearchResultsPage } from "../pages/SearchResultsPage";

/**
 * WIKI · Phase 2 · Assertions & auto-waiting (week 5 · key)
 * --------------------------------------------------------
 * Web-first assertions (expect(locator).toBeVisible(), toHaveText, ...) retry
 * automatically until true or they time out. That is why you almost never need
 * waitForTimeout(). Think of each expect() as one written test-case step.
 */
test.describe("Assertions — verifying the app did the right thing", () => {
  test("toHaveTitle — the tab title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Sky Muzik/i);
  });

  test("toHaveURL — search changes the URL", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.search("Sơn Tùng");
    await expect(page).toHaveURL(/\/search\/S/);
  });

  test("toBeVisible — results render the right sections", async ({ page }) => {
    const home = new HomePage(page);
    const results = new SearchResultsPage(page);

    await home.goto();
    await home.search("Sơn Tùng");

    // These auto-retry while the results stream in — no sleep needed.
    await expect(results.artistsHeading).toBeVisible();
    await expect(results.songsHeading).toBeVisible();
  });

  test("toContainText — a known artist shows up for the query", async ({
    page,
  }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.search("Sơn Tùng");

    await expect(page.getByText("Sơn Tùng M-TP").first()).toBeVisible();
  });

  test("negative assertion — junk query shows no real artist", async ({
    page,
  }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.search("zzzznotarealquery123");

    // No "Sơn Tùng M-TP" artist card for a nonsense query.
    await expect(page.getByText("Sơn Tùng M-TP")).toHaveCount(0);
  });
});
