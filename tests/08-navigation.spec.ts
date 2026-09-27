import { test, expect } from "../fixtures/base";
import { HomePage } from "../pages/HomePage";

/**
 * WIKI · Phase 4 · Capstone flavour
 * ---------------------------------
 * Broader coverage: the main routes load, deep links work, and browser
 * history (back/forward) behaves. This is the kind of "does the app hang
 * together" test a real suite needs.
 */
test.describe("Navigation & routing", () => {
  test("direct navigation to /top100 loads", async ({ page }) => {
    await page.goto("/top100");
    await expect(page).toHaveURL(/\/top100/);
    await expect(page.getByPlaceholder("Tìm kiếm bài hát, nghệ sĩ...")).toBeVisible();
  });

  test("direct navigation to /charts loads", async ({ page }) => {
    await page.goto("/charts");
    await expect(page).toHaveURL(/\/charts/);
  });

  test("deep link to a known playlist loads its detail page", async ({
    page,
  }) => {
    await page.goto("/playlist/ZWZB96AI");
    await expect(page).toHaveURL(/\/playlist\/ZWZB96AI/);
  });

  test("browser back returns to the home page after a search", async ({
    page,
  }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.search("Đen");
    await expect(page).toHaveURL(/\/search\//);

    await page.goBack();
    await expect(page).toHaveURL("https://sky-muzik.vercel.app/");
  });
});
