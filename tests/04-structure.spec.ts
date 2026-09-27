import { test, expect } from "../fixtures/base";
import { HomePage } from "../pages/HomePage";
import { PlayerBar } from "../pages/PlayerBar";

/**
 * WIKI · Phase 2 · Test structure & config (week 7)
 * -------------------------------------------------
 * Group related tests with describe(), share setup with beforeEach().
 * baseURL, timeouts and browsers live in playwright.config.ts.
 */
test.describe("The persistent player bar", () => {
  let player: PlayerBar;

  test.beforeEach(async ({ page }) => {
    const home = new HomePage(page);
    await home.goto(); // shared setup: land on a hydrated home page
    player = new PlayerBar(page);
  });

  test("shows the player transport controls", async () => {
    await expect(player.shuffle).toBeVisible();
    await expect(player.repeat).toBeVisible();
  });

  test("has a seek slider and a volume slider", async () => {
    await expect(player.seekBar).toBeVisible();
    await expect(player.volumeBar).toBeVisible();
  });

  test("exposes lyrics and queue controls", async ({ page }) => {
    // These live-only-on-desktop controls are hidden on narrow phone layouts.
    // Skipping conditionally (instead of failing) is how you handle a genuine
    // responsive difference — a real lesson from running cross-viewport.
    const width = page.viewportSize()?.width ?? 0;
    test.skip(width < 700, "lyrics/queue controls are desktop-only");

    await expect(player.lyrics).toBeVisible();
    await expect(player.queue).toBeVisible();
  });

  test("player bar survives navigation to search", async ({ page }) => {
    const home = new HomePage(page);
    await home.search("Đen");
    // The bar is global — still there after the route changes.
    await expect(player.shuffle).toBeVisible();
  });
});
