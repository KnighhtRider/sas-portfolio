import { isYearMonth } from "./dates";

export function latestYearMonth(dates: readonly string[]): string | null {
  const valid = dates.filter(isYearMonth);

  if (valid.length === 0) {
    return null;
  }

  return valid.reduce((latest, date) => (date > latest ? date : latest));
}

export function yearsRepresented(dates: readonly string[]): number {
  const years = new Set<string>();

  for (const date of dates) {
    if (isYearMonth(date)) {
      years.add(date.slice(0, 4));
    }
  }

  return years.size;
}
