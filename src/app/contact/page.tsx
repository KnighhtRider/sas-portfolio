import type { Metadata } from "next";
import {
  ArrowDownToLine,
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  FileText,
  Mail,
  Send,
} from "lucide-react";
import { CopyEmailButton } from "@/components/contact/copy-email-button";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { PROFILE } from "@/data/profile";
import { createPageMetadata } from "@/lib/page-metadata";
import { getAvailableResumeHref } from "@/lib/resume";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact Vivek Thakur by email or connect through verified GitHub and LinkedIn profiles.",
  path: "/contact",
});

const verifiedLinks = PROFILE.links.filter((link) => link.status === "verified");

function displayUrl(href: string) {
  try {
    const url = new URL(href);
    const path = url.pathname.replace(/\/$/, "");

    return `${url.host}${path}`;
  } catch {
    return href;
  }
}

export default function ContactPage() {
  const resumeHref = getAvailableResumeHref();

  return (
    <PageContainer>
      <div className="space-y-12 pb-12">
        <header className="max-w-3xl">
          <p className="type-label text-primary">Contact / 12</p>
          <h1 className="type-page-title mt-3">Let’s connect</h1>
          <p className="type-lead mt-4 text-muted-foreground">
            For a conversation about the work, a role, or a technical collaboration, use the direct
            email route or connect through a verified professional profile.
          </p>
        </header>

        <section
          aria-labelledby="email-contact-title"
          className="grid gap-10 border-y border-border py-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-12 lg:py-10"
        >
          <div className="min-w-0">
            <h2
              id="email-contact-title"
              className="flex items-center gap-2 type-label text-muted-foreground"
            >
              <Mail aria-hidden="true" className="size-4 text-primary" /> Direct email
            </h2>
            <a
              href={`mailto:${PROFILE.email}`}
              className="mt-4 inline-block max-w-full rounded-sm border-b border-border pb-2 font-mono text-[clamp(1.0625rem,2vw,1.75rem)] font-medium tracking-tight break-words text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {PROFILE.email}
            </a>
            <p className="mt-5 max-w-xl type-helper text-muted-foreground">
              Email opens a message in your mail app. Copy it if you’d rather compose somewhere
              else.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild size="lg">
                <a href={`mailto:${PROFILE.email}`}>
                  Write an email <Send aria-hidden="true" />
                </a>
              </Button>
              <CopyEmailButton email={PROFILE.email} />
            </div>
          </div>

          <div className="min-w-0">
            <p className="type-label text-muted-foreground">Professional profiles</p>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {verifiedLinks.map((link) => {
                const Icon = link.kind === "linkedin" ? BriefcaseBusiness : Code2;

                return (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex min-h-16 items-center justify-between gap-4 rounded-md py-4 transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <Icon aria-hidden="true" className="size-4 shrink-0 text-primary" />
                        <span className="min-w-0">
                          <span className="block type-card-title text-foreground">
                            {link.label}
                          </span>
                          <span className="mt-0.5 block truncate type-meta text-muted-foreground">
                            {displayUrl(link.href)}
                          </span>
                        </span>
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 type-helper text-muted-foreground">
              Verified profile links, opened separately so this portfolio stays easy to return to.
            </p>
          </div>
        </section>

        {resumeHref ? (
          <section
            aria-labelledby="resume-title"
            className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-start gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-md border border-border bg-muted/50 text-primary">
                <FileText aria-hidden="true" className="size-4" />
              </span>
              <div className="min-w-0">
                <h2 id="resume-title" className="type-card-title text-foreground">
                  Resume
                </h2>
                <p className="mt-1 type-helper text-muted-foreground">
                  PDF document · Vivek Thakur
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:shrink-0">
              <Button asChild variant="outline">
                <a href={resumeHref} target="_blank" rel="noopener noreferrer">
                  View resume <ArrowUpRight aria-hidden="true" />
                </a>
              </Button>
              <Button asChild>
                <a href={resumeHref} download>
                  Download PDF <ArrowDownToLine aria-hidden="true" />
                </a>
              </Button>
            </div>
          </section>
        ) : null}

        <div className="flex items-start gap-3 border-t border-border pt-5">
          <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="type-helper text-muted-foreground">
            This page uses direct contact links only. There is no contact form or message
            collection.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
