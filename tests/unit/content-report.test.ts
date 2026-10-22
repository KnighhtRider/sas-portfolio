import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import {
  buildContentReport,
  formatContentReport,
  isContentCheckBlocked,
} from "@/lib/content-check";
import { cloneContent, realContent } from "./content-fixtures";

const projectRoot = process.cwd();

function runContentCheck(...args: string[]) {
  return spawnSync(
    process.execPath,
    ["--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", "scripts/content-check.mjs", ...args],
    { cwd: projectRoot, encoding: "utf8" },
  );
}

describe("content report", () => {
  it("reports the profile placeholder and hidden SureGo project", () => {
    const report = buildContentReport(realContent());

    expect(report.errors).toEqual([]);
    expect(report.counts).toEqual({
      technologies: 25,
      projectsPublic: 7,
      projectsHidden: 1,
      experiences: 2,
      education: 2,
      milestones: 3,
    });
    expect(report.publicPlaceholders).toEqual([
      expect.objectContaining({ kind: "profile", id: "profile", status: "placeholder" }),
    ]);
    expect(report.hiddenItems).toEqual([
      expect.objectContaining({ kind: "project", id: "surego" }),
    ]);
    expect(isContentCheckBlocked(report, false)).toBe(false);
    expect(isContentCheckBlocked(report, true)).toBe(true);
  });

  it("passes strict mode once all public placeholders are verified", () => {
    const content = cloneContent();
    content.profile.status = "verified";

    const report = buildContentReport(content);

    expect(report.publicPlaceholders).toEqual([]);
    expect(report.hiddenItems).toHaveLength(1);
    expect(isContentCheckBlocked(report, true)).toBe(false);
  });

  it("blocks public placeholder projects in strict mode", () => {
    const content = cloneContent();
    const project = content.projects[0];

    if (!project) {
      throw new Error("Fixture has no project");
    }

    project.status = "placeholder";

    const report = buildContentReport(content);

    expect(report.publicPlaceholders).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: project.slug })]),
    );
    expect(isContentCheckBlocked(report, true)).toBe(true);
  });

  it("blocks integrity errors even without strict mode", () => {
    const content = cloneContent();
    const project = content.projects[0];

    if (!project) {
      throw new Error("Fixture has no project");
    }

    project.techIds.push("not-a-real-technology");

    const report = buildContentReport(content);

    expect(report.errors.length).toBeGreaterThan(0);
    expect(isContentCheckBlocked(report, false)).toBe(true);
  });

  it("formats counts, findings and the gate verdict", () => {
    const content = cloneContent();
    content.profile.status = "verified";

    const output = formatContentReport(buildContentReport(content), true);

    expect(output).toContain("Integrity: PASS");
    expect(output).toContain("Projects: 7 public / 1 hidden");
    expect(output).toContain("Public placeholders (0):");
    expect(output).toContain("- project:surego");
    expect(output).toContain("Gate: PASS");
  });

  it("runs the content-check CLI with Node's TypeScript stripping", () => {
    const result = runContentCheck();

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Content check");
    expect(result.stdout).toContain("Integrity: PASS");
    expect(result.stderr).not.toContain("MODULE_TYPELESS");
  });

  it("matches strict CLI exit status to the strict gate", () => {
    const expectedExit = isContentCheckBlocked(buildContentReport(realContent()), true) ? 1 : 0;
    const result = runContentCheck("--strict");

    expect(result.status).toBe(expectedExit);
    expect(result.stdout).toContain(expectedExit === 1 ? "Gate: BLOCKED" : "Gate: PASS");
  });
});
