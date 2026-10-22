# DESIGN_SYSTEM.md

Owned by Phase 2. Visual source of truth: `PLAN.md` §4 (**Precision Console**).

## Review surface

The development-only gallery is available at `http://localhost:3000/_design`. Because Next.js treats
`_`-prefixed folders as private, the route lives at `src/app/design/page.tsx`; `next.config.ts` rewrites
`/_design` to `/design` in development only. Production renders `notFound()`.

The gallery shows foundations, controls, feedback and overlays, data display, motion, and both themes.
Use the theme toggle in the gallery header.

## Tokens

All colors are CSS variables in `src/app/globals.css`. Components use semantic Tailwind utilities
(`bg-background`, `text-muted-foreground`, `border-border`, `bg-accent-soft`, etc.); raw hex values
outside the token file are rejected by `npm run check:colors`.

### Light

| Token                | Value                            | Role                         |
| -------------------- | -------------------------------- | ---------------------------- |
| `--background`       | `#fcfcfd`                        | Page canvas                  |
| `--card`             | `#ffffff`                        | Discrete object surface      |
| `--sidebar`          | `#f5f6f8`                        | Navigation rail              |
| `--foreground`       | `#0f172a`                        | Primary ink                  |
| `--muted-foreground` | `#5b6578`                        | Helper and metadata          |
| `--border`           | `#e4e7ec`                        | Hairline rules               |
| `--input`            | `#7c879a`                        | Interactive boundary (3.6:1) |
| `--primary`          | `#2563eb`                        | Single blue accent           |
| `--accent-soft`      | `#eff4ff`                        | Soft blue surface            |
| `--success`          | `#15803d`                        | Verified/current             |
| `--warning`          | `#b45309`                        | Placeholder                  |
| `--destructive`      | `#dc2626`                        | Destructive action           |
| `--chart-1…5`        | blue, teal, amber, violet, slate | Distinct hue and lightness   |

### Dark

| Token                | Value     | Role                         |
| -------------------- | --------- | ---------------------------- |
| `--background`       | `#0f1218` | Page canvas                  |
| `--card`             | `#151922` | Discrete object surface      |
| `--sidebar`          | `#11151c` | Navigation rail              |
| `--foreground`       | `#e6e9ef` | Primary ink                  |
| `--muted-foreground` | `#98a1b3` | Helper and metadata          |
| `--border`           | `#232a36` | Hairline rules               |
| `--input`            | `#64748b` | Interactive boundary (3.7:1) |
| `--primary`          | `#6e9bff` | Single blue accent           |
| `--accent-soft`      | `#16203a` | Soft blue surface            |
| `--success`          | `#4ade80` | Verified/current             |
| `--warning`          | `#fbbf24` | Placeholder                  |
| `--destructive`      | `#f87171` | Destructive action           |

Dark is designed, not inverted: surfaces are blue-black, borders are low-contrast hairlines, and primary
foreground is dark ink so the lighter blue remains AA-compliant.

## Contrast

`tests/unit/contrast.test.ts` parses the token blocks and fails if a text pair drops below **4.5:1**, or if
input/ring/chart colors drop below **3:1** against the page. Current results:

- Light: foreground/background `17.4:1`; muted/background `5.7:1`; white on primary `5.2:1`; success/warning/destructive foregrounds `4.7–4.9:1`.
- Dark: foreground/background `15.4:1`; muted/background `7.2:1`; dark ink on primary `7.0:1`; success/warning/destructive foregrounds `6.8–11.2:1`.
- Chart series: `4.6–7.3:1` light and `6.9–11.2:1` dark.

## Typography

Geist Sans for UI/body and Geist Mono for metadata, both via `next/font/google` and CSS variables.

| Utility           | Role                                                                               |
| ----------------- | ---------------------------------------------------------------------------------- |
| `type-display`    | Hero display, `clamp(2.5rem, 5vw, 4.5rem)`, `0.98` line-height, `-0.03em` tracking |
| `type-page-title` | One `h1` per page, `clamp(1.75rem, 3vw, 2.25rem)`                                  |
| `type-lead`       | Lead paragraph under a page title, `1–1.25rem`, `1.6` line-height                  |
| `type-section`    | Section heading, `clamp(1.25rem, 2vw, 1.5rem)`                                     |
| `type-section-title` | Sub-section heading between section and card title, `1.0625–1.375rem`           |
| `type-card-title` | Card title, `1.0625rem`                                                            |
| `type-body`       | Body copy, `0.9375rem`, `1.65` line-height                                         |
| `type-helper`     | Helper copy, `0.8125rem`                                                           |
| `type-label`      | Mono uppercase label, `0.6875rem`, `0.12em` tracking                               |
| `type-metric`     | Mono tabular metric, `clamp(2.5rem, 4vw, 3.5rem)`                                  |
| `type-meta`       | Mono tabular metadata, `0.75rem`                                                   |

## Geometry and motion

- Radius scale is limited to `6 / 8 / 12px`; larger requests clamp to `12px`.
- 4px spacing base. Section rhythm uses `64–96px`.
- Resting cards use a 1px border, never a shadow. Shadows are reserved for overlays (dialog, sheet, dropdown, command, tooltip).
- Entry motion is a `4px` rise with opacity over `160ms`, using `cubic-bezier(0.16, 1, 0.3, 1)`.
- Hover transitions are `120–150ms`. No exit animations, no scroll-jacking, no bouncing.
- `prefers-reduced-motion: reduce` sets animation/transition duration to `0.01ms` and removes `.enter-rise` transforms.

## App shell

- Desktop sidebar is fixed from `lg`, `264px` expanded and `72px` collapsed (`--sidebar-width`). Collapsed
  icons are centered, keep their accessible names, and expose tooltips.
- Collapse state is a `sidebar_state` cookie owned by the browser. A `beforeInteractive` script applies
  `data-sidebar="collapsed"` before paint; CSS drives the width and label visibility. This avoids a flash
  without reading cookies on the server, so pages stay static (D3/D14). State is subscribed with
  `useSyncExternalStore` in `src/lib/sidebar.ts`.
- Header is sticky at `56px`: workspace path, page title, command trigger and theme toggle. The mobile menu
  trigger is 44px.
- Mobile drawer is a left Sheet, `min(88vw, 320px)` wide, with 44px rows, focus trapping, Escape close and
  focus return.
- Status bar is fixed at `28px`: workspace path, content date and the current CSS theme.
- Route stubs are development-only. In production each non-implemented route calls `notFound()`.
- The command palette foundation contains navigation entries only; full search and actions belong to Phase 13.
- One `#main-content` per page is the skip-link target. It receives `tabIndex={-1}` so focus moves there.
- `/_design` also renders inside the shell, so shell chrome can be reviewed against the gallery.

## Overview composition

`/` uses five numbered sections: **01 Profile**, **02 Selected work**, **03 Technology signals**,
**04 Career**, and **05 Contact**.

- The hero is an asymmetric 8/4 grid at `lg`. Profile copy and actions sit in the wide column; the
  narrow column is a portrait-first profile panel. A full-width 4:3 image sits above a quiet role
  caption and public project count; use no grid overlay on the photo. The monogram is the image fallback.
- The About identity panel uses the owner-provided portrait at `/profile/vivek-thakur.png`; the
  portrait appears in this panel as well, replacing the monogram when available.
  Use a portrait-oriented, face-aware crop with a fine border and minimal framing; retain the role
  details beside or below the image, never over the face. Keep the monogram as the missing-image
  fallback and avoid filters or decorative effects that compete with the portrait.
- Four derived metrics share a single top rule. The grid is 2×2 on mobile and four across at `lg`.
- Featured projects use branded 16:10 covers, contribution bullets, technology chips, and direct
  case-study links. Cards are one column on mobile and two columns from `md`; fallback covers use the
  project index so multiple projects remain visually distinct.
- The technology charts use the shared indexed `SectionHeader`, 12px axes, 12px card radius, and controls
  grouped in the chart toolbar. See `docs/CHARTS.md`.
- Experience and milestones form one **8/4 career band** at `lg`: verified roles on the left, a compact
  verified-milestone rail on the right, then one Activity link. On mobile they stack.
- The closing contact panel makes email the primary action and the contact page the secondary action.
- The `(overview)` route group owns the page and its `loading.tsx`; the skeleton mirrors the five-section
  geometry, including the chart pair and combined career band.
- Empty data renders `EmptyState`; summary values without verified data render `—`.

## Index patterns

- **Capability matrix (`/skills`)** — category rail on the left, ruled technology rows on the right. Usage is a marker plus text, coverage is a derived project count, and evidence is a row of case-study links. No card per technology; sparse coverage uses a quiet sentence instead of an empty box.
- **Milestone ledger (`/activity`)** — sticky year rail and hairline rows with a date column. The summary band derives verified count, years represented, and latest entry from the visible records. The project filter sits in a compact ruled toolbar, not a card.
- **Direct line (`/contact`)** — the email address is the hero, set in mono at `clamp(1.375rem, 3.6vw, 2.75rem)`, with write and copy actions. Profiles are ruled rows with handle-level URLs; the resume is a document strip, not a card.

## Components

Customized shadcn: Button, Input, Textarea, InputGroup, Badge, Card, Tabs, Tooltip, Dialog, Sheet, Skeleton, Separator, Command, Chart.

Custom compositions:

- `StatusBadge` — verified / current / placeholder, with icon and text.
- `MetricCard` — label, derived value, optional unit and helper; no card-in-card.
- `SectionHeader` — indexed section label, title, description and optional action.
- `EmptyState` — icon, title, description and recovery action.
- `TechChip` — compact mono technology label.
- `ProjectCover` — 16:10 project media with a branded monogram/grid fallback when no approved image
  exists; an optional project index distinguishes fallback covers in card grids. Real images use
  `next/image` and the project’s meaningful alt text.

Rule: add a custom component only when shadcn composition cannot meet a documented need. Document the
need here before adding it.
