# Selected engineering milestones

The activity page is a dated milestone ledger sourced from `src/data/activity.ts`. Verified, valid year-month dates are grouped by year in reverse chronological order. Entries with placeholder status or unconfirmed dates appear only during development and carry a placeholder badge; production omits them.

The ledger uses a sticky year rail and hairline-separated rows instead of stacked cards, so a short verified record still reads as a composed document. The summary band shows verified milestones, years represented, and the latest entry. All three are derived from the visible records, so they update with the project filter.

Project filtering matches only a milestone's explicit `projectSlug`. The current verified records are employment events without project associations, so the page states that no milestones are linked to a project yet; filtering by a project then yields an honest empty state. Add project links to milestone records only when the association and date are verified.

The page describes selected milestones and makes clear that it does not show GitHub contribution or daily activity data. Do not add a heatmap, inferred work dates, or unverified events. The closing ledger note repeats the same rule and links to the career record and project index.
