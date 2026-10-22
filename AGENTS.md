# AGENTS.md

Frontend-only developer portfolio (Vivek Thakur) styled as a premium dashboard. **Not a CMS.**

**Source of truth:** `PLAN.md`. Read §0, §3–§9 and §11 once, then work only on the phase the user names in §10.

Rules:
- One phase per session. Never start later phases. Stop after each phase and hand over the Manual Acceptance Checklist.
- TypeScript strict. No `any`, no `@ts-ignore`, no disabled lint rules.
- No backend, database, auth, Redux, TanStack Query, analytics, 3D/WebGL, or extra UI libraries.
- **Never fabricate** employers, dates, metrics, user counts, performance gains, awards, or skill percentages. Unknown facts = explicit placeholders (`status: "placeholder"`). Derived numbers come from data, never typed.
- **Confidentiality:** no real patient/client data, client names, internal URLs or credentials; employer screenshots only with explicit user permission and `anonymized: true`.
- SureGo stays `visibility: "hidden"` until the user verifies its details.
- Never guess versions, install commands or API signatures: check [VERIFY] items with Context7/official docs and record in `docs/VERSIONS.md`.
- Server components by default; small client islands only. Semantic tokens only (no raw hex in components).
- Write the phase's tests with the code; run `npm run verify` and report real output. Never claim untested things work.
- Create/maintain `opencode.json` yourself (PLAN.md §0.3). You cannot restart OpenCode; tell the user to restart and connect MCP servers, then wait.
- Do not tick the tracker or tag `phase-N-done` until the user confirms. Small commits prefixed `P<number>:`.
- If the plan conflicts with reality, stop and propose a change to `PLAN.md`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
