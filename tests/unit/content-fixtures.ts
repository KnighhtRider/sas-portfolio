import { MILESTONES } from "@/data/activity";
import { EDUCATION } from "@/data/education";
import { EXPERIENCES } from "@/data/experience";
import { PROFILE } from "@/data/profile";
import { PROJECTS } from "@/data/projects";
import { TECHNOLOGIES } from "@/data/technologies";
import type { ContentCollections } from "@/data/types";

export function realContent(): ContentCollections {
  return {
    profile: PROFILE,
    technologies: TECHNOLOGIES,
    projects: PROJECTS,
    experiences: EXPERIENCES,
    education: EDUCATION,
    milestones: MILESTONES,
  };
}

export function cloneContent(): ContentCollections {
  return structuredClone(realContent());
}
