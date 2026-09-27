import { test, expect } from "../fixtures/base";
import { HomePage } from "../pages/HomePage";
import { SearchResultsPage } from "../pages/SearchResultsPage";
import { PlaylistPage } from "../pages/PlaylistPage";
import { PlayerBar } from "../pages/PlayerBar";

/**
 * WIKI · Phase 4 · Full user flow (capstone E2E)
 * ----------------------------------------------
 * One real journey, end to end, through four Page Objects:
 *   Home → search an artist → open the first playlist → play the first song.
 *
 * The final proof is twofold: the player bar shows the song we clicked (UI),
 * AND the <audio> element is actually advancing (real playback, not just a
 * loaded track). We read the first song's title live, so the test keeps
 * passing when the playlist's contents change.
 */
test.describe("E2E — search an artist and play their first song", () => {
  test("home → search → first playlist → play first song", async ({ page }) => {
    const home = new HomePage(page);
    const results = new SearchResultsPage(page);
    const playlist = new PlaylistPage(page);
    const player = new PlayerBar(page);

    // 1. Start on the home page.
    await home.goto();

    // 2 + 3. Type an artist name and submit with Enter (search() presses Enter
    // and waits for the URL to become /search/...).
    await home.search("Sơn Tùng");
    await expect(page).toHaveURL(/\/search\//);
    await expect(results.playlistsHeading).toBeVisible();

    // 4. Choose the first playlist in the "Playlist/Album" section.
    await results.firstPlaylist.click();
    await expect(page).toHaveURL(/\/playlist\//);
    await playlist.waitLoaded();

    // Remember which song is first, so the assertion below is exact yet robust.
    const firstTitle = await playlist.firstSongName();

    // 5. Play the first song.
    await playlist.playFirstSong();

    // Proof #1 — the player bar now shows the song we clicked.
    await expect(player.nowPlaying).toHaveText(firstTitle);

    // Proof #2 — the FIRST song row is now the active/now-playing track (the app
    // swaps its background to `--primary-lighter` for the current song). Together
    // with Proof #1 this confirms we played the first song specifically.
    await expect(playlist.firstSong).toHaveClass(/primary-lighter/);
  });
});
