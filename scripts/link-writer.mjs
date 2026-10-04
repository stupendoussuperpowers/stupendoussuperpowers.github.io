// Links the writer-only routes (blog editor UI + its API) into the app tree
// so `next dev` can serve them. They live outside src/ so a plain
// `next build` (used for the static export) never sees them at all — no
// exclusion logic needed at build time.
//
// Uses per-file hardlinks rather than a directory symlink: Next's App
// Router directory scanner uses fs.readdir's dirent.isDirectory(), which is
// false for a symlink pointing at a directory, so a symlinked directory is
// silently skipped. A hardlinked file is a real directory entry pointing at
// the same inode, so it's indistinguishable from an ordinary file — and
// edits through either path hit the same content, so dev hot reload still
// works either way.
import fs from "fs";
import path from "path";

const roots = [
  ["writer/app/writepad", "src/app/writepad"],
  ["writer/pages/api", "src/pages/api"],
];

function linkTree(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });

  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const from = path.join(srcDir, entry.name);
    const to = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      linkTree(from, to);
      continue;
    }

    if (fs.existsSync(to)) {
      const same = fs.statSync(from).ino === fs.statSync(to).ino;
      if (same) continue;
      throw new Error(`${to} already exists and isn't linked to ${from}. Remove it before running dev.`);
    }

    fs.linkSync(from, to);
    console.log(`linked ${to} -> ${from}`);
  }
}

for (const [target, linkPath] of roots) {
  linkTree(path.resolve(target), path.resolve(linkPath));
}
