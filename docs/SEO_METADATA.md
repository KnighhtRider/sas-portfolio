# SEO and Metadata

## Route metadata

Page titles and descriptions live with their App Router page. Shared Open Graph and Twitter fields are created in `src/lib/page-metadata.ts`; the root layout owns the site title template and the home page defaults. The development-only design gallery is marked `noindex` and is excluded from the sitemap.

## Site URL requirement

In Vercel, set `NEXT_PUBLIC_SITE_URL` to the final public origin in the **Production** environment.
Use an absolute `https:` URL without credentials and redeploy after changing it. Keep it unset for
Preview deployments unless a stable preview origin should be canonical. Until configured:

- Canonical links and schema `url` fields are omitted.
- `robots.txt` loads without a sitemap directive.
- `sitemap.xml` remains valid and empty because sitemap locations must be absolute URLs.
- Next.js resolves file-convention social image URLs against `http://localhost:3000` until a metadata base is configured. Generated images work locally, but production share URLs need the final origin.

After setting the value, rebuild the site so static metadata and the sitemap use the public origin. The sitemap includes only the seven public pages and public, verified project case studies. Hidden or placeholder projects are filtered out.

## Generated assets and structured data

- `src/app/opengraph-image.tsx` and `src/app/twitter-image.tsx` generate the portfolio share card.
- Matching files under `src/app/projects/[slug]/` generate case-study share cards from public, verified project data.
- `src/app/icon.tsx` and `src/app/apple-icon.tsx` generate the VT browser and home-screen icons.
- The root layout emits a `Person` JSON-LD object from the public name, role, email, and verified profile links. It escapes `<` before embedding the JSON.
