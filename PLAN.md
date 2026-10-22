# PLAN.md — Premium Developer Portfolio Dashboard (Vivek Thakur)

> **Status:** Planning document. Work one phase at a time. Nothing is built until Phase 1 is approved.
> **Product:** Frontend-only portfolio that looks and behaves like a premium analytics dashboard. **Not** a CMS: no backend, database, auth, or API.
> **How to use:** Each phase ends with a **Manual Acceptance Checklist** you can verify yourself. Tick the tracker (§2) only when every item passes.

---

## 0. Conventions

| Tag | Meaning |
|---|---|
| **[CONFIRMED]** | Stated in your brief. |
| **[DECISION]** | Recommended by this plan; change it before Phase 1 if you disagree. |
| **[VERIFY]** | Tool/version fact that must be checked against current official docs (use Context7) before use. |
| **[HUMAN]** | Needs your input or approval. |

### 0.1 Confirmed stack **[CONFIRMED]**
Next.js (App Router) · React · TypeScript (strict) · Tailwind CSS v4 · shadcn/ui + Radix · Lucide · Recharts · Motion · next-themes. React Hook Form + Zod **only if** a form justifies them (this plan does not need them). No database, backend, auth, Redux, TanStack Query, analytics, 3D/WebGL, paid kits.

### 0.2 AI Agent Working Protocol (OpenCode / any coding agent)

Read **§0, §3–§9 and §11** once. Then work **only on the current phase** in §10. §1 and Appendix A are history; ignore them.

1. **One phase per session.** Never start the next phase or add later-phase features early. (This overrides the original brief's "do not stop after producing a plan": the agent stops after each phase.)
2. **Start each phase** by stating the phase, tasks, and files you expect to touch. Ask about every **[HUMAN]** item before building on it.
3. **Never guess** versions, install commands, or API signatures. Check **[VERIFY]** items with Context7/official docs and record source + date in `docs/VERSIONS.md`.
4. **TypeScript strict.** No `any`, no `@ts-ignore`, no disabled lint rules to hide problems.
5. **Truthful content only.** Never invent employers, dates, metrics, user counts, performance gains, awards, or skill percentages. Missing facts become explicit placeholders (§3.2). Never present illustrative data as real.
6. **Confidentiality first.** Never add real patient data, client names, internal URLs, credentials, or screenshots from employer systems unless the user confirms permission (§3.4).
7. **Tests with the code.** Write the phase's tests in the same session; run `npm run verify` and report the real output. Never claim something works without running it.
8. **Finish a phase** by updating docs, giving me the Manual Acceptance Checklist with exact URLs/commands, and stopping. Do not tick the tracker or tag `phase-N-done` until I confirm.
9. **If the plan conflicts with reality,** stop and propose a change to `PLAN.md`; do not deviate silently.
10. **Small commits** prefixed `P<number>:`.
11. **Tooling:** follow §0.3.

### 0.3 Agent Tooling (MCP) — the agent sets this up itself

- Config: `opencode.json` in repo root (no secrets, committed). MCP servers under `mcp` (`local` with a `command` array, or `remote` with a `url`).
- Keep few servers active; enable per phase; verify names/commands against current docs first.
- The agent cannot restart OpenCode. After editing `opencode.json`, it tells me: *"Restart OpenCode, open the MCP servers dialog, connect `<name>` (Space)."* Then it waits and verifies with `opencode mcp list`.

| Server | Purpose | Starting point (verify) | Enable in |
|---|---|---|---|
| `context7` | Current docs for Next, Tailwind v4, shadcn, Recharts, Motion, next-themes | remote `https://mcp.context7.com/mcp` | P0 |
| `shadcn` | Browse/install shadcn components | local `npx -y shadcn@latest mcp` | P1 |
| `playwright` | Drive a real browser to run checklists/E2E | local `npx -y @playwright/mcp@latest` | P2 |

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "context7": { "type": "remote", "url": "https://mcp.context7.com/mcp", "enabled": true },
    "shadcn": { "type": "local", "command": ["npx", "-y", "shadcn@latest", "mcp"], "enabled": false },
    "playwright": { "type": "local", "command": ["npx", "-y", "@playwright/mcp@latest"], "enabled": false }
  }
}
```

---

## 1. Review Summary — Gaps Found and Filled

1. **Build-everything prompt vs. phase-checkable plan** → rebuilt as vertical slices with manual checklists (§10).
2. **Almost no real content provided** (employers, dates, education, contact URLs, SureGo details, screenshots). The brief forbids invention, so work would stall mid-way. → **Content Intake sheet** (`CONTENT_INTAKE.md`) filled **before** content-dependent phases; placeholders are tracked and a **production build gate** blocks launch while any remain (§3.2).
3. **Confidentiality risk:** HIS/HMIS is a healthcare system. Screenshots may contain patient data or client-identifying info. → Mandatory confidentiality review and anonymization rules (§3.4).
4. **Chart honesty:** with only 2–3 projects, "projects per technology" bars are low-information, and a "skills donut" can imply proficiency. → Charts are explicitly labeled by what they count, show the sample size, and have text alternatives (§6.2).
5. **Activity page has no verified data** → dated milestone timeline only; no fake contribution heatmap (D7).
6. **No data-integrity safety net** (a project referencing a missing technology would break charts/filters silently) → data layer phase with Vitest integrity tests (P4).
7. **Missing implementation details:** filter state in the URL (shareable, refresh-safe), `Suspense` around `useSearchParams`, static generation for case studies, theme-flash prevention, sidebar state persistence without flash, Recharts SSR/CLS handling, OG image generation without an asset, JSON-LD, 404/error pages.
8. **Command palette** only mentioned as optional foundation → split: navigation-only foundation in P3 (so no dead trigger), full content/actions in P13.
9. **No deployment/handoff phase** (hosting, domain, env, how to edit content) → P16.
10. **Tooling gap:** no MCP/agent setup → §0.3.
11. **Unspecified decisions** (package manager, hosting, rendering mode, page transitions, SureGo handling) → §3.

---

## 2. Progress Tracker

| # | Phase | Feature you can verify by hand | Done |
|---|---|---|---|
| 0 | Content intake, compatibility & confidentiality review | Filled content sheet; decisions locked; version table | ☐ |
| 1 | Project foundation | `npm run dev` shows a styled placeholder; checks pass | ☐ |
| 2 | Design system & theming | Component gallery in light/dark, no theme flash | ☐ |
| 3 | App shell & navigation | Sidebar, header, mobile drawer, working nav + basic palette | ☐ |
| 4 | Data layer & integrity | Typed data, derived metrics, tests green, content check | ☐ |
| 5 | Overview dashboard (content) | Welcome, summary cards, featured projects, timeline, CTA | ☐ |
| 6 | Charts | Donut + bar on Overview, interactive and accessible | ☐ |
| 7 | Project explorer | Search/filter/URL state/empty state | ☐ |
| 8 | Project case studies | `/projects/[slug]` pages with fallbacks | ☐ |
| 9 | Skills & analytics | Grouped skills, charts, search, related projects | ☐ |
| 10 | Experience | Career timeline | ☐ |
| 11 | Activity | Milestone timeline | ☐ |
| 12 | About & Contact | Profile, education, mailto/copy email, links, resume | ☐ |
| 13 | Command palette & motion polish | Ctrl/Cmd+K full search/actions; reduced-motion safe | ☐ |
| 14 | SEO & metadata | Titles, OG images, sitemap, robots, JSON-LD | ☐ |
| 15 | QA hardening | Responsive, a11y, performance, keyboard, theme audit | ☐ |
| 16 | Deployment & handoff | Live URL; editing guide; zero placeholders | ☐ |

**Order rationale:** design system (2) before any page; shell (3) before pages; data layer (4) before anything that displays real content so charts/filters share one source of truth; overview (5) first because it is the most important page; charts (6) after the content they summarize; the palette is completed (13) after all searchable content exists.

---

## 3. Decisions, Content Rules, Data Model

### 3.1 Decisions

| # | Decision |
|---|---|
| D1 | **Package manager: npm** (repo is empty; simplest on Windows). **[DECISION]** |
| D2 | **Latest stable Next.js, React, Tailwind v4**, exact versions pinned by lockfile and recorded in `docs/VERSIONS.md`. **TypeScript is pinned to `6.0.3`** because `typescript-eslint@8.72.0` supports `>=4.8.4 <6.1.0`; latest `7.0.2` would break typed linting. Verified compatibility in `docs/VERSIONS.md` (Recharts + React 19, shadcn + Tailwind v4, next-themes). |
| D3 | **Fully static rendering:** all routes prerendered (`generateStaticParams` for case studies). No runtime server needed. |
| D4 | **Server Components by default;** client components only for: theme toggle, sidebar interactivity, command palette, charts, project filters, copy-email. Keep boundaries small. |
| D5 | **Filters live in the URL** (`?q=&tech=&category=&featured=`): shareable and refresh-safe. `useSearchParams` wrapped in `Suspense`. |
| D6 | **Charts use shadcn's chart wrapper over Recharts** for theme-aware tokens; colors from `--chart-1…5`. **[VERIFY]** Recharts major version compatibility. |
| D7 | **Activity page = dated milestone timeline.** No contribution heatmap unless real data exists. |
| D8 | **SureGo stays hidden** (`visibility: "hidden"`) until you verify its details and stack (§3.2). |
| D9 | **Every content item has a `status`** (`"verified" | "placeholder"`); a production-build gate fails while placeholders remain public. |
| D10 | **No skill percentages.** Technologies carry `usage: "professional" | "learning"` and are counted only from real project tags. |
| D11 | **Contact = `mailto:` + copy-email + real profile links.** No fake form. |
| D12 | **Page transitions:** entry-only fade via `template.tsx` (no exit animations, no View Transitions). Wrap in `MotionConfig reducedMotion="user"`. |
| D13 | **Theme:** light / dark / system (default system); `next-themes` class strategy, `suppressHydrationWarning`, no flash. |
| D14 | **Sidebar collapsed state persisted in a cookie** (readable on the server → no layout flash). |
| D15 | **OG images generated with `next/og`** (no design asset required). |
| D16 | **Hosting: Vercel, deployed by the owner.** The agent prepares the production build, environment variables and handoff instructions; the owner deploys separately. Canonical URLs stay disabled until the final domain is set in `NEXT_PUBLIC_SITE_URL` (`2026-10-22`). |
| D17 | **Experience duration is derived** from verified start/end dates (month precision); never typed in. |

### 3.2 Content truthfulness system

- Every `Project`, `Experience`, `Education`, `Milestone`, `ExternalLink` has `status: "verified" | "placeholder"` and, for projects, `visibility: "public" | "hidden"`.
- Placeholders use obvious text like `"[TODO: employer name]"` and render with a dev-only badge.
- `npm run content:check` lists all placeholders and hidden items; **in production builds it fails if any placeholder is public** (Go-Live Gate in Phase 16).
- Summary-card numbers are **derived** from data (never typed). If underlying data is placeholder, the card shows "—".

### 3.3 Data model (TypeScript, `src/data/types.ts`)

```ts
type Status = "verified" | "placeholder";
type Technology = { id: string; name: string; category: CategoryId; usage: "professional" | "learning"; url?: string };
type CategoryId = "frontend" | "state-data" | "backend-api" | "databases" | "tools-deploy";
type Project = {
  slug: string; title: string; summary: string; problem: string; myRole: string;
  contribution: string[];            // modules/features I personally built
  category: "healthcare" | "content-platform" | "other";
  techIds: string[];                 // must exist in technologies
  featured: boolean; visibility: "public" | "hidden"; status: Status;
  features: string[]; decisions: string[]; lessons?: string[];
  performanceWork?: { text: string; verified: boolean }[];
  period?: { start: string; end?: string }; // YYYY-MM
  cover?: { src: string; alt: string; anonymized: boolean; illustrative?: boolean; illustrativeLabel?: string; fit?: "cover" | "contain" }; // else branded fallback
  gallery?: { src: string; alt: string; anonymized: boolean }[];
  links?: { github?: string; live?: string };
};
type Experience = { id: string; employer: string; title: string; start: string; end?: string; summary: string;
  responsibilities: string[]; projectSlugs: string[]; techIds: string[]; status: Status };
type Education = { id: string; institution: string; degree: string; start?: string; end?: string; status: Status };
type Milestone = { id: string; date: string; title: string; description: string; projectSlug?: string; status: Status };
type Profile = { name: string; role: string; summary: string; email: string; links: ExternalLink[]; resumeHref?: string;
  photo?: { src: string; alt: string }; interests: string[]; status: Status };
```

Derived helpers in `src/lib/chart-data.ts`: `techByCategory()`, `projectsPerTech()`, `featuredProjects()`, `totalExperience()`, `groupSkills()`. Pages never hard-code counts.

### 3.4 Confidentiality rules (HIS/HMIS and employer work)

- **Employer names:** ACGIL and Digital Rubix are approved for publication (`2026-10-22`). Client hospital names are **not** approved and stay hidden.
- No real patient, staff, or client data in any screenshot, text, or alt text.
- **Employer screenshots require explicit owner approval and `anonymized: true`.** The owner approved `public/projects/acgil.png` for the ACGIL Corporate Website and `public/projects/metro.png` for the Alaknanda Metro Advertising Platform (`2026-10-22`); both show public-facing website pages without private records. The owner supplied generic HIS/HMIS and CMS dashboard illustrations for project covers; they use synthetic figures, carry `anonymized: true`, and must display an `Illustrative UI` label with alt text that says they are conceptual. Do not present their figures as project results. Other projects use the branded fallback unless an image is reviewed and approved.
- Describe **your contributions** (Purchase, Pharmacy, etc.) with "contributed to" wording, not ownership of the whole system. Don't name client hospitals without permission.
- Each gallery image carries `anonymized: true|false`; the content check blocks public images with `false` unless you whitelist them.
- No internal URLs, API endpoints, credentials, or infrastructure identifiers in case studies.

---

## 4. Design Direction (locked: **Precision Console** · premium · minimal · dashboard-first · light/dark)

Not a generic admin dashboard and not a Linear/Vercel/GitHub copy. It should read like a calm engineering instrument: editorial typography, mono metadata, hairline geometry, asymmetric compositions and evidence-first content. This section is the visual source of truth; Phase 2 implements it and Phase 15 audits against it.

### 4.1 Identity and signature elements

- **Workspace-path breadcrumbs** in the header (`~/projects/his-hmis`) in Geist Mono.
- **Mono metadata** for dates, slugs, counts and units, always with tabular numerals.
- **Slim status bar** at the bottom of the shell: current route, "content updated <date>", theme indicator.
- **VT monogram** remains the shell avatar and a fallback when the profile portrait is unavailable. Use the owner-provided profile portrait in the overview signal panel and About identity panel. The overview panel gives the portrait a full-width 4:3 crop above a quiet role caption; keep it free of grid overlays and competing decoration.
- Thin 1px dividers instead of heavy card shadows; cards only for discrete objects; never cards inside cards.
- One restrained blue accent; green only for verified/current state; amber only for placeholders; no gradients except one subtle radial wash in the hero.
- Asymmetric layouts: 8/4 hero, metric strip, indexed dossier rows, sticky year rail.
- **Anti-generic rules:** no four equal stat cards, no gradient blobs, no fake sparklines or trend arrows, no percentage skill bars, no placeholder screenshots, no generic "Hi, I'm…" hero, no card-in-card.

### 4.2 Layout system

| Element | Spec |
|---|---|
| Sidebar | `264px` expanded / `72px` collapsed, fixed; state in a cookie (D14) |
| Header | `56px`, sticky, hairline bottom border, workspace path + palette trigger + theme toggle |
| Status bar | `28px`, fixed bottom, mono micro-copy |
| Content | `max-width: 1280px`, 12-column grid, gutters `24px` → `48px` |
| Density | 4px base spacing unit; section rhythm `64–96px` |
| Radius | `6 / 8 / 12px` only |
| Shadows | Overlays only (dialog, sheet, dropdown, command); no resting card shadows |

**Breakpoints:** `320 · 360 · 375 · 390 · 430 · 640 · 768 · 1024 · 1280 · 1440 · 1536 · 1600`. No horizontal overflow at any width.

### 4.3 Tokens (CSS variables; verify AA in Phase 2)

| Token | Light | Dark |
|---|---|---|
| background | `#FCFCFD` | `#0F1218` |
| surface / card | `#FFFFFF` | `#151922` |
| sidebar | `#F5F6F8` | `#11151C` |
| foreground | `#0F172A` | `#E6E9EF` |
| muted foreground | `#5B6578` | `#98A1B3` |
| border | `#E4E7EC` | `#232A36` |
| primary (blue) | `#2563EB` | `#6E9BFF` |
| accent-soft | `#EFF4FF` | `#16203A` (approx; tune in Phase 2) |
| grid-line | `#0F172A10` | `#E6E9EF10` |
| success / warning / destructive | `#15803D` / `#B45309` / `#DC2626` | lighter AA variants |
| ring | primary @ 40% | primary @ 50% |
| chart-1…5 | blue, teal, amber, violet, slate (distinct hue **and** lightness; never the only carrier of meaning) | tuned separately |

Tokens live as CSS variables (shadcn/Tailwind v4 theme). No raw hex in components (lint/grep check). Dark theme is designed, not inverted; no pure black everywhere.

### 4.4 Typography

One family pair: **Geist Sans** (UI/body) + **Geist Mono** (metadata), loaded via `next/font/google` (verified available, `2026-10-22`).

| Role | Size / weight | Notes |
|---|---|---|
| Display | `clamp(2.5rem, 5vw, 4.5rem)`, 500–600 | tracking `-0.03em`, line-height `0.98`, `text-wrap: balance` |
| Page title | `1.75–2.25rem`, 600 | one `h1` per page |
| Section | `1.25–1.5rem`, 600 | `text-wrap: balance` |
| Card title | `1–1.125rem`, 600 | |
| Body | `0.9375–1rem`, 400 | line-height `1.65`, `text-wrap: pretty` |
| Helper | `0.8125rem`, 400 | muted foreground |
| Label | `0.6875rem`, 500 | mono, uppercase, tracking `0.12em` |
| Metric | `2.5–3.5rem`, 600 | mono tabular numerals; derived values only |
| Metadata | `0.75rem`, 400 | mono tabular numerals |

### 4.5 Page compositions

| Route | Composition |
|---|---|
| `/` | Asymmetric 8/4 hero (name, role, current status, two CTAs, prominent portrait signal panel with role metadata), derived metric strip, featured dossier rows, chart pair, experience preview, milestone preview, closing CTA |
| `/projects` | Search/filter toolbar, result count (`aria-live`), indexed dossier grid, strong empty state |
| `/projects/[slug]` | Title/summary/meta hero, cover, sticky section nav on desktop, contributions/decisions/lessons, branded fallbacks, prev/next |
| `/skills` | Grouped capability matrix, usage badges, project counts, project links; no percentages |
| `/experience` | Timeline with sticky year rail; durations derived from dates |
| `/activity` | Year-grouped milestone ledger with project filter; labelled "Selected engineering milestones" |
| `/about` | Editorial two-column with marginalia and a portrait panel using `/profile/vivek-thakur.png`; fall back to the VT monogram if unavailable. Keep the crop portrait-oriented and role metadata legible without placing text over the face. |
| `/contact` | Oversized `mailto:` treatment, copy-email feedback, verified link rows; no form |
| `not-found` / `error` | Console-style route message with command-palette hint |

### 4.6 Motion

- Entry-only page fade + `4px` rise, `150–180ms`, ease-out (D12; no exit animations, no View Transitions).
- Active-nav indicator via layout animation; hover color/border `120ms`; cover scale max `1.015`.
- `MotionConfig reducedMotion="user"`, plus an explicit `prefers-reduced-motion: reduce` override (duration `0.01ms`, transforms disabled) so motion is effectively instant.
- No scroll-jacking, bouncing, glowing or delayed navigation.

### 4.7 Finish standards (audited in Phase 15)

Every screen must pass: clear hierarchy; consistent optical alignment; reserved chart/image heights with no CLS; loading skeletons matching final dimensions; real empty and error states; hover only behind `@media (hover: hover)`; visible focus rings; AA contrast in both themes; semantic landmarks; one `h1`; chart text alternatives; no orphan headings; tabular numerals for numbers; no raw hex; no `any`; no disabled lint rules; clean at `320px` and `≥1600px`.

---

## 5. Architecture

```text
src/
├── app/                # routes, layout.tsx, template.tsx, not-found.tsx, error.tsx, sitemap.ts, robots.ts, opengraph-image
├── components/
│   ├── ui/             # shadcn (customized)
│   ├── layout/         # app-sidebar, app-header, mobile-nav, status-bar, page-container, theme-toggle
│   ├── dashboard/ projects/ skills/ experience/ activity/ about/ contact/
│   ├── charts/         # skill-donut-chart, technology-bar-chart, chart-card, chart-data-table, chart-tooltip
│   └── command/        # command-palette
├── data/               # types.ts, profile.ts, technologies.ts, projects.ts, experience.ts, education.ts, activity.ts
├── lib/                # chart-data.ts, metrics.ts, seo.ts, utils.ts, constants.ts
├── hooks/
public/                 # projects/<slug>/*, resume/, favicon
docs/                   # VERSIONS.md, CONTENT_GUIDE.md, DESIGN_SYSTEM.md
tests/                  # unit (Vitest) + e2e (Playwright)
```

Rules: server components for pages; client islands small; no global state library; Recharts loaded only where used (dynamic import on pages where it's below the fold); chart containers reserve height to prevent layout shift; no `any`.

---

## 6. Feature Specifications (condensed from the brief)

### 6.1 Routes
`/` overview · `/projects` · `/projects/[slug]` · `/skills` · `/experience` · `/activity` · `/about` · `/contact` · `not-found` · `error`. Every nav item points to a real page at release; stubs are allowed **during development only**.

### 6.2 Charts (honest by design)
- **Technologies by category (donut):** counts of technologies per category from `technologies.ts`. Title says "Technologies by category", **not** "skill level". Center label shows total; legend shows counts; click → `/skills?category=<id>`.
- **Technology coverage (horizontal bar):** number of **public** projects tagged with each technology; subtitle states sample size ("Based on N selected projects"). Sorted, top-N with "show all". Tooltip lists project names.
- Both: theme-aware tokens, responsive container with reserved height, tooltip, accessible legend, **text alternative** (visually hidden data table + "View as table" toggle), empty state, no gradients/gridline clutter.
- Optional line/area chart **only** if real time-series data exists (currently none → skip).

### 6.3 Project cover fallback
`ProjectCover`: image if provided (`next/image`, fixed 16:10, `sizes` set, alt required); show a visible `Illustrative UI` label by default when `cover.illustrative` is true, or use `illustrativeLabel` for other kinds of illustrative images; otherwise use a branded fallback generated from tokens + monogram + category icon. Never a broken image or present synthetic values as real project results.

### 6.4 Command palette
Foundation (P3): page navigation only. Complete (P13): pages, projects, technologies, actions (toggle theme, copy email, open GitHub/LinkedIn, view resume). Shortcut `Ctrl/Cmd+K` with `preventDefault`; visible trigger in header (works on mobile via button); Escape closes; focus returns to trigger.

### 6.5 Accessibility baseline
Semantic landmarks, one `h1` per page, skip-to-content link, labeled icon buttons, visible focus rings, color never sole carrier, chart text alternatives, reduced-motion honored, touch targets ≥ 44px on mobile, dialogs trap/restore focus.

---

## 7. Performance & SEO Targets (verified in P15)

- Lighthouse (mobile, production build): Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 on `/`, `/projects`, one case study. **[HUMAN: adjust targets]**
- LCP < 2.5 s, CLS < 0.1, INP good; no render-blocking font swaps.
- Initial JS for `/` kept lean; Recharts split out; no unused deps (`depcheck`).
- Metadata on every route; OG images via `next/og`; `sitemap.xml`, `robots.txt`; JSON-LD `Person` on `/about` (or `/`); canonical only when `NEXT_PUBLIC_SITE_URL` is set.

---

## 8. Testing Strategy

- **Unit (Vitest):** derivation helpers, **data integrity** (unique slugs/ids, every `techId` exists, every `projectSlug` exists, dates valid, placeholders flagged, hidden items excluded from derived metrics, no skill percentages in data).
- **E2E (Playwright):** every route loads/refreshes directly; nav + active state; theme toggle persists and has no flash; project filters/URL state/empty state; chart click navigation; palette open/search/navigate/close; copy-email feedback; mobile drawer.
- **Accessibility:** axe on every route in both themes + manual keyboard pass.
- **Quality gates:** `tsc --noEmit`, ESLint, production build, Lighthouse, bundle review.
- **Rule:** no phase tagged done with failing checks; no check suppressed to pass.

---

## 9. Standard Commands & Environment

| Command | Introduced | Purpose |
|---|---|---|
| `npm run dev` / `build` / `start` | P1 | Run / build / serve |
| `npm run typecheck` / `lint` / `format` | P1 | Strict TS / ESLint / Prettier |
| `npm run test` / `test:e2e` | P1 / P2 | Vitest / Playwright |
| `npm run content:check` | P4 | List placeholders/hidden items; fail in production gate |
| `npm run verify` | P1 | typecheck + lint + test (+ build from P15) |

| Env var | Notes |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production URL; enables canonical/OG absolute URLs. Not a secret. |

No secrets exist in this project.

---

## 10. Phase-Wise Implementation Plan

**Global Definition of Done (every phase):** `npm run verify` passes · both themes checked (from P2) · no new `any`/suppressions · no fabricated content · docs updated · Manual Acceptance Checklist ticked · commit + tag `phase-N-done`.

### Phase 0 — Content Intake, Compatibility & Confidentiality Review
**Objective:** Replace assumptions with facts before building.
**Tasks**
0. Create `opencode.json` per §0.3 (Context7 enabled); ask me to restart/connect; verify with `opencode mcp list`.
1. **[HUMAN]** Fill `CONTENT_INTAKE.md` (employers + dates, project contributions, SureGo facts, education, contact/links, resume, photo, philosophy/interests/goals, domain). Anything unknown stays a placeholder.
2. **[HUMAN]** Confidentiality review for HIS/HMIS and any employer content (§3.4); decide which screenshots (if any) may be published and how they'll be anonymized.
3. Verify and record in `docs/VERSIONS.md`: Next.js, React, Tailwind v4 setup, shadcn (Tailwind v4 + Sidebar/Command/Chart components), Recharts (+ React compatibility), Motion package/API, next-themes, Geist via `next/font`, `next/og`.
4. Confirm Node LTS and a **path without spaces** for the repo.
5. Confirm hosting (D16) and domain.
**Acceptance:** every **[VERIFY]** resolved or flagged; intake sheet complete enough to start P4/P5 (placeholders allowed but listed).
**Do not start before this is complete:** Phase 1.

**Manual Acceptance Checklist**
- [ ] I filled the intake sheet (unknowns marked).
- [ ] I decided what is confidential and what is publishable.
- [ ] `docs/VERSIONS.md` has sources and dates.
- [ ] Context7 shows as connected.

---

### Phase 1 — Project Foundation
**Objective:** A running, strictly-typed skeleton.
**Tasks:** initialize Next.js (App Router, TypeScript, Tailwind v4, ESLint, `src/` dir) per verified docs · enable strict TS (+ `noUncheckedIndexedAccess`) · initialize shadcn · enable `shadcn` MCP · Prettier, ESLint rules (no `any`, no hard-coded colors via a grep/lint check) · Vitest setup · Playwright config · scripts from §9 · `.gitignore`, README stub, `docs/` stubs · placeholder home page.
**Tests:** a trivial Vitest test; `npm run verify` passes.
**Acceptance:** one command starts the app; typecheck/lint/test/build succeed.

**Manual Acceptance Checklist**
- [ ] `npm run dev` opens a styled placeholder page.
- [ ] `npm run verify` and `npm run build` succeed.
- [ ] `tsconfig` shows `strict: true`.

**Do not start before this is complete:** design tokens.

---

### Phase 2 — Design System & Theming
**Objective:** The visual identity exists once, in both themes.
**Tasks:** enable `playwright` MCP · Geist Sans/Mono via `next/font` · tokens (§4.2) as semantic CSS variables for both themes · type/spacing/radius/shadow/transition scales · `next-themes` (class strategy, system default, no flash) · customize shadcn: Button, Input, Badge, Card, Tabs, Tooltip, Dialog, Sheet, Skeleton, Separator, Command, Chart · custom: `StatusBadge`, `MetricCard`, `SectionHeader`, `EmptyState`, `TechChip` · dev-only `/_design` gallery showing every component/state in both themes · reduced-motion handling · `docs/DESIGN_SYSTEM.md` (with the rule: custom component only if shadcn composition can't meet a documented need).
**Tests:** axe on gallery in both themes; Playwright theme-persistence test; contrast spot-checks.
**Acceptance:** no raw colors in components; AA contrast.

**Manual Acceptance Checklist**
- [ ] Gallery looks intentionally designed in light **and** dark (not inverted).
- [ ] Switching theme persists after refresh with **no flash** (hard reload several times).
- [ ] Tab key shows visible focus on every interactive component.
- [ ] OS "reduce motion" disables animations.

**Do not start before this is complete:** any shell or page work.

---

### Phase 3 — App Shell & Navigation
**Objective:** A polished application frame.
**Tasks:** sidebar (brand monogram, name, profile identity, nav with active indicator, theme control, external-link/contact shortcut; collapsible; state in cookie, D14) · header (page title, workspace-path breadcrumbs, palette trigger, theme toggle) · mobile drawer (Sheet) with ≥44px targets · status bar · `PageContainer` · skip link · route stubs for all routes (dev-only "coming in phase N" panel) · `not-found.tsx` and `error.tsx` · **command palette foundation** (navigation entries only) with `Ctrl/Cmd+K`.
**Tests:** Playwright: nav + active state, collapse persistence, mobile drawer open/close/focus, palette open/navigate/Escape.
**Acceptance:** shell looks finished with any page content; no horizontal overflow at 320px.

**Manual Acceptance Checklist**
- [ ] Every sidebar item navigates; refresh on each route works.
- [ ] Collapsing the sidebar persists after refresh without flicker.
- [ ] At 375px the drawer works with touch-size targets and doesn't cover content afterward.
- [ ] `Ctrl+K` opens the palette, arrows select, Enter navigates, Esc closes and returns focus.
- [ ] Unknown URL shows the custom 404.

**Do not start before this is complete:** page content.

---

### Phase 4 — Data Layer & Integrity
**Objective:** One typed source of truth; charts and filters can never disagree.
**Tasks:** `types.ts` (§3.3) · `technologies.ts` (professional vs learning, categories) · `projects.ts` (HIS/HMIS, Centralized Blog CMS, ACGIL Corporate Website, owner-approved Surynova Solar Website, Alaknanda Metro Advertising Platform, Real Estate Lead Generation Landing Page, independent React Streaming UI Clone, SureGo hidden/placeholder) · `experience.ts`, `education.ts`, `activity.ts`, `profile.ts` populated **only** from the intake sheet; everything unknown = placeholder · `chart-data.ts` / `metrics.ts` derivations · `npm run content:check` · Vitest integrity suite (§8) · `docs/CONTENT_GUIDE.md` (how to edit each file).
**Tests:** integrity + derivation unit tests (including hidden projects excluded, empty-data cases).
**Acceptance:** all tests green; `content:check` prints an accurate placeholder report.

**Manual Acceptance Checklist**
- [ ] I can read each data file and recognize my real facts (no invented ones).
- [ ] Adding a project with a non-existent tech ID makes tests fail (try it, then undo).
- [ ] `npm run content:check` lists exactly the placeholders I expect.
- [ ] `CONTENT_GUIDE.md` is clear enough to edit content without touching components.

**Do not start before this is complete:** Overview and charts.

---

### Phase 5 — Overview Dashboard (content, no charts)
**Objective:** The most important page communicates who you are in seconds.
**Tasks:** welcome section (name, positioning, concise description, **Explore Projects**, **Contact** actions) · summary cards (verified experience duration, selected project count, technology categories, highlights — all derived; "—" if placeholder) · featured projects (cards with `ProjectCover`, tags, contribution, links to detail) · professional-highlights compact timeline → `/experience` · recent milestones (clearly labeled) · closing contact CTA · skeleton/empty states. Reserve chart slots (empty, hidden) for P6.
**Acceptance:** hierarchy readable in both themes; no fake numbers.

**Manual Acceptance Checklist**
- [ ] Within 10 seconds I (and a recruiter) can tell who I am and what I build.
- [ ] Every number can be traced to a data file (change data → number changes).
- [ ] Both buttons go to real destinations.
- [ ] Layout is clean at 375 / 768 / 1440 widths; no horizontal scroll.

**Do not start before this is complete:** charts.

---

### Phase 6 — Charts
**Objective:** Honest, accessible, theme-aware visualizations.
**Tasks:** `ChartCard` wrapper (title, explanation, sample-size note, empty state, "View as table") · `SkillDonutChart` and `TechnologyBarChart` (§6.2) · shared tooltip · reserved heights (no CLS) · dynamic import where below the fold · place on Overview · donut click → `/skills?category=` · text alternatives.
**Tests:** unit tests for chart data shaping; Playwright: tooltip appears, click navigates, table toggle shows data, both themes render; axe.
**Acceptance:** counts match data; labels never imply proficiency.

**Manual Acceptance Checklist**
- [ ] Hovering/focusing a slice or bar shows a tooltip.
- [ ] Clicking a donut category opens the skills page filtered (works after P9; until then link target exists as a stub).
- [ ] "View as table" shows the same numbers as the chart.
- [ ] Chart titles say what is counted ("Technologies by category", "Projects per technology") and show the sample size.
- [ ] No layout jump when charts load; readable in both themes and at 320px.

**Do not start before this is complete:** skills page.

---

### Phase 7 — Project Explorer
**Objective:** Professional discovery experience.
**Tasks:** `/projects` page · search (title/description) · technology filter · category filter · featured toggle · clear all · result count (`aria-live`) · URL state (D5, `Suspense`) · responsive grid with consistent image ratio · empty state · project cards communicate what/problem/contribution/tech/why-interesting.
**Tests:** Playwright for each filter, combined filters, URL restore on refresh, empty state, clear all, hidden projects never shown.
**Acceptance:** counts always correct; filters usable one-handed on mobile.

**Manual Acceptance Checklist**
- [ ] Typing in search filters instantly; URL updates; refresh keeps the filter.
- [ ] Combining tech + category + search gives correct results and count.
- [ ] A no-match search shows a helpful empty state with "Clear filters".
- [ ] SureGo does **not** appear while hidden.

**Do not start before this is complete:** case studies.

---

### Phase 8 — Project Case Studies
**Objective:** Meaningful, accurate project storytelling.
**Tasks:** `/projects/[slug]` with `generateStaticParams` · sections: overview, problem, my role and **specific contributions**, stack, features, engineering decisions, verified performance/architecture work (only if `verified: true`), gallery (only `anonymized: true`), lessons, links (only if present) · previous/next project · per-page metadata · cover/gallery fallbacks · 404 for unknown/hidden slug.
**Acceptance:** nothing unverified is stated as fact.

**Manual Acceptance Checklist**
- [ ] Each case study reads accurately about **my** contribution (I proofread it).
- [ ] No confidential/patient data is visible anywhere.
- [ ] A hidden or unknown slug shows 404.
- [ ] Missing images show the branded fallback, never a broken image.
- [ ] Direct URL load and refresh work.

**Do not start before this is complete:** skills page.

---

### Phase 9 — Skills & Analytics
**Objective:** Organized technology view without fake proficiency.
**Tasks:** groups (Frontend · State & data · Backend & APIs · Databases · Tools & deployment) · reuse charts · searchable skill list · `?category=` handling · `professional` vs `learning` badges · related-project links per technology · explanatory copy ("counts show project usage, not proficiency").
**Acceptance:** all numbers derived; no percentages.

**Manual Acceptance Checklist**
- [ ] Opening `/skills?category=frontend` highlights/filters correctly.
- [ ] Each technology lists only projects that actually use it.
- [ ] Learning technologies are visibly distinguished from professional ones.
- [ ] No percentage or "level" language appears anywhere.

---

### Phase 10 — Experience
**Tasks:** chronological timeline (employer, title, dates, summary, responsibilities as concrete engineering work, linked projects, technologies) · derived total experience · placeholder badge (dev) for unknown dates.
**Manual Acceptance Checklist**
- [ ] Every entry matches my real history (dates, titles).
- [ ] Responsibilities are specific, not generic claims.
- [ ] Project links open the right case studies.
- [ ] Looks good on mobile (timeline doesn't overflow).

---

### Phase 11 — Activity
**Tasks:** dated milestone timeline from `activity.ts` (grouped by year) · filter by project · clear label "Selected engineering milestones" · no heatmap/fake contributions.
**Manual Acceptance Checklist**
- [ ] Every milestone is real or clearly marked as placeholder (and none ships public).
- [ ] Filtering by project works and the list order is chronological.
- [ ] Nothing implies GitHub contribution data.

---

### Phase 12 — About & Contact
**Tasks:** About (introduction, engineering background, education, and owner-confirmed interests; add philosophy/goals only when the owner approves wording; editorial layout; optional owner-provided portrait from `/profile/vivek-thakur.png` in the identity panel with VT fallback) · Contact (email, LinkedIn, GitHub, other real links, copy-email with accessible feedback, `mailto:`, resume integration for the owner-provided PDF in `/public/resume`, following [`docs/RESUME_INTEGRATION_PLAN.md`](docs/RESUME_INTEGRATION_PLAN.md)) · overview resume entry point remains tertiary to the project CTA · no fake form.
**Manual Acceptance Checklist**
- [ ] Every contact link opens the correct real destination (I clicked each).
- [ ] Copy-email shows feedback and the clipboard has the right address.
- [ ] Resume downloads (or the button is absent).
- [ ] The resume can be opened for a quick read and downloaded from Contact; the Overview exposes it without competing with Explore Projects.
- [ ] The PDF content and public contact details have been reviewed by the owner before publication.
- [ ] Education matches my real details.

---

### Phase 13 — Command Palette Completion & Motion Polish
**Tasks:** extend palette: projects, technologies, actions (theme, copy email, profile links, resume) · grouped results, keyboard hints · entry-only page transitions (D12) · subtle hover/entry motion · `MotionConfig reducedMotion="user"` · remove any gratuitous animation.
**Manual Acceptance Checklist**
- [ ] Palette finds a project by name and opens its case study.
- [ ] "Toggle theme" and "Copy email" actions work from the palette.
- [ ] With reduced motion enabled, transitions are effectively instant.
- [ ] Motion feels subtle: nothing bounces, glows, or delays navigation.

---

### Phase 14 — SEO & Metadata
**Tasks:** `metadata` per route (title template, description) · Open Graph/Twitter · `opengraph-image` via `next/og` (default + per-project) · `sitemap.ts` (public pages and public projects only) · `robots.ts` · JSON-LD `Person` · favicon/app icons · canonical only if `NEXT_PUBLIC_SITE_URL` set · hidden projects excluded everywhere.
**Manual Acceptance Checklist**
- [ ] Each page has a unique title and description (browser tab + view-source).
- [ ] `/sitemap.xml` lists only public pages; `/robots.txt` loads.
- [ ] Social preview image renders for home and a case study.
- [ ] JSON-LD validates in a structured-data tester.

---

### Phase 15 — QA Hardening
**Tasks:** full Playwright suite · axe on every route × both themes · manual keyboard-only pass · responsive matrix (320, 375, 390–430, 768, 1024–1440, ≥1600) · Lighthouse targets (§7) · bundle review + `depcheck` · empty/error/loading states · designer/architect/recruiter/mobile/keyboard reviews (record findings in `docs/QA_REPORT.md`) · fix actual defects (no suppression).
**Manual Acceptance Checklist**
- [ ] I can use the whole site with the keyboard only.
- [ ] No horizontal overflow at any listed width.
- [ ] Lighthouse results meet targets (report attached).
- [ ] Both themes look polished on every page.
- [ ] `docs/QA_REPORT.md` lists real checks and results, with no unverified claims.

---

### Phase 16 — Deployment & Handoff
**Tasks:** prepare and verify the production build locally · enforce strict content validation in the production build command · hand the owner the exact Vercel settings (`Next.js`, repository root, `npm ci`, `npm run build`, default output) and Production-only `NEXT_PUBLIC_SITE_URL` · owner deploys to Vercel separately (D16) **[HUMAN]** · owner confirms the live URL, then run a production smoke test against it · resolve all placeholders (Go-Live Gate) · finalize `README.md` with commands, data editing paths, the flat `public/projects/<filename>` image convention, resume review requirement, `NEXT_PUBLIC_SITE_URL`, and known limitations.
**Go-Live Gate (all required):** `content:check` reports **zero public placeholders** · SureGo either verified or still hidden · confidentiality sign-off recorded (no screenshots, no client names) · Lighthouse and a11y targets met on the owner's live URL · every contact link verified · all phases 0–15 ticked.
**Manual Acceptance Checklist**
- [ ] In Vercel, Framework Preset is Next.js, Root Directory is the repository root, Install Command is `npm ci`, Build Command is `npm run build`, and Output Directory is the Next.js default.
- [ ] `npm run content:check -- --strict` reports zero public placeholders and no integrity errors.
- [ ] `npm run build` completes locally after strict content validation.
- [ ] `NEXT_PUBLIC_SITE_URL` is set to the canonical HTTPS origin for Production; Preview is not given a misleading canonical origin.
- [ ] The owner has reviewed the resume PDF and final public wording for accuracy and confidentiality.
- [ ] Live URL works on my phone and laptop.
- [ ] `/sitemap.xml`, `/robots.txt`, a public case study, and all contact links work on the live URL.
- [ ] Lighthouse, visual, keyboard, accessibility, and responsive checks are recorded in `docs/QA_REPORT.md` for all current public routes.
- [ ] I edited a project description in the data file and saw it update without touching components.
- [ ] Zero placeholders remain public.
- [ ] I reviewed every page once as a recruiter would.

---

## 11. Version 2 Ideas (not in v1)
A `/writing` page fed by the Centralized Blog CMS public API (`cms.acgil.com`) · real GitHub contribution graph via a build-time fetch · downloadable resume page with print styles · case-study diagrams · localization · testimonials (with permission) · privacy-friendly analytics.

---

## Appendix A — Gap Notes

| Gap | Risk | Fixed in |
|---|---|---|
| Missing real content | Phases stall or invention creeps in | P0 intake, §3.2 |
| Healthcare/employer confidentiality | Legal/reputation risk | §3.4, P0, P8 |
| Skills charts implying proficiency | Misleading claims | §6.2, D10 |
| Few projects → thin bar chart | Looks weak/misleading | Sample-size label, "show all", tooltip with project names |
| No fake activity | Dishonest heatmap | D7, P11 |
| Charts/filters drifting from data | Inconsistent numbers | P4 integrity tests |
| Theme/sidebar flash | Unpolished feel | D13, D14 |
| Recharts SSR/CLS | Layout shift | Reserved heights, P6 |
| `useSearchParams` build errors | Failed builds | D5 `Suspense` |
| No placeholder gate | Fake content ships | D9, Go-Live Gate |
| Dead command-palette trigger | Non-functional button | Split P3/P13 |
