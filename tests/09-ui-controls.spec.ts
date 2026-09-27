import { test, expect } from "../fixtures/base";
import { HomePage } from "../pages/HomePage";

/**
 * WIKI · Phase 4 · Everyday UI controls
 * -------------------------------------
 * Two header controls a real user leans on all the time:
 *   • the light/dark theme switch
 *   • the in-app back button (SPA history)
 *
 * Both are icon-only buttons with no accessible name, and the site renders a
 * responsive duplicate of each — so the Page Object filters to the visible
 * copy (same trick as HomePage.firstPlaylistTile). Dark mode is applied as a
 * `dark` class on <body> and persisted to localStorage under "themeMode".
 */
test.describe("UI controls — theme & history", () => {
  test("dark mode toggle switches the theme on, then off", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    const body = page.locator("body");
    // Loads in light mode: no `dark` class on <body> yet.
    await expect(body).not.toHaveClass(/dark/);

    // Turn dark mode ON.
    await home.toggleTheme();
    await expect(body).toHaveClass(/dark/);

    // Turn it back OFF.
    await home.toggleTheme();
    await expect(body).not.toHaveClass(/dark/);
  });

  test("theme choice is persisted to localStorage", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await home.toggleTheme();
    await expect(page.locator("body")).toHaveClass(/dark/);

    // The app remembers the choice so a future visit stays dark.
    const stored = await page.evaluate(() => localStorage.getItem("themeMode"));
    expect(stored).toBe("dark");
  });

  test("back button returns to the previous route", async ({ page }, testInfo) => {
    // The header's back/forward buttons live in a `hidden sm:flex` container, so
    // they don't render below the ~640px `sm` breakpoint. On mobile the app
    // relies on the device's own back gesture, so this control simply isn't
    // there to test — skip rather than fail.
    test.skip(
      Boolean(testInfo.project.use.isMobile),
      "Header back/forward nav is hidden on mobile viewports (hidden sm:flex).",
    );

    const home = new HomePage(page);
    await home.goto();
    await expect(page).toHaveURL("https://sky-muzik.vercel.app/");

    // Navigate deeper via the sidebar (client-side route change)...
    await page.locator('a[href="/top100"]').filter({ visible: true }).first().click();
    await expect(page).toHaveURL(/\/top100/);

    // ...then use the app's OWN back button (not page.goBack()) to return home.
    await home.goBack();
    await expect(page).toHaveURL("https://sky-muzik.vercel.app/");
  });
});
