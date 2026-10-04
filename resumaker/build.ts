import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { resume } from "./render/resume";

const here = path.dirname(fileURLToPath(import.meta.url));

// out/ is a complete, portable build directory: the .tex plus the class it
// asks for, so `cd out && tectonic resume.tex` works, and so does zipping it
// straight into Overleaf.
const out = path.join(here, "out");
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "resume.tex"), resume());
fs.copyFileSync(
  path.join(here, "style", "resume.cls"),
  path.join(out, "resume.cls"),
);
if (fs.existsSync(path.join(out, "resume.pdf")))
  fs.copyFileSync(
    path.join(out, "resume.pdf"),
    path.join(here, "..", "public", "sanchit_sahay.pdf"),
  );

console.log("resumaker -> out/resume.tex");
