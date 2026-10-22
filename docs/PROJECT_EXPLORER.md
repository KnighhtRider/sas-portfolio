# Project explorer

The `/projects` route lists verified, public project dossiers from `src/data/projects.ts`. The hidden
SureGo placeholder is filtered on the server before project data is passed to the interactive client
filter. No private or placeholder project content is included in the explorer bundle.

## Shareable filters

The URL query string is the source of truth for the project explorer controls:

| Parameter  | Meaning                                              | Example                      |
| ---------- | ---------------------------------------------------- | ---------------------------- |
| `q`        | Match project title, summary, or problem description | `?q=centralized`             |
| `tech`     | Match a technology ID tagged to the project          | `?tech=react`                |
| `category` | Match a project category ID                          | `?category=content-platform` |
| `featured` | Show featured projects only when set to `true`       | `?featured=true`             |

Search changes replace the current history entry so each typed character does not add a Back-button
step. Other filter changes share the same URL-state behavior. Refreshing or sharing the URL restores
the selected filters. Invalid technology and category values are ignored.

The explorer derives available filters from public verified project data. If the portfolio does not
yet contain a public project with a given technology or category, that option is not shown. The
featured filter stays available even when every current public project is featured; it may become
more selective as verified project data changes.

Each dossier links to its case study through the project title and a visible `Read case study`
action directly under the summary.
