import type { ReactNode } from "react";
import { PageTransition } from "@/components/motion/motion-provider";

export default function Template({ children }: Readonly<{ children: ReactNode }>) {
  return <PageTransition>{children}</PageTransition>;
}
