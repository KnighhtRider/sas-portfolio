# Phase 15 QA Report

**Audit date:** 2026-10-22  
**Scope:** route accessibility, responsive layout, shell keyboard behavior, production build, and a source-level UX review.  
**Status:** targeted automated checks pass. Lighthouse and the owner's manual acceptance remain pending.

**Coverage limitation:** the recorded axe and responsive matrix names only two public case studies.
The project catalog now contains seven public projects, so this report does not establish coverage
for every current case-study route. Re-run the focused production smoke, visual, keyboard, and
Lighthouse review after the owner deploys.

## Phase 16 pre-deployment checks

- `npm run content:check -- --strict` — **passed**; zero public placeholders, SureGo remains hidden.
- `npm run build` — **passed**; Next.js compiled, TypeScript completed, and static routes were generated.
  Next emitted the expected `metadataBase` warning because `NEXT_PUBLIC_SITE_URL` is not configured.
- `npm run test:e2e -- tests/e2e/about-contact.spec.ts` — **8 passed** across Chromium desktop and
  mobile projects, including the About draft-copy removal and Contact behavior.
- `npm run lint` — **passed**.
- The resume PDF is present and linked, but its text and confidentiality have not been reviewed in
  this environment; no local PDF text reader was available. Owner review remains required.
- These focused checks are not a rerun of the full Playwright matrix or `npm run verify`.

## Findings and fixes

| Finding                                                                                                            | Change                                                                                                                     | Result                                        |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| The case-study in-page navigation widened the page to 602px at a 320px viewport.                                   | Constrained the case-study grid and its mobile navigation with `min-w-0`; removed an unnecessary full-span grid placement. | Responsive sweep passes.                      |
| Featured-project “Read case study” links replaced their visible text with an unrelated accessible name.            | Removed the overriding `aria-label`, keeping the visible link text in its accessible name.                                 | Axe route sweep passes.                       |
| Existing shell route checks expected the `/projects` heading to be “Projects” and queried broad `header` elements. | Updated the expected heading and scoped header assertions to the banner.                                                   | Shell suite passes.                           |
| Axe checks could sample pages during the 140ms entry fade, producing transient contrast failures.                  | Wait for the selected theme and completed page transition before scanning.                                                 | Shell and route axe checks pass consistently. |

## Automated results

- `npx playwright test tests/e2e/qa.spec.ts --project=chromium --grep "axe"` — **1 passed**. Scanned 12 routes/states in both themes: the main pages, both public case studies, project empty state, development design gallery, and custom 404.
- `npx playwright test tests/e2e/qa.spec.ts --project=chromium --grep "responsive viewport"` — **1 passed**. Checked all 12 planned widths (320–1600px) across the same 12 routes/states. Reduced-motion emulation kept layout measurements stable during sidebar breakpoint transitions.
- `npx playwright test tests/e2e/shell.spec.ts --project=chromium` — **8 passed**. Covers navigation, sidebar persistence, mobile drawer focus/escape behavior, command palette keyboard flow, skip link, 404, axe, and 320px overflow.
- `npm run typecheck` — **passed** (`tsc --noEmit`).
- Targeted ESLint for the changed UI and E2E files — **passed**.
- `npm run build` — **passed**; all static routes, metadata images, icons, robots, and sitemap generated. Next emitted the known `metadataBase` warning because `NEXT_PUBLIC_SITE_URL` is unset; canonical/social absolute URLs and the sitemap remain limited until the owner supplies the production domain.
- `git diff --check` — **passed**; Git reported existing LF-to-CRLF normalization warnings.
- Bundle inspection: 21 generated JavaScript chunks total **1,393,910 raw bytes**; largest chunk **374,092 bytes**. This is the combined uncompressed chunk set, not a per-route or transfer-size measurement.
- `npm ls --depth=0` showed the pinned top-level dependency tree. `depcheck` and Lighthouse are not installed, so unused-dependency analysis and Lighthouse scores were not produced.

The full Playwright suite and full `npm run verify` were not rerun. The audit ran the route/theme/viewport matrix and the shell keyboard suite targeted to Phase 15.

## UX review notes

- **Design:** the case-study horizontal overflow was the only responsive defect found in the matrix. The Precision Console layout and semantic token usage were preserved.
- **Architecture:** fixes stay in the affected UI and test files; the static route model and shared shell remain intact.
- **Recruiter flow:** primary navigation, project explorer, case-study links, contact route, and verified public case studies have route coverage. No content facts were changed during QA.
- **Mobile:** all audited routes fit the planned viewport widths; the existing drawer test confirms navigation closes and returns focus correctly.
- **Keyboard:** automated checks cover the skip link, drawer escape/focus behavior, command palette navigation/focus return, and sidebar controls. A manual keyboard-only walkthrough remains for owner acceptance.

## Remaining checks

- Run Lighthouse on `/`, `/projects`, and a case study against a production server; attach actual Performance, Accessibility, Best Practices, and SEO scores plus Core Web Vitals.
- Complete an owner visual review in both themes and a manual keyboard-only walkthrough.
- Owner reviews the resume PDF and confirms final public content, contact details, and confidentiality.
- Set `NEXT_PUBLIC_SITE_URL` in Vercel Production, redeploy, and verify the canonical metadata, sitemap, and social images against the live origin.
- Exercise the React error boundary and delayed loading skeleton in a browser session; this audit covered the custom 404 and project empty state, but did not force those transient states.

## Manual Acceptance Checklist

- Run `npm run dev`, then review `/`, `/projects`, `/projects/his-hmis`, `/experience`, `/contact`, and `/_design` at `http://localhost:3000` in both themes.
- Use Tab, Shift+Tab, Enter, Space, and Escape through navigation, project filters, case-study anchors, theme controls, and contact actions; confirm focus remains visible and understandable.
- Run `npm run start` and use Chrome Lighthouse in mobile mode on `http://localhost:3000/`, `http://localhost:3000/projects`, and `http://localhost:3000/projects/his-hmis`. Record scores and Core Web Vitals above.
- [ ] I can use the whole site with the keyboard only.
- [ ] No horizontal overflow at any listed width.
- [ ] Lighthouse results meet targets (report attached).
- [ ] Both themes look polished on every page.
- [ ] `docs/QA_REPORT.md` lists real checks and results, with no unverified claims.
