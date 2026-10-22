import { describe, expect, it } from "vitest";
import { getAvailableResumeHref } from "@/lib/resume";

describe("getAvailableResumeHref", () => {
  it("returns the configured local resume when the PDF exists", () => {
    expect(getAvailableResumeHref()).toBe("/resume/vivek_Thakur_Resume.pdf");
  });

  it("omits missing files and unsafe paths", () => {
    expect(getAvailableResumeHref("/resume/missing.pdf")).toBeUndefined();
    expect(getAvailableResumeHref("/resume/../private.pdf")).toBeUndefined();
    expect(getAvailableResumeHref("https://example.com/resume.pdf")).toBeUndefined();
  });
});
