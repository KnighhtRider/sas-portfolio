import {
  Briefcase,
  Clock,
  Code2,
  FolderKanban,
  LayoutDashboard,
  Mail,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  title: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Overview", title: "Overview", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", title: "Projects", icon: FolderKanban },
  { href: "/skills", label: "Skills", title: "Skills", icon: Code2 },
  { href: "/experience", label: "Experience", title: "Experience", icon: Briefcase },
  { href: "/activity", label: "Activity", title: "Activity", icon: Clock },
  { href: "/about", label: "About", title: "About", icon: UserRound },
  { href: "/contact", label: "Contact", title: "Contact", icon: Mail },
];

export function isNavItemActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function getActiveNavItem(pathname: string) {
  return NAV_ITEMS.find((item) => isNavItemActive(pathname, item.href));
}

export function getWorkspacePath(pathname: string) {
  return pathname === "/" ? "~/overview" : `~${pathname}`;
}

export function getPageTitle(pathname: string) {
  if (pathname === "/design") {
    return "Design system";
  }

  return getActiveNavItem(pathname)?.title ?? "Not found";
}
