import { CATEGORY_IDS, TECHNOLOGY_USAGES } from "../data/types.ts";
import type { ContentCollections, Project, Status } from "../data/types.ts";
import { isYear, isYearMonth, monthNumber, parseYearMonth } from "./dates.ts";

export type ContentIssue = {
  code: string;
  path: string;
  message: string;
};

export type ContentFinding = {
  kind: "profile" | "project" | "experience" | "education" | "milestone" | "link";
  id: string;
  label: string;
  status: Status;
  visibility?: "public" | "hidden";
};

export type ContentReport = {
  counts: {
    technologies: number;
    projectsPublic: number;
    projectsHidden: number;
    experiences: number;
    education: number;
    milestones: number;
  };
  publicPlaceholders: ContentFinding[];
  hiddenItems: ContentFinding[];
  errors: ContentIssue[];
};

function issue(code: string, path: string, message: string): ContentIssue {
  return { code, path, message };
}

function checkUnique(
  values: string[],
  path: string,
  code: string,
  message: string,
  errors: ContentIssue[],
) {
  const seen = new Set<string>();

  values.forEach((value, index) => {
    if (seen.has(value)) {
      errors.push(issue(code, `${path}[${index}]`, `${message}: "${value}".`));
    }

    seen.add(value);
  });
}

function isPrivateHostname(hostnameValue: string) {
  const hostname = hostnameValue.toLowerCase().replace(/\.$/, "");

  if (
    !hostname ||
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    hostname.endsWith(".test") ||
    hostname.endsWith(".example") ||
    hostname === "example.com" ||
    hostname === "example.net" ||
    hostname === "example.org"
  ) {
    return true;
  }

  if (hostname.startsWith("[") && hostname.endsWith("]")) {
    const ipv6 = hostname.slice(1, -1);

    return ipv6 === "::" || ipv6 === "::1" || /^f[cd]/.test(ipv6) || /^fe[89ab]/.test(ipv6);
  }

  const octets = hostname.split(".");

  if (octets.length !== 4) {
    return false;
  }

  const numbers = octets.map(Number);

  if (
    numbers.some(
      (octet, index) =>
        !Number.isInteger(octet) ||
        octet < 0 ||
        octet > 255 ||
        octets[index] === "" ||
        octets[index]?.startsWith("0"),
    )
  ) {
    return true;
  }

  const first = numbers[0];
  const second = numbers[1];

  if (first === undefined || second === undefined) {
    return true;
  }

  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    (first === 100 && second >= 64 && second <= 127) ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168) ||
    (first === 192 && second === 0) ||
    (first === 198 && (second === 18 || second === 19)) ||
    (first === 198 && second === 51) ||
    (first === 203 && second === 0)
  );
}

function isSafeExternalUrl(value: string) {
  if (!value || value.includes("TODO")) {
    return false;
  }

  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      !isPrivateHostname(url.hostname)
    );
  } catch {
    return false;
  }
}

function isSafeResumeUrl(value: string) {
  if (value.startsWith("/")) {
    return /^\/resume\/[A-Za-z0-9][A-Za-z0-9._-]*\.pdf$/i.test(value) && !value.includes("..");
  }

  return isSafeExternalUrl(value);
}

const PLACEHOLDER_PATTERN = /\bTODO\b|\[TODO|placeholder/i;

function checkVerifiedText(
  status: Status,
  entries: { path: string; text: string }[],
  errors: ContentIssue[],
) {
  if (status !== "verified") {
    return;
  }

  for (const entry of entries) {
    if (PLACEHOLDER_PATTERN.test(entry.text)) {
      errors.push(
        issue("unresolved-placeholder", entry.path, "Verified content contains placeholder text."),
      );
    }
  }
}

function checkProjectLinks(project: Project, path: string, errors: ContentIssue[]) {
  if (project.cover) {
    if (!project.cover.anonymized) {
      errors.push(
        issue(
          "image-not-anonymized",
          `${path}.cover`,
          "Cover images must be anonymized before publication.",
        ),
      );
    }

    if (!project.cover.alt.trim()) {
      errors.push(issue("missing-alt", `${path}.cover.alt`, "Project cover needs alt text."));
    }
  }

  project.gallery?.forEach((image, index) => {
    if (!image.anonymized) {
      errors.push(
        issue(
          "image-not-anonymized",
          `${path}.gallery[${index}]`,
          "Gallery images must be anonymized before publication.",
        ),
      );
    }

    if (!image.alt.trim()) {
      errors.push(
        issue("missing-alt", `${path}.gallery[${index}].alt`, "Gallery image needs alt text."),
      );
    }
  });

  if (project.links?.github && !isSafeExternalUrl(project.links.github)) {
    errors.push(issue("unsafe-link", `${path}.links.github`, "Project GitHub link must be HTTPS."));
  }

  if (project.links?.live && !isSafeExternalUrl(project.links.live)) {
    errors.push(issue("unsafe-link", `${path}.links.live`, "Project live link must be HTTPS."));
  }
}

function checkProjectDates(project: Project, path: string, errors: ContentIssue[]) {
  if (!project.period) {
    return;
  }

  const start = parseYearMonth(project.period.start);

  if (!start) {
    errors.push(issue("invalid-date", `${path}.period.start`, "Project start must be YYYY-MM."));
  }

  if (project.period.end) {
    const end = parseYearMonth(project.period.end);

    if (!end) {
      errors.push(issue("invalid-date", `${path}.period.end`, "Project end must be YYYY-MM."));
    } else if (start && end.year * 12 + end.month < start.year * 12 + start.month) {
      errors.push(
        issue("date-order", `${path}.period`, "Project end must not be before its start."),
      );
    }
  }
}

export function validateContent(data: ContentCollections): ContentIssue[] {
  const errors: ContentIssue[] = [];
  const technologyIds = new Set(data.technologies.map((technology) => technology.id));
  const projectsBySlug = new Map(data.projects.map((project) => [project.slug, project]));
  const categories = new Set<string>(CATEGORY_IDS);
  const usages = new Set<string>(TECHNOLOGY_USAGES);

  checkUnique(
    data.technologies.map((technology) => technology.id),
    "technologies",
    "duplicate-tech-id",
    "Duplicate technology ID",
    errors,
  );

  data.technologies.forEach((technology, index) => {
    if (!categories.has(technology.category)) {
      errors.push(
        issue(
          "invalid-category",
          `technologies[${index}].category`,
          "Unknown technology category.",
        ),
      );
    }

    if (!usages.has(technology.usage)) {
      errors.push(
        issue("invalid-usage", `technologies[${index}].usage`, "Unknown technology usage."),
      );
    }

    if (technology.url && !isSafeExternalUrl(technology.url)) {
      errors.push(
        issue(
          "unsafe-link",
          `technologies[${index}].url`,
          "Technology link must be a public HTTPS URL.",
        ),
      );
    }
  });

  checkUnique(
    data.projects.map((project) => project.slug),
    "projects",
    "duplicate-project-slug",
    "Duplicate project slug",
    errors,
  );

  data.projects.forEach((project, index) => {
    const path = `projects[${index}]`;

    checkUnique(
      project.techIds,
      `${path}.techIds`,
      "duplicate-tech-reference",
      "Duplicate project technology",
      errors,
    );

    project.techIds.forEach((techId, techIndex) => {
      if (!technologyIds.has(techId)) {
        errors.push(
          issue(
            "unknown-tech",
            `${path}.techIds[${techIndex}]`,
            `Unknown technology ID: "${techId}".`,
          ),
        );
      }
    });

    if (project.visibility === "hidden" && project.featured) {
      errors.push(issue("hidden-featured", path, "A hidden project cannot be featured."));
    }

    checkProjectDates(project, path, errors);
    checkProjectLinks(project, path, errors);
    checkVerifiedText(
      project.status,
      [
        { path: `${path}.title`, text: project.title },
        { path: `${path}.summary`, text: project.summary },
        { path: `${path}.problem`, text: project.problem },
        { path: `${path}.myRole`, text: project.myRole },
        ...project.contribution.map((text, textIndex) => ({
          path: `${path}.contribution[${textIndex}]`,
          text,
        })),
        ...project.features.map((text, textIndex) => ({
          path: `${path}.features[${textIndex}]`,
          text,
        })),
        ...project.decisions.map((text, textIndex) => ({
          path: `${path}.decisions[${textIndex}]`,
          text,
        })),
        ...(project.lessons ?? []).map((text, textIndex) => ({
          path: `${path}.lessons[${textIndex}]`,
          text,
        })),
        ...(project.performanceWork ?? [])
          .filter((work) => work.verified)
          .map((work, workIndex) => ({
            path: `${path}.performanceWork[${workIndex}].text`,
            text: work.text,
          })),
      ],
      errors,
    );
  });

  checkUnique(
    data.experiences.map((experience) => experience.id),
    "experiences",
    "duplicate-experience-id",
    "Duplicate experience ID",
    errors,
  );

  data.experiences.forEach((experience, index) => {
    const path = `experiences[${index}]`;
    const start = parseYearMonth(experience.start);

    if (!start) {
      errors.push(issue("invalid-date", `${path}.start`, "Experience start must be YYYY-MM."));
    }

    if (experience.end) {
      const end = parseYearMonth(experience.end);

      if (!end) {
        errors.push(issue("invalid-date", `${path}.end`, "Experience end must be YYYY-MM."));
      } else if (start && end.year * 12 + end.month < start.year * 12 + start.month) {
        errors.push(
          issue("date-order", `${path}.end`, "Experience end must not be before its start."),
        );
      }
    }

    checkUnique(
      experience.techIds,
      `${path}.techIds`,
      "duplicate-tech-reference",
      "Duplicate experience technology",
      errors,
    );

    experience.techIds.forEach((techId, techIndex) => {
      if (!technologyIds.has(techId)) {
        errors.push(
          issue(
            "unknown-tech",
            `${path}.techIds[${techIndex}]`,
            `Unknown technology ID: "${techId}".`,
          ),
        );
      }
    });

    checkUnique(
      experience.projectSlugs,
      `${path}.projectSlugs`,
      "duplicate-project-reference",
      "Duplicate experience project",
      errors,
    );

    experience.projectSlugs.forEach((slug, projectIndex) => {
      const project = projectsBySlug.get(slug);

      if (!project) {
        errors.push(
          issue(
            "unknown-project",
            `${path}.projectSlugs[${projectIndex}]`,
            `Unknown project slug: "${slug}".`,
          ),
        );
      } else if (project.visibility === "hidden") {
        errors.push(
          issue(
            "hidden-project-reference",
            `${path}.projectSlugs[${projectIndex}]`,
            `Public experience cannot reference hidden project: "${slug}".`,
          ),
        );
      }
    });

    checkVerifiedText(
      experience.status,
      [
        { path: `${path}.employer`, text: experience.employer },
        { path: `${path}.title`, text: experience.title },
        { path: `${path}.summary`, text: experience.summary },
        ...experience.responsibilities.map((text, textIndex) => ({
          path: `${path}.responsibilities[${textIndex}]`,
          text,
        })),
      ],
      errors,
    );
  });

  const verifiedRanges = data.experiences
    .filter((experience) => experience.status === "verified")
    .flatMap((experience) => {
      const start = parseYearMonth(experience.start);
      const end = experience.end ? parseYearMonth(experience.end) : null;

      if (!start || (experience.end && !end)) {
        return [];
      }

      return [
        {
          id: experience.id,
          start: monthNumber(start),
          end: end ? monthNumber(end) : Number.POSITIVE_INFINITY,
        },
      ];
    });

  const currentVerification = verifiedRanges.filter(
    (experience) => experience.end === Number.POSITIVE_INFINITY,
  );

  if (currentVerification.length > 1) {
    errors.push(
      issue(
        "multiple-current-experiences",
        "experiences",
        "Only one verified experience can be current.",
      ),
    );
  }

  for (let index = 0; index < verifiedRanges.length; index += 1) {
    const first = verifiedRanges[index];

    if (!first) {
      continue;
    }

    for (let otherIndex = index + 1; otherIndex < verifiedRanges.length; otherIndex += 1) {
      const second = verifiedRanges[otherIndex];

      if (!second) {
        continue;
      }

      if (first.start <= second.end && second.start <= first.end) {
        errors.push(
          issue(
            "experience-overlap",
            `experiences[${otherIndex}]`,
            `Verified experiences overlap: "${first.id}" and "${second.id}".`,
          ),
        );
      }
    }
  }

  checkUnique(
    data.education.map((entry) => entry.id),
    "education",
    "duplicate-education-id",
    "Duplicate education ID",
    errors,
  );

  data.education.forEach((entry, index) => {
    const path = `education[${index}]`;
    const start = entry.start;

    if (start && !isYear(start)) {
      errors.push(issue("invalid-date", `${path}.start`, "Education start must be YYYY."));
    }

    if (entry.end) {
      if (!isYear(entry.end)) {
        errors.push(issue("invalid-date", `${path}.end`, "Education end must be YYYY."));
      } else if (start && Number(entry.end) < Number(start)) {
        errors.push(
          issue("date-order", `${path}.end`, "Education end must not be before its start."),
        );
      }
    }

    checkVerifiedText(
      entry.status,
      [
        { path: `${path}.institution`, text: entry.institution },
        { path: `${path}.degree`, text: entry.degree },
      ],
      errors,
    );
  });

  checkUnique(
    data.milestones.map((milestone) => milestone.id),
    "milestones",
    "duplicate-milestone-id",
    "Duplicate milestone ID",
    errors,
  );

  data.milestones.forEach((milestone, index) => {
    const path = `milestones[${index}]`;

    if (!isYearMonth(milestone.date)) {
      errors.push(issue("invalid-date", `${path}.date`, "Milestone date must be YYYY-MM."));
    }

    if (milestone.projectSlug) {
      const project = projectsBySlug.get(milestone.projectSlug);

      if (!project) {
        errors.push(
          issue(
            "unknown-project",
            `${path}.projectSlug`,
            `Unknown project slug: "${milestone.projectSlug}".`,
          ),
        );
      } else if (project.visibility === "hidden") {
        errors.push(
          issue(
            "hidden-project-reference",
            `${path}.projectSlug`,
            `Milestone cannot reference hidden project: "${milestone.projectSlug}".`,
          ),
        );
      }
    }

    checkVerifiedText(
      milestone.status,
      [
        { path: `${path}.title`, text: milestone.title },
        { path: `${path}.description`, text: milestone.description },
      ],
      errors,
    );
  });

  checkUnique(
    data.profile.links.map((link) => link.id),
    "profile.links",
    "duplicate-link-id",
    "Duplicate profile link ID",
    errors,
  );

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.profile.email)) {
    errors.push(issue("invalid-email", "profile.email", "Profile email is invalid."));
  }

  data.profile.links.forEach((link, index) => {
    if (!isSafeExternalUrl(link.href)) {
      errors.push(
        issue("unsafe-link", `profile.links[${index}].href`, "Profile link must be HTTPS."),
      );
    }
  });

  if (data.profile.resumeHref && !isSafeResumeUrl(data.profile.resumeHref)) {
    errors.push(
      issue(
        "unsafe-link",
        "profile.resumeHref",
        "Resume link must be HTTPS or a local /resume/*.pdf path.",
      ),
    );
  }

  data.profile.links.forEach((link, index) => {
    checkVerifiedText(
      link.status,
      [{ path: `profile.links[${index}].label`, text: link.label }],
      errors,
    );
  });

  checkVerifiedText(
    data.profile.status,
    [
      { path: "profile.name", text: data.profile.name },
      { path: "profile.role", text: data.profile.role },
      { path: "profile.headline", text: data.profile.headline ?? "" },
      { path: "profile.summary", text: data.profile.summary },
      ...data.profile.interests.map((text, index) => ({
        path: `profile.interests[${index}]`,
        text,
      })),
    ],
    errors,
  );

  return errors;
}

export function buildContentReport(data: ContentCollections): ContentReport {
  const publicPlaceholders: ContentFinding[] = [];
  const hiddenItems: ContentFinding[] = [];

  if (data.profile.status === "placeholder") {
    publicPlaceholders.push({
      kind: "profile",
      id: "profile",
      label: data.profile.name,
      status: data.profile.status,
    });
  }

  for (const link of data.profile.links) {
    if (link.status === "placeholder") {
      publicPlaceholders.push({
        kind: "link",
        id: link.id,
        label: link.label,
        status: link.status,
      });
    }
  }

  for (const project of data.projects) {
    if (project.visibility === "hidden") {
      hiddenItems.push({
        kind: "project",
        id: project.slug,
        label: project.title,
        status: project.status,
        visibility: project.visibility,
      });
    } else if (project.status === "placeholder") {
      publicPlaceholders.push({
        kind: "project",
        id: project.slug,
        label: project.title,
        status: project.status,
        visibility: project.visibility,
      });
    }
  }

  for (const experience of data.experiences) {
    if (experience.status === "placeholder") {
      publicPlaceholders.push({
        kind: "experience",
        id: experience.id,
        label: experience.employer,
        status: experience.status,
      });
    }
  }

  for (const entry of data.education) {
    if (entry.status === "placeholder") {
      publicPlaceholders.push({
        kind: "education",
        id: entry.id,
        label: entry.institution,
        status: entry.status,
      });
    }
  }

  for (const milestone of data.milestones) {
    if (milestone.status === "placeholder") {
      publicPlaceholders.push({
        kind: "milestone",
        id: milestone.id,
        label: milestone.title,
        status: milestone.status,
      });
    }
  }

  return {
    counts: {
      technologies: data.technologies.length,
      projectsPublic: data.projects.filter((project) => project.visibility === "public").length,
      projectsHidden: data.projects.filter((project) => project.visibility === "hidden").length,
      experiences: data.experiences.length,
      education: data.education.length,
      milestones: data.milestones.length,
    },
    publicPlaceholders: publicPlaceholders.sort((a, b) =>
      `${a.kind}:${a.id}`.localeCompare(`${b.kind}:${b.id}`),
    ),
    hiddenItems: hiddenItems.sort((a, b) => a.id.localeCompare(b.id)),
    errors: validateContent(data),
  };
}

export function isContentCheckBlocked(report: ContentReport, strict: boolean) {
  return report.errors.length > 0 || (strict && report.publicPlaceholders.length > 0);
}

export function formatContentReport(report: ContentReport, strict = false) {
  const lines = [
    "Content check",
    `Integrity: ${report.errors.length === 0 ? "PASS" : "FAIL"}`,
    `Technologies: ${report.counts.technologies}`,
    `Projects: ${report.counts.projectsPublic} public / ${report.counts.projectsHidden} hidden`,
    `Experiences: ${report.counts.experiences}`,
    `Education: ${report.counts.education}`,
    `Milestones: ${report.counts.milestones}`,
    "",
  ];

  if (report.errors.length > 0) {
    lines.push(`Integrity issues (${report.errors.length}):`);

    for (const error of report.errors) {
      lines.push(`- ${error.code} at ${error.path}: ${error.message}`);
    }
  }

  lines.push(`Public placeholders (${report.publicPlaceholders.length}):`);

  if (report.publicPlaceholders.length === 0) {
    lines.push("- none");
  } else {
    for (const item of report.publicPlaceholders) {
      lines.push(`- ${item.kind}:${item.id} (${item.label})`);
    }
  }

  lines.push(`Hidden items (${report.hiddenItems.length}):`);

  if (report.hiddenItems.length === 0) {
    lines.push("- none");
  } else {
    for (const item of report.hiddenItems) {
      lines.push(`- ${item.kind}:${item.id} (${item.label}, ${item.status})`);
    }
  }

  lines.push("");

  if (report.errors.length > 0) {
    lines.push("Gate: BLOCKED (integrity issues)");
  } else if (strict && report.publicPlaceholders.length > 0) {
    lines.push("Gate: BLOCKED (public placeholders in strict mode)");
  } else if (strict) {
    lines.push("Gate: PASS");
  } else {
    lines.push("Gate: report mode (use --strict to block public placeholders)");
  }

  return lines.join("\n");
}
