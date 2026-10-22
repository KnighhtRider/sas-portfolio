# Overview charts

The **03 / Technology signals** section on `/` uses the verified data layer in `src/lib/chart-data.ts`
and shows two views:

- **Technologies by category** counts the technology inventory by category. Donut segments and legend entries link to the matching `/skills?category=` filter. This is inventory coverage, not proficiency.
- **Projects per technology** counts each verified public project's technology tags once. The bar chart sorts by count, starts with six rows, and can expand to all rows. Tooltips and the table name the selected public projects behind each count.

Both charts use semantic `--chart-*` theme tokens, keyboard-accessible Recharts layers, a concise text
alternative, and a **View as table** control. The hidden project list is filtered by the shared
derivation helpers before chart shaping.

## Layout and controls

- The section uses the shared indexed `SectionHeader` for its title and **Explore all technologies** action.
- Chart cards use the same 12px radius as the rest of the Overview, a 124px header minimum, and controls
  grouped in the chart toolbar rather than the card header.
- **Show all** and **View as table** sit together in that toolbar and stay on one line. The toolbar wraps
  as a unit on narrow screens instead of compressing labels.
- Axis labels are 12px. Expanding the coverage chart grows the plot to fit all rows instead of squeezing
  them into the initial 246px height.

## Checks

- `npm run verify` — TypeScript, ESLint, color-token check, content check, and unit tests.
- `npm run test:e2e -- tests/e2e/overview.spec.ts` — overview chart content and interactions.
- Manual: open `/` in both themes; hover and keyboard-focus chart marks; use the category links; compare each **View as table** dataset; test **Show all** at 320px and desktop widths.
