import { test, expect } from "../fixtures/base";
import { HomePage } from "../pages/HomePage";

/**
 * WIKI · Phase 2 · Locators (week 4)
 * ----------------------------------
 * A locator is *how you point at an element*. Prefer user-facing locators
 * (getByRole / getByPlaceholder / getByText) — they survive CSS refactors.
 * Every test below points at the SAME real page, a different way.
 */

test.describe("Locators — ways to point at an element", () => {
  test.beforeEach(async ({ page }) => {
    await new HomePage(page).goto();
  });

  test("by placeholder — the search box", async ({ page }) => {
    const search = page.getByPlaceholder("Tìm kiếm bài hát, nghệ sĩ...");
    await expect(search).toBeVisible();
    await expect(search).toBeEditable();
  });

  test("by attribute — navigation links have real hrefs", async ({ page }) => {
    // Links to the main sections exist in the DOM.
    await expect(page.locator('a[href="/top100"]').first()).toBeVisible();
    await expect(page.locator('a[href="/charts"]').first()).toBeAttached();
    await expect(page.locator('a[href="/mv"]').first()).toBeAttached();
  });

  test("by role — the TOP 100 section heading", async ({ page }) => {
    // Gotcha worth learning: the title LOOKS like "TOP 100" but that's CSS
    // text-transform (uppercase) — the real accessible name is "Top 100".
    // getByRole("heading", exact) is the most robust, user-facing way to grab
    // just the section header (not the sidebar nav item or the playlist titles).
    await expect(
      page.getByRole("heading", { name: "Top 100", exact: true }),
    ).toBeVisible();
  });

  test("filtering & chaining — a specific artist among many results", async ({
    page,
  }) => {
    // Chaining is how you zero in when a page has many similar items.
    const home = new HomePage(page);
    await home.search("Sơn Tùng");

    const artistLink = page
      .getByRole("link")
      .filter({ hasText: "Sơn Tùng M-TP" })
      .first();
    await expect(artistLink).toBeVisible();
  });

  test("counting — the page renders many playlist links", async ({ page }) => {
    const playlistLinks = page.locator('a[href^="/playlist/"]');
    // The feed lazy-loads: only a couple of tiles exist at first paint, then
    // more stream in. A plain count() would race that. expect.poll RETRIES the
    // count until the feed has filled out — the right tool for growing content.
    await expect
      .poll(() => playlistLinks.count(), {
        message: "home feed should render many playlist tiles",
      })
      .toBeGreaterThan(5);
  });
});
