import { describe, expect, it } from "vitest";
import { MILESTONES } from "@/data/activity";
import { latestYearMonth, yearsRepresented } from "@/lib/activity";

describe("activity summary helpers", () => {
  it("derives the latest year-month and the years represented from real milestones", () => {
    const dates = MILESTONES.map((milestone) => milestone.date);

    expect(latestYearMonth(dates)).toBe("2026-05");
    expect(yearsRepresented(dates)).toBe(2);
  });

  it("ignores invalid dates and handles empty input", () => {
    expect(latestYearMonth(["2026-13", "soon", "2024-05"])).toBe("2024-05");
    expect(latestYearMonth([])).toBeNull();
    expect(yearsRepresented(["2026-13", ""])).toBe(0);
  });
});
