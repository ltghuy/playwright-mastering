import { test, expect } from "../fixtures/base";
import { HomePage } from "../pages/HomePage";

/**
 * WIKI · Phase 2 · Actions (week 4)
 * ---------------------------------
 * What you *do* to a located element: click, type, press, hover.
 * Every action auto-waits for the element to be actionable first.
 */
test.describe("Actions — doing things to elements", () => {
  test("fill + press Enter runs a search", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await home.searchBox.fill("Đen Vâu");
    await home.searchBox.press("Enter");

    await expect(page).toHaveURL(/\/search\//);
  });

  test("typing shows the live suggestions dropdown", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await home.typeInSearch("Sơn Tùng");

    // "Đề xuất cho bạn" = "Suggestions for you" appears as you type.
    await expect(page.getByText("Đề xuất cho bạn")).toBeVisible();
  });

  test("clear the search box with fill('')", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await home.searchBox.fill("test");
    await expect(home.searchBox).toHaveValue("test");

    await home.searchBox.fill("");
    await expect(home.searchBox).toHaveValue("");
  });

  test("clicking a genre tile navigates to its playlist", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    // Click the first VISIBLE TOP 100 playlist tile and confirm we land on a
    // playlist page. (firstPlaylistTile filters out the hidden duplicate tile.)
    await home.firstPlaylistTile.click();
    await expect(page).toHaveURL(/\/playlist\//);
  });
});
