export type Status = "verified" | "placeholder";

export const CATEGORY_IDS = [
  "frontend",
  "state-data",
  "backend-api",
  "databases",
  "tools-deploy",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export const TECHNOLOGY_USAGES = ["professional", "learning"] as const;

export type TechnologyUsage = (typeof TECHNOLOGY_USAGES)[number];

export type ProjectCategory = "healthcare" | "content-platform" | "other";

export type ProjectVisibility = "public" | "hidden";

export type ExternalLinkKind = "github" | "linkedin" | "website";

export type Technology = {
  id: string;
  name: string;
  category: CategoryId;
  usage: TechnologyUsage;
  url?: string;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  myRole: string;
  contribution: string[];
  category: ProjectCategory;
  techIds: string[];
  featured: boolean;
  visibility: ProjectVisibility;
  status: Status;
  features: string[];
  decisions: string[];
  lessons?: string[];
  performanceWork?: { text: string; verified: boolean }[];
  period?: { start: string; end?: string };
  cover?: {
    src: string;
    alt: string;
    anonymized: boolean;
    illustrative?: boolean;
    illustrativeLabel?: string;
    fit?: "cover" | "contain";
  };
  gallery?: { src: string; alt: string; anonymized: boolean }[];
  links?: { github?: string; live?: string };
};

export type Experience = {
  id: string;
  employer: string;
  title: string;
  start: string;
  end?: string;
  summary: string;
  responsibilities: string[];
  projectSlugs: string[];
  techIds: string[];
  status: Status;
};

export type Education = {
  id: string;
  institution: string;
  degree: string;
  start?: string;
  end?: string;
  status: Status;
};

export type Milestone = {
  id: string;
  date: string;
  title: string;
  description: string;
  projectSlug?: string;
  status: Status;
};

export type ExternalLink = {
  id: string;
  label: string;
  href: string;
  kind: ExternalLinkKind;
  status: Status;
};

export type Profile = {
  name: string;
  role: string;
  headline?: string;
  summary: string;
  email: string;
  links: ExternalLink[];
  resumeHref?: string;
  photo?: { src: string; alt: string };
  interests: string[];
  status: Status;
};

export type ContentCollections = {
  profile: Profile;
  technologies: Technology[];
  projects: Project[];
  experiences: Experience[];
  education: Education[];
  milestones: Milestone[];
};
