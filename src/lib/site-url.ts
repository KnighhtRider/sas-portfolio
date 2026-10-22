export function getSiteOrigin(): URL | undefined {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configuredUrl) return undefined;

  try {
    const parsedUrl = new URL(configuredUrl);
    if (
      (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") ||
      parsedUrl.username ||
      parsedUrl.password
    ) {
      return undefined;
    }

    return new URL(parsedUrl.origin);
  } catch {
    return undefined;
  }
}

export function getAbsoluteSiteUrl(path: string): string | undefined {
  const origin = getSiteOrigin();
  return origin ? new URL(path, origin).toString() : undefined;
}
