# Project case studies

Case-study routes are generated from public, verified records in `src/data/projects.ts`. A project marked hidden or placeholder does not get a route. Unknown slugs return a 404.

The detail page presents the project summary, problem, role, contributions, technology stack, features, and engineering decisions directly from that record. Performance and architecture notes appear only when `verified` is true; lessons and external links appear only when provided.

Image rules are deliberately strict: covers and gallery entries render only when their `anonymized` flag is true. Missing or unapproved covers use the branded VT fallback. Do not add employer screenshots or patient, staff, client, internal URL, or credential details without owner approval and the required anonymization.

The previous/next navigation uses the same public, verified project list as static route generation, so hidden items cannot be discovered through adjacent links. Keep claims in first-person contribution scope and update project data rather than hard-coding case-study copy in the component.

The Surynova Solar Website cover is an illustrative rooftop installation image, not a verified photo
of a project installation. Performance notes describe the owner's techniques and focus areas; no
Lighthouse score or measured LCP improvement is published.
