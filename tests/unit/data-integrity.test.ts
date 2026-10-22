import { describe, expect, it } from "vitest";
import { TECHNOLOGIES } from "@/data/technologies";
import type { Project, Technology } from "@/data/types";
import { validateContent } from "@/lib/content-check";
import { cloneContent, realContent } from "./content-fixtures";

function firstProject(content = realContent()): Project {
  const project = content.projects[0];

  if (!project) {
    throw new Error("Fixture has no project");
  }

  return project;
}

function firstTechnology(content = realContent()): Technology {
  const technology = content.technologies[0];

  if (!technology) {
    throw new Error("Fixture has no technology");
  }

  return technology;
}

describe("data integrity", () => {
  it("accepts the real verified data", () => {
    expect(validateContent(realContent())).toEqual([]);
  });

  it("rejects a project with an unknown technology ID", () => {
    const content = cloneContent();
    const project = firstProject(content);
    project.techIds.push("not-a-real-technology");

    expect(validateContent(content)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "unknown-tech",
          path: `projects[0].techIds[${project.techIds.length - 1}]`,
        }),
      ]),
    );
  });

  it("rejects duplicate IDs and references", () => {
    const content = cloneContent();
    const first = firstProject(content);
    const second = content.projects[1];

    if (!second) {
      throw new Error("Fixture has no second project");
    }

    second.slug = first.slug;
    first.techIds.push(first.techIds[0] ?? "");
    content.experiences[0]?.projectSlugs.push("his-hmis");

    expect(validateContent(content)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "duplicate-project-slug" }),
        expect.objectContaining({ code: "duplicate-tech-reference" }),
        expect.objectContaining({ code: "duplicate-project-reference" }),
      ]),
    );
  });

  it("rejects duplicate technology, education, milestone and link IDs", () => {
    const content = cloneContent();
    const firstTech = firstTechnology(content);
    const secondTech = content.technologies[1];

    if (!secondTech) {
      throw new Error("Fixture has no second technology");
    }

    secondTech.id = firstTech.id;

    const education = content.education[1];

    if (!education || !content.education[0]) {
      throw new Error("Fixture has no education");
    }

    education.id = content.education[0].id;

    const milestone = content.milestones[1];

    if (!milestone || !content.milestones[0]) {
      throw new Error("Fixture has no milestone");
    }

    milestone.id = content.milestones[0].id;

    const link = content.profile.links[1];

    if (!link || !content.profile.links[0]) {
      throw new Error("Fixture has no profile link");
    }

    link.id = content.profile.links[0].id;

    expect(validateContent(content)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "duplicate-tech-id" }),
        expect.objectContaining({ code: "duplicate-education-id" }),
        expect.objectContaining({ code: "duplicate-milestone-id" }),
        expect.objectContaining({ code: "duplicate-link-id" }),
      ]),
    );
  });

  it("rejects invalid dates and reversed ranges", () => {
    const content = cloneContent();
    const experience = content.experiences[0];

    if (!experience) {
      throw new Error("Fixture has no experience");
    }

    experience.start = "2026-13";

    expect(validateContent(content)).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "invalid-date" })]),
    );

    const reversed = cloneContent();
    const reversedExperience = reversed.experiences[1];

    if (!reversedExperience) {
      throw new Error("Fixture has no second experience");
    }

    reversedExperience.end = "2024-04";

    expect(validateContent(reversed)).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "date-order" })]),
    );
  });

  it("validates project, milestone and education dates", () => {
    const content = cloneContent();
    const project = firstProject(content);
    project.period = { start: "2026-13" };

    const milestone = content.milestones[0];

    if (!milestone) {
      throw new Error("Fixture has no milestone");
    }

    milestone.date = "2026-99";

    const education = content.education[0];

    if (!education) {
      throw new Error("Fixture has no education");
    }

    education.end = "2019";

    expect(validateContent(content)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "invalid-date", path: "projects[0].period.start" }),
        expect.objectContaining({ code: "invalid-date", path: "milestones[0].date" }),
        expect.objectContaining({ code: "date-order", path: "education[0].end" }),
      ]),
    );
  });

  it("rejects overlapping and multiple current experiences", () => {
    const overlapping = cloneContent();
    const digitalRubix = overlapping.experiences[1];

    if (!digitalRubix) {
      throw new Error("Fixture has no second experience");
    }

    digitalRubix.end = "2026-05";

    expect(validateContent(overlapping)).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "experience-overlap" })]),
    );

    const multipleCurrent = cloneContent();
    const previousRole = multipleCurrent.experiences[1];

    if (!previousRole) {
      throw new Error("Fixture has no second experience");
    }

    delete previousRole.end;

    expect(validateContent(multipleCurrent)).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "multiple-current-experiences" })]),
    );
  });

  it("rejects public references to hidden projects", () => {
    const content = cloneContent();
    const experience = content.experiences[0];

    if (!experience) {
      throw new Error("Fixture has no experience");
    }

    experience.projectSlugs = ["surego"];

    expect(validateContent(content)).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "hidden-project-reference" })]),
    );
  });

  it("rejects unknown project slugs", () => {
    const content = cloneContent();
    const experience = content.experiences[0];

    if (!experience) {
      throw new Error("Fixture has no experience");
    }

    experience.projectSlugs = ["missing-project"];

    expect(validateContent(content)).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "unknown-project" })]),
    );
  });

  it("rejects unsafe, localhost and private profile links", () => {
    for (const href of [
      "http://localhost:3000",
      "https://localhost/",
      "https://localhost./",
      "https://192.168.1.10/",
      "https://10.0.0.1/",
      "https://[::1]/",
      "https://example.com/",
      "https://user:pass@example.org/",
    ]) {
      const content = cloneContent();
      const link = content.profile.links[0];

      if (!link) {
        throw new Error("Fixture has no profile link");
      }

      link.href = href;

      expect(validateContent(content), href).toEqual(
        expect.arrayContaining([expect.objectContaining({ code: "unsafe-link" })]),
      );
    }
  });

  it("accepts a local resume PDF and rejects traversal", () => {
    const local = cloneContent();
    local.profile.resumeHref = "/resume/vivek-thakur.pdf";
    expect(validateContent(local)).toEqual([]);

    const traversal = cloneContent();
    traversal.profile.resumeHref = "/resume/../private.pdf";
    expect(validateContent(traversal)).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "unsafe-link" })]),
    );

    const remote = cloneContent();
    remote.profile.resumeHref = "https://github.com/KnighhtRider/resume.pdf";
    expect(validateContent(remote)).toEqual([]);
  });

  it("rejects invalid profile emails", () => {
    const content = cloneContent();
    content.profile.email = "not-an-email";

    expect(validateContent(content)).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "invalid-email" })]),
    );
  });

  it("rejects invalid technology categories and usages", () => {
    const content = cloneContent();
    Object.assign(firstTechnology(content), {
      category: "not-a-category",
      usage: "expert",
    });

    expect(validateContent(content)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "invalid-category" }),
        expect.objectContaining({ code: "invalid-usage" }),
      ]),
    );
  });

  it("requires alt text and anonymization for project images", () => {
    const content = cloneContent();
    firstProject(content).cover = { src: "/cover.png", alt: "", anonymized: false };

    expect(validateContent(content)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "image-not-anonymized" }),
        expect.objectContaining({ code: "missing-alt" }),
      ]),
    );

    const gallery = cloneContent();
    firstProject(gallery).gallery = [{ src: "/example.png", alt: "", anonymized: false }];

    expect(validateContent(gallery)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "image-not-anonymized" }),
        expect.objectContaining({ code: "missing-alt" }),
      ]),
    );
  });

  it("rejects unsafe project links", () => {
    const content = cloneContent();
    firstProject(content).links = { github: "http://localhost/project", live: "https://10.0.0.1/" };

    expect(validateContent(content)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "unsafe-link", path: "projects[0].links.github" }),
        expect.objectContaining({ code: "unsafe-link", path: "projects[0].links.live" }),
      ]),
    );
  });

  it("rejects verified items that still contain placeholder text", () => {
    const content = cloneContent();
    firstProject(content).summary = "TODO: replace this summary.";

    expect(validateContent(content)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "unresolved-placeholder",
          path: "projects[0].summary",
        }),
      ]),
    );
  });

  it("rejects hidden featured projects", () => {
    const content = cloneContent();
    const hidden = content.projects.find((project) => project.visibility === "hidden");

    if (!hidden) {
      throw new Error("Fixture has no hidden project");
    }

    hidden.featured = true;

    expect(validateContent(content)).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "hidden-featured" })]),
    );
  });

  it("uses usage labels instead of skill percentages", () => {
    for (const technology of TECHNOLOGIES) {
      expect(Object.keys(technology)).not.toContain("percentage");
      expect(Object.keys(technology)).not.toContain("level");
      expect(technology.name).not.toContain("%");
    }
  });
});
