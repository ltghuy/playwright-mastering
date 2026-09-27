/**
 * Shared test data. Keeping "what we test with" separate from "how we test"
 * is exactly the data-driven habit from the wiki (Phase 2 · Data-driven tests).
 */

// Backend API discovered from the site's network traffic.
export const API_BASE = "https://sky-muzik-be.vercel.app/api";

// A known-good playlist id (Top 100 Nhạc Rap). Stable enough for demos.
export const KNOWN_PLAYLIST_ID = "ZWZB96AI";

// Search terms → what we expect to appear in the results.
export const searchCases = [
  { query: "Sơn Tùng", expectArtist: "Sơn Tùng M-TP" },
  { query: "Đen", expectArtist: "Đen" },
  { query: "Hòa Minzy", expectArtist: "Hòa Minzy" },
];

// Top-nav routes we expect to be reachable.
export const routes = [
  { path: "/", name: "Home" },
  { path: "/top100", name: "Top 100" },
  { path: "/charts", name: "Charts" },
  { path: "/mv", name: "MV" },
];
