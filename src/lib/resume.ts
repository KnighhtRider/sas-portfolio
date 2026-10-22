import { existsSync } from "node:fs";
import { join } from "node:path";
import { PROFILE } from "@/data/profile";

export function getAvailableResumeHref(resumeHref = PROFILE.resumeHref): string | undefined {
  if (!resumeHref || !/^\/resume\/[A-Za-z0-9._-]+\.pdf$/i.test(resumeHref)) return undefined;

  return existsSync(join(process.cwd(), "public", resumeHref.slice(1))) ? resumeHref : undefined;
}
