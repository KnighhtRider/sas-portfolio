# CONTENT_GUIDE.md

Owned by Phase 4. The verified facts live in `CONTENT_INTAKE.md`; the types live in
`src/data/types.ts`. Edit data files, not components.

## Quick edit map

| What to edit                                                       | File                                          |
| ------------------------------------------------------------------- | --------------------------------------------- |
| Name, role, headline, summary, email, profile links, interests, resume path | `src/data/profile.ts`                   |
| Skills and technology categories                                    | `src/data/technologies.ts`                    |
| Project dossiers                                                    | `src/data/projects.ts`                        |
| Employment history                                                  | `src/data/experience.ts`                      |
| Education                                                           | `src/data/education.ts`                       |
| Dated employment milestones                                         | `src/data/activity.ts`                        |
| Content date and site-level constants                               | `src/lib/constants.ts`                        |
| Derived durations and counts                                         | `src/lib/metrics.ts`, `src/lib/chart-data.ts` |

Do not type counts, durations, percentages, or project totals into components. They are derived.

## Date formats

- Experience, projects, and milestones use `YYYY-MM`, for example `2026-05`.
- Education uses `YYYY`, for example `2023`.
- Durations count the start and end months inclusively. `2024-05` to `2026-04` is 24 months.
- If a project or milestone date is unknown, omit `period` or leave the project undated. Never invent a date.
- Experience duration is derived from the verified employment dates and uses `SITE.contentUpdated`
  as the as-of month. Update that date when the content is reviewed. Future months are clamped and
  overlapping verified ranges are counted once. Verified experiences must not overlap and only one may
  be current; `npm run content:check` enforces both rules.

## Status and visibility

Every profile, project, experience, education entry, and milestone has:

```ts
status: "verified" | "placeholder";
```

Projects also have:

```ts
visibility: "public" | "hidden";
```

- `verified` means the content comes from `CONTENT_INTAKE.md` and can be shown.
- `placeholder` means the content is not ready to publish. Use obvious text such as
  `[TODO: confirm ...]` for unknown facts.
- `hidden` projects are excluded from public counts, coverage, and featured lists. Hidden items are
  still listed by `npm run content:check`.
- A hidden project must not be `featured`.
- A public experience or milestone must not reference a hidden project.
- A hidden placeholder does not fail the strict publication gate, but malformed hidden data still fails
  integrity. Keep drafts structurally valid; fix or remove broken references before handoff.

`PROFILE.status` describes the profile fields actually shipped. Unapproved philosophy and goals copy
was removed from the data model and About page; add it back only with owner-approved wording.

## Profile

`src/data/profile.ts` is the only source for:

- name, short display role, long headline, summary, and public email
- GitHub and LinkedIn links
- technical interests and optional resume path

`role` is the short shell label. `headline` keeps the full intake wording for the About page. Do not
replace either with a new job title.

`src/lib/constants.ts` derives the shell's identity and contact values from this file. Do not add a
second copy of the email or profile URLs.

Keep the `VT` monogram in the shell. The owner-provided portrait is stored at
`public/profile/vivek-thakur.png` and referenced from profile data as `/profile/vivek-thakur.png`; it
appears in the overview signal and About identity panels. Keep the monogram as the missing-image
fallback. The owner-provided resume is stored at `public/resume/vivek_Thakur_Resume.pdf` and
referenced by profile data as `/resume/vivek_Thakur_Resume.pdf`. Before public release, the owner must
review its facts, contact details, and confidentiality. Resume links are shown only when a safe local
PDF path resolves to an existing file. Path traversal and remote HTTP links are rejected.

## Technologies

Each technology is:

```ts
{ id: "react", name: "React", category: "frontend", usage: "professional" }
```

- `id` is a stable kebab-case key. Never rename an ID without updating every project and experience.
- `category` is one of `frontend`, `state-data`, `backend-api`, `databases`, or `tools-deploy`.
- `usage` is `professional` or `learning`.
- Laravel is `learning` and is not tagged to HIS or ACGIL.
- Do not add percentages, levels, or proficiency scores. Coverage counts come from public project tags.

When adding a technology, add it here first, then reference its ID from a project or experience.
Unknown IDs fail `npm run content:check` and the integrity tests.

## Projects

Each project defines the dossier content: summary, problem, role, contribution, features, decisions,
technologies, category, featured state, visibility, and status.

### HIS/HMIS

- Public and verified.
- Employer context: ACGIL.
- Use "contributed to" wording across Purchase, Ambulance, Pharmacy, Inventory, Dietary, MIS Reports,
  and Registration. Do not claim sole ownership or leadership.
- Project dates are unknown; do not add `period`.
- No hospital or client names.
- No employer screenshots or project links. The supplied HIS/HMIS cover is a portfolio illustration,
  not a production screenshot; it contains synthetic interface figures and must retain its visible
  `Illustrative UI` label and illustrative alt text.
- Technologies: React, JavaScript, Redux Toolkit, RTK Query, PHP, PostgreSQL, REST APIs, Git.
- Tags describe confirmed project-level use, not per-module proof. Next.js and TypeScript are omitted
  because the intake only confirms them for ACGIL overall and explicitly warns against claiming
  per-module adoption. Redux Toolkit/RTK Query stay because they are confirmed in the HIS environment;
  do not add module-level claims for them.

### ACGIL Corporate Website

- Public and verified based on the owner's confirmation that they built the site with Next.js.
- Live project: `https://acgil.com/`.
- Describe the site as presenting company information, enterprise products, industries, solutions,
  and contact options.
- The owner confirmed frontend optimization and established web development practices. Do not add
  specific techniques, performance scores, dates, or other technologies until supplied.
- No employer screenshots or internal details are included.
- Technology: Next.js.

### Surynova Solar Website

- Public and verified based on the owner's confirmation that they built the site with Next.js.
- Live project: `https://suryanova-knighhtriders-projects.vercel.app/`.
- Describe the site as presenting rooftop solar services, system options, subsidy information,
  net metering education, and enquiry paths. Do not repeat customer names, testimonials, or
  unverified marketing metrics from the source content.
- The owner confirmed memoization and frontend performance optimization work with attention to
  LCP and Lighthouse guidance. Do not publish scores or measured gains unless supplied.
- The supplied solar cover is illustrative and must retain its `Illustrative image` label.
- Technology: Next.js.

### Alaknanda Metro Advertising Platform

- Public project and lead pipeline dashboard confirmed by the owner.
- Live platform: `https://alaknanda-metro.vercel.app/`.
- Describe it as a Delhi Metro advertising platform with station exploration and campaign enquiry
  paths, paired with a dashboard for tracking advertising leads.
- The public deployment uses Next.js. Do not publish private lead information, internal dashboard
  URLs, or unverified business metrics.
- The owner supplied `public/projects/metro.png` as the approved public homepage cover; keep its
  descriptive alt text and full-width contain treatment.
- Technology: Next.js.

### Real Estate Lead Generation Landing Page

- Public and verified based on the owner's project description.
- Live page: `https://lp-theme.vercel.app/`.
- Describe it as a property campaign landing page with repeated buyer enquiry forms and callback,
  phone, and WhatsApp contact paths. Do not include property sales or conversion results.
- The owner confirmed HTML, CSS, JavaScript, and PHP. PHP is used for lead form handling.
- The supplied `public/projects/lp.png` is the approved public landing-page cover; use descriptive
  alt text and preserve the full-width layout with contain fitting.
- Technologies: HTML, CSS, JavaScript, PHP.

### React Streaming UI Clone

- Public and verified based on the owner's project description.
- Live project: `https://gilded-rugelach-66b018.netlify.app/`.
- Describe it as an independent React recreation of a streaming browse interface, with a featured
  title and Play/More Info actions. State clearly that it is not affiliated with Netflix.
- The owner supplied `public/projects/netflix.png` as the cover; retain the visible `Independent UI
  Clone` label and do not suggest Netflix endorsement.
- Technology: React.

### Centralized Blog CMS

- Public and verified.
- Full-stack role on frontend, backend, and deployment.
- Do not add database, authentication, image-storage, or backup details until verified.
- Project dates, public URL, and repository link are unknown; omit them.
- Technologies: Next.js, REST APIs, AWS, PM2.
- The supplied CMS cover is a portfolio illustration, not a production screenshot; its figures are
  synthetic and must retain the visible `Illustrative UI` label and illustrative alt text.

### SureGo

- Hidden and placeholder. Do not publish it.
- Keep the `[TODO: ...]` text until the project details and permission are confirmed.
- Complete every required field before changing `visibility` to `public` or `status` to `verified`.

### Adding a project

1. Pick a unique kebab-case `slug`.
2. Add verified text fields. Omit unknown optional fields.
3. Reference only existing technology IDs in `techIds`.
4. Set `status`, `visibility`, and `featured` honestly.
5. Run `npm run content:check` and `npm run test`.
6. Confirm that project counts, coverage, and featured lists changed without editing components.

## Experience

- ACGIL: `2026-05`, current, public and verified.
- Digital Rubix: `2024-05` to `2026-04`, public and verified.
- `projectSlugs` may only reference public projects.
- `techIds` must exist in `technologies.ts`.
- The 30+ landing-page themes claim is from the intake. Do not add the 300+ client or 200+ daily-page
  business-scale figures to the portfolio.
- Do not type a total duration. It is derived.

## Education

Both entries are verified. Years only; do not publish CGPA. Keep the institution and degree wording
from the intake.

## Activity

Only the three verified employment milestones are present:

- Digital Rubix start: `2024-05`
- Digital Rubix end: `2026-04`
- ACGIL start: `2026-05`

Do not assign dates to HIS/HMIS modules, CMS launches, or performance work without verified records.

## Derived metrics

`src/lib/metrics.ts` provides:

- total verified experience duration
- current verified role
- public and featured project counts
- technology category count

`src/lib/chart-data.ts` provides:

- technologies by category
- public-project coverage by technology
- featured projects
- grouped skills with project counts

`src/lib/overview.ts` shapes the Overview without typing UI numbers:

- experience duration plus its `as of` label
- public project count, technology category count, and verified milestone count
- featured project cards (first two contribution bullets and first five technology names)
- newest-first experience and milestone previews

Hidden projects and placeholder items do not enter public metrics. If a metric has no verified source,
the Overview renders `—`; if a collection is empty, the section renders its empty state. Chart labels
describe counts, never skill level. Empty arrays must return empty or zero results, not errors.

## Covers, galleries, and confidentiality

- Project covers use the branded monogram fallback until a real image is supplied.
- No employer screenshots are currently approved.
- Any future cover or gallery image needs `anonymized: true` and meaningful alt text. Never include
  patient data, client names, internal URLs, credentials, or infrastructure identifiers.
- Public covers or gallery images with `anonymized: false` fail validation.
- Do not add internal URLs or credentials to any text field. External links must be HTTPS; localhost,
  loopback, private, link-local, example, and `.local` hosts are rejected.

## Content check

```bash
npm run content:check          # report; exit 0 unless integrity fails
npm run content:check -- --strict  # fail if any public placeholder remains
```

The check validates unique IDs, project/technology references, dates, overlapping or multiple current
experiences, hidden-project leakage, safe HTTPS/local resume links, image anonymization, placeholder
text in verified items, and status/visibility rules. It prints all public placeholders and hidden items.
A hidden placeholder does not block the strict gate; a public placeholder does. Integrity errors block
both report and strict mode.

Current expected output includes:

- integrity pass
- 25 technologies, 7 public projects, 1 hidden project, 2 experiences, 2 education entries, 3 milestones
- one public placeholder: the profile draft
- one hidden item: SureGo

## After editing

```bash
npm run format
npm run verify          # includes content:check
npm run build
```

`npm run verify` now runs the content report after typecheck, lint, and the raw-color scan. Run strict
mode separately before a production handoff. If a reference is wrong, tests fail. Fix the data; do not
weaken the check or add a suppression.
