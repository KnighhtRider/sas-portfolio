import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(process.cwd(), "src", "app", "globals.css"), "utf8");

type Rgb = [number, number, number];

function parseTokens(selector: string): Record<string, string> {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const block = css.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`))?.[1];

  if (!block) {
    throw new Error(`Missing token block: ${selector}`);
  }

  return Object.fromEntries(
    [...block.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8});/g)].map((match) => [
      match[1]!,
      match[2]!,
    ]),
  );
}

function hexToRgb(hex: string): Rgb {
  const value = hex.replace("#", "");

  if (value.length === 3) {
    return [0, 2, 4].map((index) => parseInt(value[index]! + value[index]!, 16)) as Rgb;
  }

  return [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16)) as Rgb;
}

function relativeLuminance(hex: string): number {
  const channels = hexToRgb(hex).map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!;
}

function contrastRatio(foreground: string, background: string): number {
  const first = relativeLuminance(foreground);
  const second = relativeLuminance(background);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);

  return (lighter + 0.05) / (darker + 0.05);
}

const light = parseTokens(":root");
const dark = parseTokens(".dark");

const textPairs = [
  ["foreground", "background"],
  ["foreground", "card"],
  ["card-foreground", "card"],
  ["popover-foreground", "popover"],
  ["muted-foreground", "background"],
  ["muted-foreground", "card"],
  ["primary-foreground", "primary"],
  ["destructive-foreground", "destructive"],
  ["success-foreground", "success"],
  ["warning-foreground", "warning"],
  ["sidebar-foreground", "sidebar"],
  ["accent-soft-foreground", "accent-soft"],
] as const;

describe("design token contrast", () => {
  it("computes the known black/white ratio", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 1);
  });

  for (const [theme, tokens] of [
    ["light", light],
    ["dark", dark],
  ] as const) {
    describe(`${theme} theme`, () => {
      for (const [foreground, background] of textPairs) {
        it(`${foreground} on ${background} meets AA`, () => {
          expect(contrastRatio(tokens[foreground]!, tokens[background]!)).toBeGreaterThanOrEqual(
            4.5,
          );
        });
      }

      it("input borders and focus rings meet the 3:1 non-text threshold", () => {
        expect(contrastRatio(tokens.input!, tokens.background!)).toBeGreaterThanOrEqual(3);
        expect(contrastRatio(tokens.ring!, tokens.background!)).toBeGreaterThanOrEqual(3);
      });

      it("chart series are distinguishable from the page background", () => {
        for (let index = 1; index <= 5; index += 1) {
          expect(
            contrastRatio(tokens[`chart-${index}`]!, tokens.background!),
          ).toBeGreaterThanOrEqual(3);
        }
      });
    });
  }
});
