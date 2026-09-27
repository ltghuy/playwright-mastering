import { type Page, type Locator } from "@playwright/test";

/**
 * Page Object for a playlist detail page (/playlist/<id>).
 * Wiki: Phase 3 · Page Object Model (week 8).
 *
 * Each song is a `.song` row holding `.song-name`, `.song-artist`, etc. The row
 * has no play button in the DOM at rest — a play overlay only appears inside the
 * thumbnail on hover (`hidden group-hover:flex`), exactly like a real music app.
 */
export class PlaylistPage {
  readonly page: Page;
  readonly songs: Locator;
  readonly firstSong: Locator;

  constructor(page: Page) {
    this.page = page;
    // Each song row is rendered twice (a responsive mobile + desktop copy), so
    // keep only the copy a real user sees — same lesson as HomePage's tiles.
    this.songs = page.locator(".song").filter({ visible: true });
    this.firstSong = this.songs.first();
  }

  /** Wait for the song list to hydrate from the backend before acting on it. */
  async waitLoaded() {
    await this.firstSong.waitFor({ state: "visible" });
  }

  /** The title of the first song, read live so tests survive playlist reorders. */
  async firstSongName(): Promise<string> {
    return (await this.firstSong.locator(".song-name").innerText()).trim();
  }

  /**
   * Play the first song the way a user does: hover the row so the play overlay
   * appears, then click it. Hovering first is required because the overlay is
   * `display:none` until `group-hover`, so a bare click would fail the
   * visibility check.
   */
  async playFirstSong() {
    await this.firstSong.hover();
    await this.firstSong.locator(".song-thumbnail div").click();
  }

  /**
   * The app marks the current track by swapping the row's hover background for a
   * solid `--primary-lighter` one — assert with
   * `expect(firstSong).toHaveClass(/primary-lighter/)`.
   *
   * Why assert on the row highlight (and the player bar title) instead of the
   * <audio> element: Playwright's bundled Chromium has no proprietary codecs,
   * and this app never assigns the audio a <src> in that environment — so
   * audio.currentTime/paused prove nothing. The highlight is what a user
   * actually sees change when a song starts.
   */
}
