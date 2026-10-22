import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectCaseStudy } from "@/components/projects/project-case-study";
import { PROJECTS } from "@/data/projects";
import { TECHNOLOGIES } from "@/data/technologies";
import { getPublicProjects } from "@/lib/chart-data";
import { createPageMetadata } from "@/lib/page-metadata";

const publicProjects = getPublicProjects(PROJECTS);

export const dynamicParams = false;

export function generateStaticParams() {
  return publicProjects.map(({ slug }) => ({ slug }));
}

type CaseStudyPageProps = PageProps<"/projects/[slug]">;

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = publicProjects.find((item) => item.slug === slug);

  if (!project) notFound();

  return createPageMetadata({
    title: `${project.title} Case Study`,
    description: project.summary,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectCaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const projectIndex = publicProjects.findIndex((item) => item.slug === slug);
  const project = publicProjects[projectIndex];

  if (!project) notFound();

  const technologies = TECHNOLOGIES.filter((technology) => project.techIds.includes(technology.id));

  return (
    <ProjectCaseStudy
      project={project}
      technologies={technologies}
      previous={publicProjects[projectIndex - 1]}
      next={publicProjects[projectIndex + 1]}
    />
  );
}
