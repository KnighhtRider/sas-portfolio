export const SIDEBAR_COOKIE = "sidebar_state";

export type SidebarState = "expanded" | "collapsed";

const listeners = new Set<() => void>();

export function readSidebarCookie(): SidebarState {
  if (typeof document === "undefined") {
    return "expanded";
  }

  const match = document.cookie.match(/(?:^|; )sidebar_state=([^;]+)/);

  return match?.[1] === "collapsed" ? "collapsed" : "expanded";
}

export function getSidebarSnapshot(): SidebarState {
  if (typeof document === "undefined") {
    return "expanded";
  }

  const dataset = document.documentElement.dataset.sidebar;

  if (dataset === "collapsed" || dataset === "expanded") {
    return dataset;
  }

  return readSidebarCookie();
}

export function getServerSidebarSnapshot(): SidebarState {
  return "expanded";
}

export function subscribeSidebar(listener: () => void) {
  listeners.add(listener);

  return () => listeners.delete(listener);
}

export function writeSidebarState(state: SidebarState) {
  document.cookie = `${SIDEBAR_COOKIE}=${state}; Path=/; Max-Age=31536000; SameSite=Lax`;
  document.documentElement.dataset.sidebar = state;
  listeners.forEach((listener) => listener());
}
