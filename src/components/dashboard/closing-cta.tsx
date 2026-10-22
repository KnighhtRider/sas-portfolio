import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";

const profileLinks = [
  { href: SITE.github, label: "GitHub" },
  { href: SITE.linkedin, label: "LinkedIn" },
] as const;

export function ClosingCta() {
  return (
    <section
      aria-labelledby="closing-cta-title"
      className="relative overflow-hidden rounded-xl border border-border bg-accent-soft/40"
    >
      <div className="absolute inset-0 bg-console-grid opacity-60" aria-hidden="true" />
      <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end lg:p-10">
        <div className="min-w-0">
          <p className="type-label text-accent-soft-foreground">05 / Contact</p>
          <h2 id="closing-cta-title" className="type-section mt-2 max-w-2xl">
            Let&apos;s talk about the work.
          </h2>
          <p className="type-body mt-3 max-w-xl text-muted-foreground">
            The case studies and career summary are the short version. Reach out for a deeper
            walkthrough, a role conversation, or a technical collaboration.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              className="type-meta text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
              href={`mailto:${SITE.email}`}
            >
              {SITE.email}
            </a>
            {profileLinks.map((link) => (
              <a
                key={link.label}
                className="type-meta inline-flex items-center gap-1 text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
                <ArrowUpRight aria-hidden="true" className="size-3" />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
          <Button asChild size="lg">
            <a href={`mailto:${SITE.email}`}>
              Email me
              <Mail aria-hidden="true" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">
              Contact page
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
