import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { MotionProvider } from "@/components/motion/motion-provider";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SkipLink } from "@/components/layout/skip-link";
import { StatusBar } from "@/components/layout/status-bar";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PROFILE } from "@/data/profile";
import { createPersonJsonLd } from "@/lib/person-json-ld";
import { getAbsoluteSiteUrl, getSiteOrigin } from "@/lib/site-url";
import { cn } from "@/lib/utils";
import { getCommandPaletteData } from "@/lib/command-data";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  ...(getSiteOrigin() ? { metadataBase: getSiteOrigin() } : {}),
  ...(getAbsoluteSiteUrl("/") ? { alternates: { canonical: getAbsoluteSiteUrl("/") } } : {}),
  title: {
    default: "Vivek Thakur — Full-Stack Developer",
    template: "%s | Vivek Thakur",
  },
  description:
    "Portfolio of Vivek Thakur, a full-stack developer building responsive applications and reusable interfaces.",
  openGraph: {
    type: "website",
    siteName: "Vivek Thakur",
    title: "Vivek Thakur — Full-Stack Developer",
    description:
      "Portfolio of Vivek Thakur, a full-stack developer building responsive applications and reusable interfaces.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vivek Thakur — Full-Stack Developer",
    description:
      "Portfolio of Vivek Thakur, a full-stack developer building responsive applications and reusable interfaces.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={cn(geistSans.variable, geistMono.variable)}
    >
      <body className="min-h-dvh">
        <script
          id="person-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(createPersonJsonLd(PROFILE)).replace(/</g, "\\u003c"),
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MotionProvider>
            <TooltipProvider delayDuration={200}>
              <Script id="sidebar-state" strategy="beforeInteractive">
                {`try{var match=document.cookie.match(/(?:^|; )sidebar_state=collapsed(?:;|$)/);if(match){document.documentElement.dataset.sidebar="collapsed"}}catch(error){}`}
              </Script>
              <SkipLink />
              <AppSidebar />
              <div className="app-main min-h-dvh">
                <AppHeader commandData={getCommandPaletteData()} />
                {children}
                <StatusBar />
              </div>
            </TooltipProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
