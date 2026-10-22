import { describe, expect, it } from "vitest";
import { EXPERIENCES } from "@/data/experience";
import { MILESTONES } from "@/data/activity";
import { PROJECTS } from "@/data/projects";
import {
  getExperiencePreview,
  getFeaturedProjectCards,
  getOverviewMetrics,
  getRecentMilestones,
} from "@/lib/overview";

describe("overview data shaping", () => {
  it("derives the summary metrics from verified data", () => {
    const metrics = getOverviewMetrics();

    expect(metrics.find((metric) => metric.id === "experience")).toMatchObject({
      value: "30",
      unit: "months",
      helper: "2 yr 6 mo · as of Oct 2026",
    });
    expect(metrics.find((metric) => metric.id === "projects")).toMatchObject({
      value: "7",
      unit: "projects",
    });
    expect(metrics.find((metric) => metric.id === "categories")).toMatchObject({
      value: "5",
      unit: "categories",
      helper: "25 technologies tracked.",
    });
    expect(metrics.find((metric) => metric.id === "highlights")).toMatchObject({
      value: "3",
      unit: "milestones",
    });
  });

  it("returns em dashes when there is no verified data", () => {
    expect(getOverviewMetrics([], [], [], []).map((metric) => metric.value)).toEqual([
      "—",
      "—",
      "—",
      "—",
    ]);
  });

  it("excludes placeholder experiences from the duration metric", () => {
    const experiences = structuredClone(EXPERIENCES);

    for (const experience of experiences) {
      experience.status = "placeholder";
    }

    expect(getOverviewMetrics(experiences)[0]?.value).toBe("—");
  });

  it("returns only public verified featured cards", () => {
    const cards = getFeaturedProjectCards();

    expect(cards.map((card) => card.title)).toEqual([
      "HIS/HMIS",
      "Centralized Blog CMS",
      "ACGIL Corporate Website",
      "Surynova Solar Website",
      "Alaknanda Metro Advertising Platform",
      "Real Estate Lead Generation Landing Page",
      "React Streaming UI Clone",
    ]);
    expect(cards.some((card) => card.slug === "surego")).toBe(false);
    expect(cards[0]).toMatchObject({
      categoryLabel: "Healthcare systems",
      status: "verified",
      href: "/projects/his-hmis",
      additionalTechnologyCount: 3,
    });
    expect(cards[0]?.contribution).toHaveLength(2);
    expect(cards[0]?.technologies[0]).toBe("React");
    expect(cards[1]?.technologies).toEqual(["Next.js", "REST APIs", "AWS", "PM2"]);
    expect(cards[2]).toMatchObject({
      slug: "acgil-corporate-website",
      href: "/projects/acgil-corporate-website",
      technologies: ["Next.js"],
    });
    expect(cards[3]).toMatchObject({
      slug: "surynova-solar-website",
      href: "/projects/surynova-solar-website",
      technologies: ["Next.js"],
    });
    expect(cards[4]).toMatchObject({
      slug: "alaknanda-metro-advertising-platform",
      href: "/projects/alaknanda-metro-advertising-platform",
      technologies: ["Next.js"],
    });
    expect(cards[5]).toMatchObject({
      slug: "real-estate-lead-generation-landing-page",
      href: "/projects/real-estate-lead-generation-landing-page",
      technologies: ["HTML", "CSS", "JavaScript", "PHP"],
    });
    expect(cards[6]).toMatchObject({
      slug: "react-streaming-ui-clone",
      href: "/projects/react-streaming-ui-clone",
      technologies: ["React"],
    });

    const placeholders = structuredClone(PROJECTS);

    for (const project of placeholders) {
      project.status = "placeholder";
    }

    expect(getFeaturedProjectCards(placeholders)).toEqual([]);
  });

  it("orders experience and milestone previews newest first", () => {
    expect(getExperiencePreview().map((experience) => experience.id)).toEqual([
      "acgil",
      "digital-rubix",
    ]);
    expect(getExperiencePreview()[0]).toMatchObject({
      period: "May 2026 – Present",
      durationLabel: "6 mo",
      current: true,
      summary: EXPERIENCES[0]?.summary,
    });
    expect(getExperiencePreview()[1]).toMatchObject({
      period: "May 2024 – Apr 2026",
      durationLabel: "2 yr",
      current: false,
      summary: EXPERIENCES[1]?.summary,
    });

    expect(getRecentMilestones().map((milestone) => milestone.id)).toEqual([
      "acgil-start",
      "digital-rubix-end",
      "digital-rubix-start",
    ]);
    expect(getRecentMilestones()[0]?.dateLabel).toBe("May 2026");
  });

  it("excludes placeholder milestones and handles empty collections", () => {
    const milestones = structuredClone(MILESTONES);

    if (!milestones[0]) {
      throw new Error("Fixture has no milestone");
    }

    milestones[0].status = "placeholder";

    expect(getRecentMilestones(milestones)).toHaveLength(2);
    expect(getRecentMilestones([])).toEqual([]);
    expect(getExperiencePreview([])).toEqual([]);
    expect(getFeaturedProjectCards([], [])).toEqual([]);
  });
});
