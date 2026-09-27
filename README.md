# Sky Muzik · Playwright practice project

A **real** Playwright test suite that runs against the live site
[sky-muzik.vercel.app](https://sky-muzik.vercel.app/) (a Zing MP3-style music
app). It's the hands-on companion to `playwright-wiki.html` — every test file is
labelled with the wiki phase and week it practises, so you learn a concept in
the wiki, then see it working here against a real app.

> **70% hands-on, 30% reading.** Open a spec, read the comment at the top, run
> it, then change something and watch it fail. That loop is the whole point.

---

## Quick start

```bash
npm install                    # install Playwright + types
npx playwright install         # download the browsers (first time only)

npm test                       # run everything, all browsers
npm run test:chromium          # just Chromium — fastest feedback loop
npm run test:ui                # interactive UI mode (watch + time-travel)
npm run report                 # open the HTML report from the last run
```

Handy while learning:

```bash
npm run test:headed            # watch the browser (SLOWMO + a HOLD pause per test)
npm run test:debug             # step through with the Playwright Inspector
npm run test:api               # just the API spec (07)
npm run codegen                # record your clicks into ready-made code
npx playwright test 03-assertions   # run one file
npx playwright test -g "search"     # run tests whose title matches "search"
```

---

## What's under test

- **Frontend:** `https://sky-muzik.vercel.app` — routes `/`, `/top100`,
  `/charts`, `/mv`, `/search/<query>`, `/playlist/<id>`, `/artist/<name>`
- **Backend API:** `https://sky-muzik-be.vercel.app/api` — a clean
  `{ err, msg, data }` envelope (`/home`, `/charthome`, `/detailplaylist`, …),
  used by the API tests.

The app is in Vietnamese, so locators use the on-screen Vietnamese text
(e.g. the search box placeholder `Tìm kiếm bài hát, nghệ sĩ...`). That's
realistic — you test the app in the language your users see.

---

## How the files map to the wiki

| File | Wiki phase · week | What you practise |
|------|-------------------|-------------------|
| `tests/01-locators.spec.ts` | P2 · Locators (wk4) | `getByRole`, `getByPlaceholder`, `getByText`, attribute locators, `.filter()`, chaining, `expect.poll` for lazy content |
| `tests/02-actions.spec.ts` | P2 · Actions (wk4) | `fill`, `press`, `click`, clearing inputs, live search suggestions |
| `tests/03-assertions.spec.ts` | P2 · Assertions (wk5) | web-first assertions: `toHaveTitle`, `toHaveURL`, `toBeVisible`, `toContainText`, `toHaveCount(0)` |
| `tests/04-structure.spec.ts` | P2 · Structure & config (wk7) | `describe`, `beforeEach`, a shared component object, conditional `test.skip` for responsive differences |
| `tests/05-data-driven.spec.ts` | P2 · Data-driven (wk7) | one test per row: artists to search, routes to load |
| `tests/06-pom-search.spec.ts` | P3 · Page Object Model (wk8) | tests written entirely through Page Objects |
| `tests/07-api.spec.ts` | P3 · API testing (wk9) | the `request` fixture, status + payload assertions, API-as-oracle |
| `tests/setup/state.setup.ts` + `tests/authed/` | P3 · storageState (wk9) | save browser state once, reuse it (project `dependencies`) |
| `tests/08-navigation.spec.ts` | P4 · Navigation | routes, deep links, browser back/forward |
| `tests/09-ui-controls.spec.ts` | P4 · UI controls | dark-mode toggle (`toHaveClass`), `localStorage` persistence, the app's own back button, `test.skip` on mobile |
| `tests/10-e2e-play-flow.spec.ts` | P4 · Capstone E2E | one full journey through four Page Objects: home → search → first playlist → play first song |
| `playwright.config.ts` | P2 · config / P4 · cross-browser | `baseURL`, trace/screenshot/video, retries, Chromium + Firefox + WebKit + mobile |
| `.github/workflows/playwright.yml` | P3 · CI/CD (wk10) | run on every push, upload report + traces |

Supporting code:

- `pages/` — Page Objects (`HomePage`, `SearchResultsPage`, `PlaylistPage`) and a
  reusable component object (`PlayerBar`). Locators live here **once**; tests read
  like English.
- `fixtures/base.ts` — the project's extended `test`. Adds an auto `holdAfterTest`
  fixture that pauses at the end of each test (via the `HOLD` env var, set by
  `test:headed`) so you can see the final UI in a headed run. Specs import `test`
  and `expect` from here instead of `@playwright/test`.
- `fixtures/test-data.ts` — the data the data-driven tests loop over.

---

## Real lessons baked into these tests

These aren't toy tests — the site fought back, and the fixes are the education:

1. **CSS lies about text.** The "TOP 100" title is CSS-uppercased; the real DOM
   text is `Top 100`. `getByText(exact)` matches the *underlying* text, so we use
   `getByRole("heading", { name: "Top 100", exact: true })`. (See `01`.)
2. **Genre labels are baked into images.** The "Nhạc Trẻ" etc. tile labels are
   part of the artwork, not DOM text — so we never assert on them. Read the page
   before writing locators.
3. **Content lazy-loads.** Playlist tiles stream in after first paint, so a plain
   `.count()` races them — `expect.poll` retries until the feed fills. (See `01`.)
4. **Browsers differ.** The site renders each tile twice (a hidden responsive
   copy + a visible one). `.first()` landed on the hidden node in WebKit;
   `.filter({ visible: true })` fixes it. Cross-browser runs *catch* this. (See
   `pages/HomePage.ts`.)
5. **Responsive UIs hide controls.** The lyrics/queue buttons don't exist on the
   phone viewport, so that test `test.skip`s itself there instead of failing.
   (See `04` and `09`, where the header back button is `hidden sm:flex`.)
6. **Assert on what the user sees, not the codec.** Playwright's bundled Chromium
   ships without proprietary audio codecs, so the app never sets an `<audio>` src
   there — `audio.currentTime`/`paused` prove nothing. The capstone instead
   asserts the player-bar title and the now-playing row highlight
   (`--primary-lighter`), which is what actually changes when a song starts.
   (See `10` and `pages/PlaylistPage.ts`.)
7. **Play controls appear on hover.** A song row has no play button at rest — the
   overlay is `hidden group-hover:flex`, so the Page Object hovers the row first,
   then clicks. (See `pages/PlaylistPage.ts`.)

---

## A note on the storageState / auth lesson

The wiki's week-9 auth-reuse lesson normally logs in via a username/password
form and saves the session. Sky Muzik logs in with **OAuth**, which has no form
to automate — so `tests/setup/state.setup.ts` demonstrates the *mechanism*
(save cookies + localStorage to a file, then reuse it in the `authed` project)
rather than a fake login. The wiring in `playwright.config.ts` — a `setup`
project plus `dependencies: ["setup"]` and `storageState` — is **exactly** what
you'd use for real auth. To practise the full login flow, point that setup file
at a form-login site such as `saucedemo.com`.

---

## Suggested learning path

1. `npm run test:chromium` — get a green run.
2. Open `tests/01-locators.spec.ts`, read it, then `npm run test:ui` and watch it.
3. Break a locator on purpose (mistype the placeholder). Run it. Read the error.
   Open the trace with `npx playwright show-trace`.
4. Fix it. Move on to `02`, `03`, … in order.
5. When you reach `06`, notice how the Page Objects make tests shorter.
6. Read `10-e2e-play-flow.spec.ts` — the capstone that strings four Page Objects
   into one real journey — then add your own (the charts page, a favourites flow)
   using the same patterns.
```

Home base for questions: **https://playwright.dev** (answers ~90% of them).
