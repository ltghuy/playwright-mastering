import { type Page, type Locator } from "@playwright/test";

/**
 * Page Object for the /search/<query> results page.
 * Sections observed on the live site: "Nghệ sĩ/OA" (artists),
 * "Bài hát" (songs), "Playlist/Album".
 */
export class SearchResultsPage {
  readonly page: Page;
  readonly artistsHeading: Locator;
  readonly songsHeading: Locator;
  readonly playlistsHeading: Locator;
  readonly firstPlaylist: Locator;

  constructor(page: Page) {
    this.page = page;
    this.artistsHeading = page.getByText("Nghệ sĩ/OA", { exact: true });
    this.songsHeading = page.getByText("Bài hát", { exact: true });
    this.playlistsHeading = page.getByText("Playlist/Album", { exact: true });
    // The first card in the "Playlist/Album" results. Scope to that section
    // (`section.search-playlists`) so we don't accidentally grab a single/album
    // link from the "Bài hát" song rows or a recommended row above it.
    this.firstPlaylist = page
      .locator('section.search-playlists a[href^="/playlist/"]')
      .filter({ visible: true })
      .first();
  }

  /** A result link (artist or song) that contains the given text. */
  resultByText(text: string): Locator {
    return this.page.getByText(text, { exact: false }).first();
  }

  /** All song rows in the "Bài hát" section area. */
  get songLinks(): Locator {
    return this.page.getByRole("link");
  }
}
