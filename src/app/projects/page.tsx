import { Project } from "../../components/Project";
import { Publication } from "../../components/Publication";

import React from "react";
import { Metadata } from "next";

import { myCustomFont } from "@/ui/font";
import {
  siteProjects,
  siteResearch,
  sitePapers,
} from "../../../resumaker/render/site";

export default async function ProjectsPage() {
  const publications = sitePapers();
  const research = siteResearch();
  const projects = siteProjects();
  // const languages = await languagesByRepo([...research, ...projects]);

  const tags = [...new Set(projects.map((p) => p.tag))];

  return (
    <div style={{ marginBottom: "80px", width: "100%" }}>
      <div
        className={myCustomFont.className}
        style={{ fontSize: "30px", marginBottom: "30px" }}
      >
        Publications
      </div>
      {publications.map((entry) => {
        return <Publication key={entry.id} entry={entry} />;
      })}
      <div
        className={myCustomFont.className}
        style={{ fontSize: "30px", marginBottom: "30px", marginTop: "30px" }}
      >
        Research
      </div>
      {research.map((entry) => {
        return (
          <li key={entry.id}>
            <Project entry={entry} />
          </li>
        );
      })}
      <div
        className={myCustomFont.className}
        style={{ fontSize: "30px", marginBottom: "30px", marginTop: "30px" }}
      >
        Open Source &amp; Course Projects
      </div>
      {tags.map((t) => {
        return (
          <React.Fragment key={t}>
            <div className="p-tag">{t!.toUpperCase()}</div>
            {projects
              .filter((x) => x.tag === t)
              .map((entry) => {
                return (
                  <li key={entry.id}>
                    <Project entry={entry} />
                  </li>
                );
              })}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Projects / Sanchit Sahay",
  };
}

/*
const IGNORED = [
  "Objective-C",
  "Makefile",
  "Rich Text Format",
  "Roff",
  "Objective-C++",
];

 Top languages per repo, straight from GitHub, keyed by entry id.
const languagesByRepo = async (entries: { id: string; repo?: string }[]) => {
  const pairs = await Promise.all(
    entries
      .filter((e) => e.repo)
      .map(async (e) => {
        const res = await fetch(
          `https://api.github.com/repos/${e.repo}/languages`,
        );
        const langs = await res.json();

        return [
          e.id,
          Object.keys(langs)
            .filter((l) => !IGNORED.includes(l))
            .splice(0, 5)
            .join(","),
        ] as const;
      }),
  );

  return Object.fromEntries(pairs);
};
*/
