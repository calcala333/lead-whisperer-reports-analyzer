import { rm } from "node:fs/promises";

const legacyPostCssConfigs = [
  "postcss.config.js",
  "postcss.config.cjs",
  "postcss.config.mjs",
];

for (const file of legacyPostCssConfigs) {
  await rm(new URL(`../${file}`, import.meta.url), { force: true });
}
