import { type Page, type Locator, expect } from "@playwright/test";

/**
 * Page Object for the Sky Muzik home page.
 * Wiki: Phase 3 · Page Object Model (week 8).
 *
 * The idea: every locator and every action for this page lives here, once.
 * Tests then read like plain English and never touch a raw selector.
 */
export class HomePage {
  readonly page: Page;
  readonly searchBox: Locator;
  readonly top100Heading: Locator;
  readonly firstPlaylistTile: Locator;
  readonly top100SeeAll: Locator;
  readonly themeToggle: Locator;
  readonly backButton: Locator;
  readonly forwardButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = page.getByPlaceholder("Tìm kiếm bài hát, nghệ sĩ...");
    // The section heading. Note the CSS uppercases it on screen, but the real
    // accessible name is "Top 100"; exact:true avoids the "Top 100 Nhạc ..."
    // playlist titles further down the page.
    this.top100Heading = page.getByRole("heading", {
      name: "Top 100",
      exact: true,
    });
    // A clickable album tile. The site renders each tile TWICE (a hidden
    // responsive copy + a visible one), so `.first()` alone can land on a
    // hidden node — WebKit exposed this. `.filter({ visible: true })` keeps
    // only the one a real user could click. (A great cross-browser lesson.)
    this.firstPlaylistTile = page
      .locator('a[href^="/playlist/"]')
      .filter({ visible: true })
      .first();
    // "TẤT CẢ" = "See all".
    this.top100SeeAll = page.getByRole("link", { name: "TẤT CẢ" });

    // --- Header controls (global, visible on every page) ---
    // The light/dark switch. It's an icon-only button (no accessible name) that
    // holds a sun + moon <span>, and the site renders it TWICE (responsive
    // mobile + desktop copies) — so anchor on the sun icon and keep the visible
    // one, the same lesson as firstPlaylistTile above.
    this.themeToggle = page
      .locator("button:has(span.sun)")
      .filter({ visible: true })
      .first();
    // In-app history buttons live in `.header-left` (back, then forward). That
    // container is `hidden sm:flex`, i.e. it only shows on desktop widths.
    this.backButton = page
      .locator(".header-left button")
      .filter({ visible: true })
      .first();
    this.forwardButton = page
      .locator(".header-left button")
      .filter({ visible: true })
      .nth(1);
  }

  /** Flip the theme by clicking the header sun/moon switch. */
  async toggleTheme() {
    await this.themeToggle.click();
  }

  /** Go back one entry using the app's own back button (not page.goBack()). */
  async goBack() {
    await this.backButton.click();
  }

  async goto() {
    await this.page.goto("/");
    // The home feed hydrates from /api/home after a skeleton state. Wait for a
    // stable, visible landmark — the section heading — instead of a blind sleep.
    // (Works identically across Chromium, Firefox and WebKit.)
    await expect(this.top100Heading).toBeVisible();
  }

  /**
   * Type a query and submit it. Returns after the URL becomes /search/...
   * so callers can immediately assert on the results page.
   */
  async search(query: string) {
    await this.searchBox.click();
    await this.searchBox.fill(query);
    await this.searchBox.press("Enter");
    await this.page.waitForURL(/\/search\//);
  }

  /** Just type, don't submit — used to test the live suggestions dropdown. */
  async typeInSearch(query: string) {
    await this.searchBox.click();
    await this.searchBox.fill(query);
  }
}
