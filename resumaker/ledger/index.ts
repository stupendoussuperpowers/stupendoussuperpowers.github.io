// The single source of truth. Plain data; the site (src/app) and the resume
// (render/resume.ts) each import the lists they need and decide how to show them.
export * from "./types";
export { me } from "./about";
export { degrees } from "./education";
export { employment } from "./employment";
export { research } from "./research";
export { papers } from "./papers";
export { talks } from "./talks";
export { teaching } from "./teaching";
export { projects } from "./projects";
export { news } from "./news";
export { when, byRecency } from "../when";

/** "url | label" -> { url, label }; label defaults to the bare url. */
export const link = (v?: string) => {
  if (!v) return null;
  const [url, label] = v.split("|").map((s) => s.trim());
  return { url, label: label || url.replace(/^https?:\/\//, "") };
};
