import { test, expect } from "@playwright/test";
import { API_BASE, KNOWN_PLAYLIST_ID } from "../fixtures/test-data";

/**
 * WIKI · Phase 3 · API testing (week 9)
 * -------------------------------------
 * Playwright talks to APIs too — no browser needed. The `request` fixture
 * fires real HTTP calls. Sky Muzik's backend uses a consistent envelope:
 *     { err: 0, msg: "Success", data: {...} }
 * so our assertions can check both transport (status) and payload (shape).
 */
test.describe("Backend API — sky-muzik-be.vercel.app", () => {
  test("GET /home returns the Success envelope with items", async ({
    request,
  }) => {
    const res = await request.get(`${API_BASE}/home`);

    expect(res.ok()).toBeTruthy();
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.err).toBe(0);
    expect(body.msg).toBe("Success");
    expect(Array.isArray(body.data.items)).toBe(true);
    expect(body.data.items.length).toBeGreaterThan(0);
  });

  test("GET /charthome returns chart data", async ({ request }) => {
    const res = await request.get(`${API_BASE}/charthome`);
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.err).toBe(0);
    expect(body.data).toBeTruthy();
  });

  test("GET /detailplaylist returns a titled playlist", async ({ request }) => {
    const res = await request.get(
      `${API_BASE}/detailplaylist?id=${KNOWN_PLAYLIST_ID}`,
    );
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.err).toBe(0);
    expect(typeof body.data.title).toBe("string");
    expect(body.data.title.length).toBeGreaterThan(0);
  });

  test("content-type is JSON", async ({ request }) => {
    const res = await request.get(`${API_BASE}/home`);
    expect(res.headers()["content-type"]).toContain("application/json");
  });

  test("a bad playlist id does not return a Success payload", async ({
    request,
  }) => {
    const res = await request.get(`${API_BASE}/detailplaylist?id=NOT_A_REAL_ID`);
    // The endpoint still responds; the envelope should signal the failure,
    // either via a non-zero err code or empty data.
    const body = await res.json();
    const failed = body.err !== 0 || !body.data || Object.keys(body.data).length === 0;
    expect(failed).toBe(true);
  });
});

/**
 * Bonus: using the API to *verify* something the UI also shows.
 * This is the "API as a fast oracle" pattern from the wiki — cross-check the
 * UI against the source of truth without clicking through screens.
 */
test.describe("API + UI cross-check", () => {
  test("home feed section count is non-trivial", async ({ request }) => {
    const res = await request.get(`${API_BASE}/home`);
    const body = await res.json();
    // The home page is built from these sections; expect a real feed.
    expect(body.data.items.length).toBeGreaterThanOrEqual(3);
  });
});
