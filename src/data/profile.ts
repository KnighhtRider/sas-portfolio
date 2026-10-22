import type { Profile } from "./types";

export const PROFILE: Profile = {
  name: "Vivek Thakur",
  role: "Full-Stack Developer",
  headline: "Full-Stack Developer | Frontend-focused React & Next.js Engineer",
  summary:
    "I am a Full-Stack Developer building responsive web applications, reusable UI components, and business-focused digital products. My work includes enterprise healthcare applications, centralized content management, frontend performance optimization, and integrations with APIs and CRM platforms. I enjoy building intuitive user experiences while maintaining clean, reusable, and maintainable code.",
  email: "vivekthakur7042@gmail.com",
  resumeHref: "/resume/vivek_Thakur_Resume.pdf",
  links: [
    {
      id: "github",
      label: "GitHub",
      href: "https://github.com/KnighhtRider",
      kind: "github",
      status: "verified",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/vivekthakurr/",
      kind: "linkedin",
      status: "verified",
    },
  ],
  photo: {
    src: "/profile/vivek-thakur.png",
    alt: "Portrait of Vivek Thakur",
  },
  interests: [
    "React and Next.js application development",
    "UI/UX engineering and design systems",
    "Frontend performance optimization",
    "Reusable component architecture",
    "Enterprise applications and healthcare systems",
    "API integration and full-stack development",
    "Content management and publishing platforms",
    "Cloud deployment and production workflows",
  ],
  status: "verified",
};
