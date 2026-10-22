import { SITE } from "@/lib/constants";
import type { Experience, Project, Technology } from "@/data/types";
import { formatDuration, monthNumber, parseYearMonth, type YearMonth } from "@/lib/dates";

const DEFAULT_AS_OF = SITE.contentUpdated.slice(0, 7);

function validMonth(value: string | undefined): YearMonth | null {
  if (!value) {
    return null;
  }

  return parseYearMonth(value);
}

function resolveAsOf(asOf: string) {
  const parsed = validMonth(asOf);

  if (parsed) {
    return { value: asOf, month: parsed };
  }

  const fallback = validMonth(DEFAULT_AS_OF);

  if (!fallback) {
    throw new Error("SITE.contentUpdated must use the YYYY-MM format.");
  }

  return { value: DEFAULT_AS_OF, month: fallback };
}

export function verifiedExperiences(experiences: Experience[]) {
  return experiences.filter((experience) => experience.status === "verified");
}

export function totalExperienceMonths(experiences: Experience[], asOf: string = DEFAULT_AS_OF) {
  const resolvedAsOf = resolveAsOf(asOf);
  const asOfMonth = monthNumber(resolvedAsOf.month);
  const ranges: { start: number; end: number }[] = [];

  for (const experience of verifiedExperiences(experiences)) {
    const start = validMonth(experience.start);

    if (!start) {
      continue;
    }

    const end = experience.end ? validMonth(experience.end) : resolvedAsOf.month;

    if (!end) {
      continue;
    }

    const startMonth = monthNumber(start);
    const endMonth = Math.min(monthNumber(end), asOfMonth);

    if (endMonth >= startMonth) {
      ranges.push({ start: startMonth, end: endMonth });
    }
  }

  ranges.sort((a, b) => a.start - b.start || a.end - b.end);

  let total = 0;
  let currentStart: number | null = null;
  let currentEnd: number | null = null;

  for (const range of ranges) {
    if (currentStart === null || currentEnd === null) {
      currentStart = range.start;
      currentEnd = range.end;
    } else if (range.start <= currentEnd + 1) {
      currentEnd = Math.max(currentEnd, range.end);
    } else {
      total += currentEnd - currentStart + 1;
      currentStart = range.start;
      currentEnd = range.end;
    }
  }

  if (currentStart !== null && currentEnd !== null) {
    total += currentEnd - currentStart + 1;
  }

  return total;
}

export function experienceDuration(experiences: Experience[], asOf: string = DEFAULT_AS_OF) {
  const resolvedAsOf = resolveAsOf(asOf);
  const months = totalExperienceMonths(experiences, resolvedAsOf.value);

  return {
    months,
    label: formatDuration(months),
    asOf: resolvedAsOf.value,
  };
}

export function currentExperience(experiences: Experience[]) {
  return verifiedExperiences(experiences).find((experience) => !experience.end);
}

export function countPublicProjects(projects: Project[]) {
  return projects.filter(
    (project) => project.visibility === "public" && project.status === "verified",
  ).length;
}

export function countFeaturedProjects(projects: Project[]) {
  return projects.filter(
    (project) =>
      project.visibility === "public" && project.status === "verified" && project.featured,
  ).length;
}

export function countTechnologyCategories(technologies: Technology[]) {
  return new Set(technologies.map((technology) => technology.category)).size;
}
