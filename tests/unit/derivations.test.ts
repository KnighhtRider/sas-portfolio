import { describe, expect, it } from "vitest";
import { EDUCATION } from "@/data/education";
import { EXPERIENCES } from "@/data/experience";
import { PROJECTS } from "@/data/projects";
import { TECHNOLOGIES } from "@/data/technologies";
import {
  featuredProjects,
  getPublicProjects,
  groupSkills,
  projectsPerTech,
  techByCategory,
} from "@/lib/chart-data";
import { filterProjects, parseProjectFilters } from "@/lib/project-filters";
import { formatDuration, formatMonthYear, monthsInclusive, parseYearMonth } from "@/lib/dates";
import {
  countFeaturedProjects,
  countPublicProjects,
  countTechnologyCategories,
  currentExperience,
  experienceDuration,
  totalExperienceMonths,
} from "@/lib/metrics";

describe("date helpers", () => {
  it("parses valid year-month values only", () => {
    expect(parseYearMonth("2026-05")).toEqual({ year: 2026, month: 5 });
    expect(parseYearMonth("2026-13")).toBeNull();
    expect(parseYearMonth("2026-5")).toBeNull();
  });

  it("counts inclusive months and formats durations", () => {
    expect(monthsInclusive({ year: 2024, month: 5 }, { year: 2026, month: 4 })).toBe(24);
    expect(monthsInclusive({ year: 2026, month: 5 }, { year: 2026, month: 10 })).toBe(6);
    expect(formatDuration(30)).toBe("2 yr 6 mo");
    expect(formatDuration(24)).toBe("2 yr");
    expect(formatDuration(0)).toBe("0 mo");
    expect(formatMonthYear("2026-10")).toBe("Oct 2026");
  });
});

describe("experience metrics", () => {
  it("derives the verified duration with inclusive months", () => {
    expect(totalExperienceMonths(EXPERIENCES)).toBe(30);
    expect(experienceDuration(EXPERIENCES)).toEqual({
      months: 30,
      label: "2 yr 6 mo",
      asOf: "2026-10",
    });
  });

  it("returns the current verified role", () => {
    expect(currentExperience(EXPERIENCES)?.id).toBe("acgil");
  });

  it("excludes placeholder experiences and handles empty data", () => {
    const experiences = structuredClone(EXPERIENCES);

    if (!experiences[0]) {
      throw new Error("Fixture has no experience");
    }

    experiences[0].status = "placeholder";

    expect(totalExperienceMonths(experiences)).toBe(24);
    expect(totalExperienceMonths([])).toBe(0);
    expect(experienceDuration([]).label).toBe("0 mo");
  });

  it("clamps future months and does not double-count overlaps", () => {
    expect(totalExperienceMonths(EXPERIENCES, "2025-04")).toBe(12);

    const overlapping = structuredClone(EXPERIENCES);
    const digitalRubix = overlapping[1];

    if (!digitalRubix) {
      throw new Error("Fixture has no second experience");
    }

    digitalRubix.end = "2026-05";

    expect(totalExperienceMonths(overlapping)).toBe(30);
  });

  it("uses the content date when asOf is invalid", () => {
    expect(totalExperienceMonths(EXPERIENCES, "not-a-month")).toBe(30);
    expect(experienceDuration(EXPERIENCES, "not-a-month").asOf).toBe("2026-10");
  });
});

describe("project and technology derivations", () => {
  it("filters to public verified projects", () => {
    expect(getPublicProjects()).toHaveLength(7);
    expect(featuredProjects()).toHaveLength(7);
    expect(countFeaturedProjects(PROJECTS)).toBe(7);
    expect(countPublicProjects(PROJECTS)).toBe(7);
    expect(countTechnologyCategories(TECHNOLOGIES)).toBe(5);
  });

  it("counts technologies by category", () => {
    const counts = techByCategory();
    const total = counts.reduce((sum, category) => sum + category.count, 0);

    expect(counts.map((category) => category.count)).toEqual([7, 2, 6, 3, 7]);
    expect(total).toBe(25);
  });

  it("counts only public project coverage and excludes hidden projects", () => {
    const coverage = projectsPerTech();

    expect(coverage.find((technology) => technology.techId === "rest-apis")?.count).toBe(2);
    expect(coverage.find((technology) => technology.techId === "react")?.count).toBe(2);
    expect(coverage.find((technology) => technology.techId === "nextjs")?.count).toBe(4);
    expect(coverage.some((technology) => technology.projectSlugs.includes("surego"))).toBe(false);
    expect(coverage.every((technology) => technology.count > 0)).toBe(true);
  });

  it("accepts a custom technology list for project coverage", () => {
    const react = TECHNOLOGIES.find((technology) => technology.id === "react");

    if (!react) {
      throw new Error("Fixture has no React technology");
    }

    expect(projectsPerTech(PROJECTS, [react])).toEqual([
      {
        techId: "react",
        name: "React",
        count: 2,
        projectSlugs: ["his-hmis", "react-streaming-ui-clone"],
      },
    ]);
  });

  it("groups skills without inventing percentages", () => {
    const groups = groupSkills();
    const frontend = groups.find((group) => group.category === "frontend");
    const laravel = groups
      .flatMap((group) => group.technologies)
      .find((technology) => technology.id === "laravel");

    expect(groups).toHaveLength(5);
    expect(frontend?.technologies).toHaveLength(7);
    expect(laravel?.usage).toBe("learning");
  });

  it("handles empty collections", () => {
    expect(techByCategory([]).map((category) => category.count)).toEqual([0, 0, 0, 0, 0]);
    expect(projectsPerTech([])).toEqual([]);
    expect(groupSkills([], []).every((group) => group.technologies.length === 0)).toBe(true);
    expect(featuredProjects([])).toEqual([]);
    expect(countPublicProjects([])).toBe(0);
    expect(EDUCATION).toHaveLength(2);
  });
});

describe("project explorer filters", () => {
  it("filters verified public projects by search, technology, category, and featured state", () => {
    const params = new URLSearchParams(
      "q=centralized&tech=nextjs&category=content-platform&featured=true",
    );
    const filters = parseProjectFilters(params, TECHNOLOGIES);

    expect(filters).toEqual({
      q: "centralized",
      tech: "nextjs",
      category: "content-platform",
      featured: true,
    });
    expect(filterProjects(PROJECTS, filters).map((project) => project.slug)).toEqual([
      "centralized-blog-cms",
    ]);
  });

  it("excludes hidden and placeholder projects even when their title matches", () => {
    const filters = parseProjectFilters(new URLSearchParams("q=surego"), TECHNOLOGIES);

    expect(filterProjects(PROJECTS, filters)).toEqual([]);
  });

  it("ignores unknown technology and category query values", () => {
    const filters = parseProjectFilters(
      new URLSearchParams("tech=unknown&category=bogus&featured=false"),
      TECHNOLOGIES,
    );

    expect(filters).toEqual({ q: "", tech: "", category: "", featured: false });
    expect(filterProjects(PROJECTS, filters).map((project) => project.slug)).toEqual([
      "his-hmis",
      "centralized-blog-cms",
      "acgil-corporate-website",
      "surynova-solar-website",
      "alaknanda-metro-advertising-platform",
      "real-estate-lead-generation-landing-page",
      "react-streaming-ui-clone",
    ]);
  });

  it("returns an empty result for a no-match query and handles an empty project list", () => {
    const filters = parseProjectFilters(new URLSearchParams("q=not-a-project"), TECHNOLOGIES);

    expect(filterProjects(PROJECTS, filters)).toEqual([]);
    expect(filterProjects([], filters)).toEqual([]);
  });
});
