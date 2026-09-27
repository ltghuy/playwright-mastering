import { test, expect } from "../fixtures/base";
import { HomePage } from "../pages/HomePage";
import { SearchResultsPage } from "../pages/SearchResultsPage";
import { searchCases, routes } from "../fixtures/test-data";

/**
 * WIKI · Phase 2 · Data-driven tests (week 7)
 * -------------------------------------------
 * One scenario, many inputs. Loop over a data array to generate a separate,
 * independently-reported test per case — your manual "test matrix", automated.
 */
test.describe("Data-driven: searching for well-known artists", () => {
  for (const { query, expectArtist } of searchCases) {
    test(`search "${query}" surfaces artist "${expectArtist}"`, async ({
      page,
    }) => {
      const home = new HomePage(page);
      const results = new SearchResultsPage(page);

      await home.goto();
      await home.search(query);

      await expect(results.artistsHeading).toBeVisible();
      await expect(page.getByText(expectArtist).first()).toBeVisible();
    });
  }
});

test.describe("Data-driven: every top-nav route loads", () => {
  for (const { path, name } of routes) {
    test(`route ${name} (${path}) loads with the search bar`, async ({
      page,
    }) => {
      await page.goto(path);
      if (path !== "/") await expect(page).toHaveURL(new RegExp(path));
      await expect(
        page.getByPlaceholder("Tìm kiếm bài hát, nghệ sĩ..."),
      ).toBeVisible();
    });
  }
});
