import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const sourceRoot = join(process.cwd(), "src");
const tokenFile = join(sourceRoot, "app", "globals.css");
// ImageResponse cannot resolve CSS custom properties; this file mirrors the dark tokens.
const staticImageColorFile = join(sourceRoot, "lib", "social-image-colors.ts");
const sourceExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".css"]);
const colorPattern = /(#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|\boklch\(|\bcolor\()/;

async function* walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      yield* walk(path);
      continue;
    }

    yield path;
  }
}

const violations = [];

for await (const file of walk(sourceRoot)) {
  if (!sourceExtensions.has(extname(file))) {
    continue;
  }

  if (file === tokenFile || file === staticImageColorFile || file.includes("opengraph-image")) {
    continue;
  }

  const lines = (await readFile(file, "utf8")).split(/\r?\n/);

  lines.forEach((line, index) => {
    if (line.includes("color-allow")) {
      return;
    }

    if (colorPattern.test(line)) {
      violations.push(`${relative(process.cwd(), file)}:${index + 1}: ${line.trim()}`);
    }
  });
}

if (violations.length > 0) {
  console.error("Raw color literals found. Use semantic tokens or a documented exception.");
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("No raw color literals found in src (token file excluded).");
