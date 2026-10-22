import type { CategoryId, Technology } from "./types";

export const TECHNOLOGY_CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "frontend", label: "Frontend" },
  { id: "state-data", label: "State & Data" },
  { id: "backend-api", label: "Backend & API" },
  { id: "databases", label: "Databases" },
  { id: "tools-deploy", label: "Tools & Deployment" },
];

export const TECHNOLOGIES: Technology[] = [
  { id: "react", name: "React", category: "frontend", usage: "professional" },
  { id: "nextjs", name: "Next.js", category: "frontend", usage: "professional" },
  { id: "javascript", name: "JavaScript", category: "frontend", usage: "professional" },
  { id: "typescript", name: "TypeScript", category: "frontend", usage: "professional" },
  { id: "html", name: "HTML", category: "frontend", usage: "professional" },
  { id: "css", name: "CSS", category: "frontend", usage: "professional" },
  {
    id: "tailwind-css",
    name: "Tailwind CSS",
    category: "frontend",
    usage: "professional",
  },
  {
    id: "redux-toolkit",
    name: "Redux Toolkit",
    category: "state-data",
    usage: "professional",
  },
  {
    id: "rtk-query",
    name: "RTK Query",
    category: "state-data",
    usage: "professional",
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "backend-api",
    usage: "professional",
  },
  { id: "express", name: "Express", category: "backend-api", usage: "professional" },
  {
    id: "rest-apis",
    name: "REST APIs",
    category: "backend-api",
    usage: "professional",
  },
  { id: "php", name: "PHP", category: "backend-api", usage: "professional" },
  {
    id: "crm-integrations",
    name: "CRM integrations",
    category: "backend-api",
    usage: "professional",
  },
  { id: "laravel", name: "Laravel", category: "backend-api", usage: "learning" },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "databases",
    usage: "professional",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "databases",
    usage: "professional",
  },
  { id: "mysql", name: "MySQL", category: "databases", usage: "professional" },
  { id: "git", name: "Git", category: "tools-deploy", usage: "professional" },
  {
    id: "postman",
    name: "Postman",
    category: "tools-deploy",
    usage: "professional",
  },
  { id: "vercel", name: "Vercel", category: "tools-deploy", usage: "professional" },
  {
    id: "google-cloud-platform",
    name: "Google Cloud Platform",
    category: "tools-deploy",
    usage: "professional",
  },
  { id: "aws", name: "AWS", category: "tools-deploy", usage: "professional" },
  { id: "pm2", name: "PM2", category: "tools-deploy", usage: "professional" },
  {
    id: "hostinger",
    name: "Hostinger",
    category: "tools-deploy",
    usage: "professional",
  },
];
