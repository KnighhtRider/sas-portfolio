import { MILESTONES } from "../src/data/activity.ts";
import { EDUCATION } from "../src/data/education.ts";
import { EXPERIENCES } from "../src/data/experience.ts";
import { PROFILE } from "../src/data/profile.ts";
import { PROJECTS } from "../src/data/projects.ts";
import { TECHNOLOGIES } from "../src/data/technologies.ts";
import {
  buildContentReport,
  formatContentReport,
  isContentCheckBlocked,
} from "../src/lib/content-check.ts";

const data = {
  profile: PROFILE,
  technologies: TECHNOLOGIES,
  projects: PROJECTS,
  experiences: EXPERIENCES,
  education: EDUCATION,
  milestones: MILESTONES,
};

const strict = process.argv.includes("--strict");
const report = buildContentReport(data);

console.log(formatContentReport(report, strict));
process.exitCode = isContentCheckBlocked(report, strict) ? 1 : 0;
