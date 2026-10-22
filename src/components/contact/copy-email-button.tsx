"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

type CopyState = "idle" | "copied" | "error";

export function CopyEmailButton({ email }: { email: string }) {
  const [state, setState] = useState<CopyState>("idle");

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button type="button" variant="outline" size="lg" onClick={copyEmail}>
        {state === "copied" ? "Copied" : "Copy email"}
        {state === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      </Button>
      <p
        aria-live="polite"
        aria-atomic="true"
        className="min-h-4 type-meta text-muted-foreground"
        role="status"
      >
        {state === "copied"
          ? "Email copied to clipboard."
          : state === "error"
            ? "Could not copy automatically. Select the email address to copy it."
            : ""}
      </p>
    </div>
  );
}
