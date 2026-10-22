export type CommandProject = {
  slug: string;
  title: string;
  summary: string;
  category: string;
};

export type CommandTechnology = {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
};

export type CommandProfileLink = {
  id: string;
  label: string;
  href: string;
};

export type CommandPaletteData = {
  projects: CommandProject[];
  technologies: CommandTechnology[];
  email: string;
  profileLinks: CommandProfileLink[];
  resumeHref?: string;
};
