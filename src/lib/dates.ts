const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export type YearMonth = {
  year: number;
  month: number;
};

export function parseYearMonth(value: string): YearMonth | null {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(value);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);

  if (year < 1900 || year > 2100) {
    return null;
  }

  return { year, month };
}

export function isYearMonth(value: string) {
  return parseYearMonth(value) !== null;
}

export function isYear(value: string) {
  return /^\d{4}$/.test(value) && Number(value) >= 1900 && Number(value) <= 2100;
}

export function compareYearMonth(a: YearMonth, b: YearMonth) {
  return a.year * 12 + a.month - (b.year * 12 + b.month);
}

export function monthNumber(value: YearMonth) {
  return value.year * 12 + value.month - 1;
}

export function monthsInclusive(start: YearMonth, end: YearMonth) {
  const months = compareYearMonth(end, start) + 1;

  return months > 0 ? months : 0;
}

export function formatDuration(months: number) {
  if (months <= 0) {
    return "0 mo";
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) {
    return `${remainingMonths} mo`;
  }

  if (remainingMonths === 0) {
    return `${years} yr`;
  }

  return `${years} yr ${remainingMonths} mo`;
}

export function formatMonthYear(value: string) {
  const parsed = parseYearMonth(value);

  if (!parsed) {
    return value;
  }

  return `${MONTH_NAMES[parsed.month - 1] ?? ""} ${parsed.year}`;
}
