# Experience timeline

The experience route renders verified entries from `src/data/experience.ts`, newest first. Role dates use the source month values; current roles show `Present`. The combined duration is derived from verified month ranges and counts overlapping months once. The calculation's as-of month comes from the content date configured in `src/lib/constants.ts`.

Technologies are resolved from the technology inventory. Project links are restricted to public, verified case studies, so a role with no linked public project says so rather than implying one. If a verified entry has an invalid or unknown date, the route shows a pending-confirmation label and a placeholder badge in development only.

Proofread role titles, dates, summaries, and responsibilities against the actual work before accepting this phase. Keep responsibilities concrete and do not add unsupported metrics or client details.
