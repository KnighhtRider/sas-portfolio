import type { Profile } from "@/data/types";
import { getAbsoluteSiteUrl } from "@/lib/site-url";

export function createPersonJsonLd(profile: Profile) {
  const sameAs = profile.links
    .filter((link) => link.status === "verified")
    .map((link) => link.href);
  const url = getAbsoluteSiteUrl("/");

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    email: profile.email,
    sameAs,
    ...(url ? { url, "@id": `${url}#person` } : {}),
  };
}
