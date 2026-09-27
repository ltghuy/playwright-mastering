import { test, expect } from "../fixtures/base";
import { HomePage } from "../pages/HomePage";
import { SearchResultsPage } from "../pages/SearchResultsPage";

/**
 * WIKI · Phase 3 · Page Object Model (week 8)
 * -------------------------------------------
 * Notice how these tests read like plain English. No CSS selectors, no
 * getByRole calls — all of that lives in pages/*.ts. When the UI changes,
 * you fix ONE file, not fifty.
 */
test.describe("End-to-end search flow (via Page Objects)", () => {
  test("search from home → land on results → open an artist", async ({
    page,
  }) => {
    const home = new HomePage(page);
    const results = new SearchResultsPage(page);

    await home.goto();
    await home.search("Sơn Tùng");

    await expect(results.artistsHeading).toBeVisible();
    await expect(results.songsHeading).toBeVisible();

    // Click through to the artist page — target the artist LINK specifically,
    // not just any text node that happens to say "Sơn Tùng M-TP".
    await page
      .locator('a[href^="/artist/"]')
      .filter({ hasText: "Sơn Tùng M-TP" })
      .first()
      .click();
    await expect(page).toHaveURL(/\/artist\//);
  });

  test("search results include a songs section with rows", async ({ page }) => {
    const home = new HomePage(page);
    const results = new SearchResultsPage(page);

    await home.goto();
    await home.search("Đen");

    await expect(results.songsHeading).toBeVisible();
    // There is at least one clickable result on the page.
    expect(await results.songLinks.count()).toBeGreaterThan(0);
  });
});
