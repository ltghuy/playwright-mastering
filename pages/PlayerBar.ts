import { type Page, type Locator } from "@playwright/test";

/**
 * A "component object" for the persistent player bar at the bottom of every page.
 * Not a full page — a reusable chunk of UI. Composing small component objects
 * like this is the grown-up version of the Page Object Model.
 *
 * Teaching note: most of these controls are icon-only buttons. The site DOES
 * give several of them an accessible name via title/aria (great!), so we can use
 * user-facing `getByRole`. Where a control has no name we fall back to a scoped
 * locator — a realistic lesson in locator trade-offs.
 */
export class PlayerBar {
  readonly page: Page;
  readonly shuffle: Locator;
  readonly repeat: Locator;
  readonly lyrics: Locator;
  readonly queue: Locator;
  readonly seekBar: Locator;
  readonly volumeBar: Locator;
  readonly nowPlaying: Locator;

  constructor(page: Page) {
    this.page = page;
    // The title of the track currently loaded in the bottom player bar.
    this.nowPlaying = page.locator("section.player .media-name");
    this.shuffle = page.getByRole("button", { name: "Phát bài hát ngẫu nhiên" });
    this.repeat = page.getByRole("button", { name: "Lặp lại bài hát" });
    this.lyrics = page.getByRole("button", { name: "Xem lời bài hát" });  
    this.queue = page.getByRole("button", { name: "Danh sách phát" });
    // Two range sliders exist (seek + volume); scope by their surrounding context.
    this.seekBar = page.getByRole("slider").first();
    this.volumeBar = page.getByRole("slider").last();
  }

  /** The title of the currently loaded track, shown at the bottom-left. */
  currentTrack(name: string): Locator {
    return this.page.getByRole("link", { name });
  }
}
