// Two renderers read the ledger: the site (src/app) and the resume
// (render/resume.ts). Where a field is only for one of them, it says so.

/** "url" or "url | label" */
export type Link = string;

/** "2025-09", "2025-09 /" (ongoing), "2022-01 / 2024-08", or "2026-fall" */
export type When = string;

/** Site: homepage timeline row. A string overrides the label: "label | grey suffix". */
type Timeline = true | string;

export type About = {
  name: string;
  address: Link[];
  interests: string;
  skills: [string, string][];
};

export type Degree = {
  id: string;
  school: string;
  where: string;
  degree: string;
  field: string;
  when: When;
  detail: string;
  /** Right-aligned next to detail, e.g. GPA. */
  aside?: string;
  /** Printed on its own line under detail. */
  advisor?: string;
  timeline?: Timeline;
};

/**
 * Bullets are the resume's text; ORDER IS PRIORITY. "[@id]" cites a paper
 * and renders as its number in Publications.
 */
export type Job = {
  id: string;
  org: string;
  where: string;
  role: string;
  team?: string;
  tech?: string;
  when: When;
  bullets: string[];
  timeline?: Timeline;
};

/** On both: the resume shows blurb + bullets, the site shows a project card. */
export type Research = {
  id: string;
  org: string;
  when: When;
  blurb: string;
  bullets: string[];
  // site card
  title: string;
  /** Site: role tag under the title, e.g. "Maintainer / Researcher". Named
   * differently from Job's `role` so resume.ts's "role" in e narrowing still
   * distinguishes Job from Research. */
  roleTag?: string;
  link?: Link;
  repo?: string;
};

/** On the site if it has a blurb, on the resume if it has bullets. */
export type Project = {
  id: string;
  title: string;
  tech?: string;
  link?: Link;
  /** Site: GitHub "owner/name", for the language list. */
  repo?: string;
  report?: Link;
  /** Site: group heading on /projects. */
  tag?: string;
  /** Site: role tag under the title, e.g. "Maintainer". */
  role?: string;
  blurb?: string;
  bullets?: string[];
};

export type Paper = {
  id: string;
  title: string;
  /** "@me" is bolded. */
  authors: string[];
  venue: string;
  short: string;
  when: When;
  where: string;
  status?: "to-appear";
  pages?: number;
  doi?: string;
  pdf?: string;
  publisher?: string;
};

export type Talk = {
  id: string;
  title: string;
  venue: string;
  where: string;
  when: When;
  links?: Record<string, string>;
};

export type Teaching = {
  id: string;
  role: string;
  org: string;
  /** Course number, e.g. "CS-GY 9223". */
  code?: string;
  title: string;
  when: When;
};

/** Site: [what happened (HTML), when]. */
export type News = [string, string];
