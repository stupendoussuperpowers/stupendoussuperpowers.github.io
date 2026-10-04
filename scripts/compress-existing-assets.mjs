// One-off cleanup: recompress the oversized images already sitting in
// public/. Run with: node scripts/compress-existing-assets.mjs
import fs from "fs/promises";
import path from "path";
import { compressImage } from "./compress-image.mjs";

const targets = [
  "leditor.gif",
  "editor.gif",
  "SBOMit_combo.png",
  "mt_washington.jpg",
  "staring_off_into_the_distance.jpg",
  "Edsger_Wybe_Dijkstra.jpg",
];

const publicDir = path.resolve("public");

for (const name of targets) {
  const filePath = path.join(publicDir, name);
  const before = await fs.readFile(filePath);
  const after = await compressImage(before, name);

  if (after.length < before.length) {
    await fs.writeFile(filePath, after);
  }

  const pct = (100 * (1 - after.length / before.length)).toFixed(1);
  console.log(
    `${name}: ${(before.length / 1024).toFixed(0)}KB -> ${(after.length / 1024).toFixed(0)}KB (${pct}% smaller)`,
  );
}
