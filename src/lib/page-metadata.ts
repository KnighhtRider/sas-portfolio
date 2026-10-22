import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { getAbsoluteSiteUrl } from "@/lib/site-url";

export function createPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const canonicalUrl = getAbsoluteSiteUrl(path);

  return {
    title,
    description,
    ...(canonicalUrl ? { alternates: { canonical: canonicalUrl } } : {}),
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title,
      description,
      ...(canonicalUrl ? { url: canonicalUrl } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
