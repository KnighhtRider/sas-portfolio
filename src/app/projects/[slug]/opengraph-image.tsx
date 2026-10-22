import { notFound } from "next/navigation";
import { PROJECTS } from "@/data/projects";
import { getPublicProjects } from "@/lib/chart-data";
import { createSocialImage, SOCIAL_IMAGE_SIZE } from "@/lib/social-image";

const publicProjects = getPublicProjects(PROJECTS);

export const alt = "Verified public project case study from Vivek Thakur";
export const size = SOCIAL_IMAGE_SIZE;
export const contentType = "image/png";

export function generateImageMetadata({ params }: { params: { slug: string } }) {
  const project = publicProjects.find((item) => item.slug === params.slug);
  if (!project) return [];

  return [
    {
      id: project.slug,
      alt: `${project.title} — project case study by Vivek Thakur`,
      size: SOCIAL_IMAGE_SIZE,
      contentType,
    },
  ];
}

export default async function ProjectOpenGraphImage({ id }: { id: Promise<string | number> }) {
  const slug = String(await id);
  const project = publicProjects.find((item) => item.slug === slug);
  if (!project) notFound();

  return createSocialImage({
    eyebrow: `Case study / ${project.category.replaceAll("-", " ")}`,
    title: project.title,
    description: project.summary,
  });
}
