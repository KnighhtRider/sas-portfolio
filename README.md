# Vivek Thakur — Portfolio

Frontend-only developer portfolio built as a premium dashboard with Next.js App Router, React,
TypeScript, Tailwind CSS v4, shadcn/ui, and Recharts. There is no backend, database, or runtime secret.

## Status

Implemented routes: `/`, `/projects`, `/projects/[slug]`, `/skills`, `/experience`, `/activity`,
`/about`, and `/contact`. Typed content lives in `src/data`; derived overview content is assembled in
`src/lib/overview.ts`. The design gallery is development-only at `http://localhost:3000/_design`.

Phase 16 is prepared but not signed off. The strict production content gate blocks public placeholders.
Lighthouse, manual keyboard and visual review, resume review, and live URL confirmation remain
outstanding in `docs/QA_REPORT.md` and the Phase 16 checklist. Unapproved philosophy and goals copy
has been removed from the profile data and About page until owner-approved wording is available.

## Commands

```bash
npm ci
npm run dev
npm run content:check -- --strict
npm run build        # strict content check, then Next.js production build
npm run start        # serve the production build
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run verify       # typecheck + lint + color check + content check + unit tests
```

## Deploy to Vercel

Import the repository root and keep the detected **Next.js** framework settings. Use `npm ci` as the
install command and `npm run build` as the build command; keep the default Next.js output setting.
The build runs strict content validation before `next build`, so it stops if public placeholders or
integrity errors remain. Resolve those findings before production deployment.

There are no required runtime secrets or other environment variables. After choosing the canonical
production origin, add `NEXT_PUBLIC_SITE_URL` in the Vercel project's **Production** environment as
an absolute HTTPS origin, for example `https://portfolio.example.com`. It supplies canonical URLs,
the sitemap, and social metadata at build time. Redeploy after changing it. Leave it unset for Preview
deployments unless you have a stable preview origin intended to be canonical.

After deployment, check `/`, `/projects`, `/experience`, `/contact`, `/sitemap.xml`, `/robots.txt`,
and a public project case study on the assigned domain. Run Lighthouse against the production URL and
complete the owner visual, keyboard, content, resume, and contact-link reviews in
`docs/QA_REPORT.md` and `PLAN.md` Phase 16.

## Editing portfolio content

- Profile information and the resume path: `src/data/profile.ts`.
- Project content and case studies: `src/data/projects.ts`.
- Skills and technologies: `src/data/technologies.ts`.
- Employment: `src/data/experience.ts`.
- Education: `src/data/education.ts`.
- Dated milestones: `src/data/activity.ts`.
- Project images use flat paths under `public/projects/`, such as `public/projects/hmis.png`. Set
  `cover.src`, descriptive `cover.alt`, and the applicable anonymization/illustrative flags in the
  matching project record. Never include patient or confidential client data. Employer screenshots
  require owner permission and anonymization.
- The portrait is `public/profile/vivek-thakur.png`. The resume is
  `public/resume/vivek_Thakur_Resume.pdf`; review its contents before public release.

## Source of truth

- `PLAN.md` — product decisions, phase tracker, and acceptance checklists
- `CONTENT_INTAKE.md` — confirmed personal content and publication rules
- `docs/CONTENT_GUIDE.md` — data model and editing conventions
- `docs/VERSIONS.md` — pinned versions and compatibility decisions
- `docs/QA_REPORT.md` — completed QA scope and remaining owner acceptance

Do not fabricate employers, dates, metrics, links, or screenshots. Keep unverified details out of public content.
