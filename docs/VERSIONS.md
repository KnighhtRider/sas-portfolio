# VERSIONS.md

Last verified: **2026-10-22**

Verification method: npm registry (`npm view <package> version`) plus official documentation. `opencode mcp list` reported `context7` connected on 2026-10-22, but the current session did not expose its tools; re-verify these entries with Context7 in a restarted session during Phase 1. No version, command, or API signature in this file is guessed.

## Environment

| Item | Value | Notes |
|---|---|---|
| OS | Windows (`win32`) | |
| Node.js | `24.22.1` | Active LTS line; satisfies Next, Vitest and Playwright requirements |
| npm | `11.19.1` | Package manager decision D1 |
| Git | `2.56.0` | |
| Repo path | `E:\Dev\sas-portfolio` | No spaces |

## Pinned versions

Installed in Phases 1–4. Phase 4 added no dependency. The lockfile is the source of truth for transitive versions.

| Package | Version | Source | Notes |
|---|---|---|---|
| `next` | `16.4.2` | npm registry; [Next.js docs](https://nextjs.org/docs) | App Router; `next lint` removed in v16 |
| `react` | `19.3.1` | npm registry | Satisfies Next `^19.0.0` peer |
| `react-dom` | `19.3.1` | npm registry | Must match React |
| `tailwindcss` | `4.3.3` | npm registry; [Tailwind Next.js guide](https://tailwindcss.com/docs/installation/framework-guides/nextjs) | v4 CSS-first setup |
| `@tailwindcss/turbopack` | `4.3.3` | npm registry | Loader used by the generated Next 16 scaffold; `@tailwindcss/postcss` is not needed |
| `shadcn` | `4.22.1` | npm registry; [shadcn CLI](https://ui.shadcn.com/docs/cli) | Initialized with `--base radix --preset nova`; produces `style: "radix-nova"` |
| `radix-ui` | `1.8.1` | npm registry | Unified Radix package installed by shadcn |
| `cn` | `0.5.0` | npm registry | shadcn's `cn` helper package; `src/lib/utils.ts` re-exports it |
| `class-variance-authority` | `0.7.1` | npm registry | shadcn dependency |
| `tw-animate-css` | `1.4.0` | npm registry | shadcn animation utilities |
| `lucide-react` | `1.61.0` | npm registry | Icon library |
| `next-themes` | `0.4.6` | npm registry; [README](https://github.com/pacocoursey/next-themes) | Class strategy, system default |
| `cmdk` | `1.1.1` | npm registry | Command palette primitive |
| `recharts` | `3.10.1` | npm registry | Chart wrapper peer; React 19 supported |
| `typescript` | `6.0.3` | npm registry | **Pin this.** Latest `7.0.2` is outside `typescript-eslint` support (`<6.1.0`) |
| `eslint` | `10.13.0` | npm registry; [Next.js ESLint docs](https://nextjs.org/docs/app/api-reference/config/eslint) | `eslint-config-next@16.4.0+` supports ESLint 10 |
| `eslint-config-next` | `16.4.2` | npm registry | Match Next version |
| `eslint-config-prettier` | `10.1.8` | npm registry | Disables formatting rules that conflict with Prettier |
| `prettier` | `3.9.10` | npm registry | Formatting only |
| `vitest` | `5.0.5` | npm registry; [Vitest guide](https://vitest.dev/guide/) | Requires Vite `>=6.4.0` and Node `>=22.12.0` |
| `vite` | `8.3.5` | npm registry | Explicit peer for Vitest 5 and `@vitejs/plugin-react` 6 |
| `@vitejs/plugin-react` | `6.1.2` | npm registry | Requires Vite `^8.0.0` |
| `jsdom` | `30.1.3` | npm registry | Unit test DOM environment |
| `@playwright/test` | `1.64.1` | npm registry; [Playwright install](https://playwright.dev/docs/intro) | Node 24 supported |
| `@axe-core/playwright` | `4.14.0` | npm registry | Accessibility checks on the design gallery |
| `@types/node` | `24.19.2` | npm registry | Matches Node 24 line |

`motion@14.6.0` was installed in Phase 13 after checking the official Motion React installation and accessibility documentation on 2026-10-22.

## Compatibility decisions

1. **TypeScript is pinned to `6.0.3`, not latest.** `typescript-eslint@8.72.0` declares `typescript >=4.8.4 <6.1.0`. Installing TypeScript `7.0.2` would break the typed lint setup or force a suppression, which the project forbids. Revisit only when `typescript-eslint` supports TypeScript 7.
2. **ESLint 10 is allowed by Next.js 16.4+.** Next's docs state `eslint-config-next` supports ESLint 9 and 10; ESLint 10 requires Node `^20.19.0`, `^22.13.0` or `>=24`, and the installed Node `24.22.1` satisfies this. Some bundled plugins may emit peer warnings; this is documented by Next and is not a reason to disable rules.
3. **`next lint` is removed in Next.js 16.** Use the ESLint CLI (`eslint .`) via a `lint` script and a flat `eslint.config.mjs`. Do not add a `next lint` script.
4. **shadcn must use the Radix base.** The CLI supports `-b, --base <base>` with `base`, `radix`, or `aria`. The project locked shadcn/ui + Radix, so Phase 1 uses `--base radix` and must not silently accept the default base.
5. **shadcn + Tailwind v4.** `init --base radix --preset nova` produced `style: "radix-nova"`, CSS variables, the `tw-animate-css` and `shadcn/tailwind.css` imports, and a `cn` re-export in `src/lib/utils.ts`. Phase 2 replaces the generated neutral tokens with Precision Console tokens; do not add a `tailwind.config.js`.
6. **Recharts 3.x supports React 19.** Peer dependencies allow `^19.0.0`. On 2026-10-22, the installed shadcn chart wrapper and the official [Recharts PieChart](https://recharts.github.io/en-US/api/PieChart/), [Tooltip](https://recharts.github.io/en-US/api/Tooltip/) and [shadcn Chart](https://ui.shadcn.com/docs/components/radix/chart) documentation confirmed the composition API used in Phase 6, including keyboard accessibility and tooltip payload support. The official Recharts Cell guide notes that `Cell` is deprecated for v4, so per-row `fill` data is used instead.
7. **Motion API.** Installed `motion@14.6.0` from the npm registry on 2026-10-22. The official [Motion React accessibility guide](https://motion.dev/docs/react-accessibility) and [`useReducedMotion`](https://motion.dev/docs/react-use-reduced-motion) docs confirm imports from `motion/react`, `MotionConfig reducedMotion="user"`, and the hook for adapting or skipping animations. `MotionConfig` disables transform/layout motion but leaves opacity animation active, so `PageTransition` skips its entry animation when reduced motion is enabled.
8. **next-themes.** Use `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `suppressHydrationWarning` on `<html>`. Do not render theme-dependent text during SSR: the gallery toggle uses a static label and switches icons with `dark:` CSS. Theme persistence is covered by Playwright.
9. **Fonts.** Geist and Geist Mono are available through Google Fonts; the CSS API returned valid `@font-face` rules on 2026-10-22. `next/font/google` loads both with CSS variables `--font-geist-sans` and `--font-geist-mono`.
10. **OG images.** Use `ImageResponse` from `next/og` (Next 16 docs). Keep the generated bundle under 500 KB; only flexbox and a CSS subset are supported. No `display: grid` in OG JSX.
11. **`create-next-app` defaults changed.** Verified 2026-10-22: Next 16's CLI defaults include Cache Components and an `AGENTS.md` file. The scaffold was generated with `--empty --src-dir --no-cache-components --no-agents-md --no-agent-feedback --no-react-compiler --disable-git --skip-install`.
12. **Node requirements.** Next requires `>=20.9.0`; Vitest requires `>=22.12.0`; Playwright supports 22/24/26. Node `24.22.1` satisfies all three.
13. **Vite is a direct dev dependency.** `@vitejs/plugin-react@6.1.2` requires `vite@^8.0.0`; `vitest@5.0.5` accepts Vite 8. Vitest 5 requires Node `>=22.12.0`.
14. **Design gallery route.** Next.js excludes `_`-prefixed folders from routing (verified in the Next 16 project-structure docs). The gallery page is `src/app/design/page.tsx`; `next.config.ts` rewrites `/_design` to `/design` only in development, and the page calls `notFound()` in production.
15. **Sidebar cookie without dynamic rendering.** Reading `sidebar_state` with Next's server `cookies()` would opt every route into dynamic rendering, conflicting with the static-first decision (D3). Phase 3 uses a `beforeInteractive` `next/script` to apply the cookie before paint, CSS variables for the width, and `useSyncExternalStore` for post-hydration state. The cookie stores a non-sensitive UI preference only. This is the Phase 3 interpretation of D14; a strict server-read requirement would also require changing D3.
16. **Shell dependencies.** Sidebar tooltips reuse `radix-ui` through the shadcn Tooltip. The shell uses the existing Lucide, Sheet, Command and Button primitives. Phase 13 adds the planned Motion dependency for reduced-motion-aware page entry transitions.
17. **Content check uses Node's native TypeScript stripping.** Node `24.22.1` runs the typed data modules directly through `scripts/content-check.mjs`; no `tsx`, `ts-node`, or build step was added. The CLI imports `.ts` files with explicit extensions and `tsconfig.json` enables `allowImportingTsExtensions` (safe because `noEmit` is set). The package remains CommonJS-default; the CLI suppresses only `MODULE_TYPELESS_PACKAGE_JSON`. Data modules use type-only imports; the validator imports the shared `types.ts` constants and `dates.ts` through explicit `.ts` specifiers, keeping Node ESM resolution predictable.
18. **URL-backed project filters.** On 2026-10-22, the installed Next.js 16 docs for [`useSearchParams`](https://nextjs.org/docs/app/api-reference/functions/use-search-params) confirmed the Client Component + `Suspense` requirement for prerendered routes. The installed [Linking and Navigating guide](https://nextjs.org/docs/app/getting-started/linking-and-navigating#native-history-api) documents native `history.replaceState` integration with `useSearchParams`; Phase 7 uses it to keep filter state in the URL without adding a history entry per search keystroke.
19. **Static case-study routes.** On 2026-10-22, the installed Next.js 16 [dynamic routes](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes), [`generateMetadata`](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), and [`dynamicParams`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams) guides confirmed promise-based route params, static params generation, server metadata generation, and 404 behavior for ungenerated slugs with `dynamicParams = false`. Phase 8 generates only public, verified project slugs.
20. **SEO metadata APIs.** On 2026-10-22, the installed Next.js 16.4.2 guides confirmed server-only `metadata`/`generateMetadata`, generated `opengraph-image` and `twitter-image` files with `ImageResponse` and `generateImageMetadata`, `MetadataRoute.Sitemap`, `MetadataRoute.Robots`, generated `icon.tsx`/`apple-icon.tsx`, and JSON-LD in a native script with `<` escaped. See [metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), [social images](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image), [sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap), [robots](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots), [icons](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons), and [JSON-LD](https://nextjs.org/docs/app/guides/json-ld).

## Dependency audit

`npm audit` reports 9 high advisories, all in dev/build tooling: `shadcn` → `fast-glob`/`micromatch`/`braces`, and `eslint-config-next` → `fast-glob`. The suggested fix is a breaking downgrade (`eslint-config-next@14.2.35`, `shadcn@1.0.0`), so `npm audit fix --force` was not run. No production runtime dependency is affected. Revisit when upstream ships a patched `braces`/`fast-glob`.

## Open verification items

| Item | Status | Action |
|---|---|---|
| Context7 connection | Connected; tools available in the Phase 1 session | Re-check each library API in the phase that uses it |
| shadcn component versions | Registry-resolved | Do not pin individual components manually; lockfile records resolved versions |
| Recharts guide | Official API references checked on 2026-10-22; Context7 tools were unavailable in this session | Re-check with Context7 when available; current chart implementation follows the official PieChart/Tooltip APIs and installed shadcn wrapper |
| `create-next-app` negation flags | Verified and used on 2026-10-22 | None |
| Canonical domain | Pending owner's Vercel deployment | Set `NEXT_PUBLIC_SITE_URL` only when the final domain exists |
