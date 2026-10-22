import { PROFILE } from "@/data/profile";
import type { ExternalLinkKind } from "@/data/types";

function profileLink(kind: ExternalLinkKind) {
  const link = PROFILE.links.find((item) => item.kind === kind);

  if (!link) {
    throw new Error(`Missing required profile link: ${kind}`);
  }

  return link.href;
}

export const SITE = {
  name: PROFILE.name,
  role: PROFILE.role,
  email: PROFILE.email,
  github: profileLink("github"),
  linkedin: profileLink("linkedin"),
  contentUpdated: "2026-10-22",
} as const;
