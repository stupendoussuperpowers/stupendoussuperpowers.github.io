import { Project } from "../../components/Project";
import { Publication } from "../../components/Publication";

import React from "react";
import fs from "fs";
import path from "path";
import { Metadata } from "next";

import { myCustomFont } from "@/ui/font";

export default async function ProjectsPage() {
  const publications = await getPublications();
  const projects = await getStaticProps();

  const tags = [...new Set(projects.map((p) => p.tag))].filter((x) => x);

  return (
    <div style={{ marginBottom: "80px", width: "100%" }}>
      <div
        className={myCustomFont.className}
        style={{ fontSize: "30px", marginBottom: "30px" }}
      >
        Publications
      </div>
      {publications.map((element: PublicationData, idx: number) => {
        return <Publication key={element.doi ?? idx} {...element} />;
      })}
      <div
        className={myCustomFont.className}
        style={{ fontSize: "30px", marginBottom: "30px", marginTop: "30px" }}
      >
        Projects
      </div>
      {tags.map((t: string) => {
        return (
          <React.Fragment key={t}>
            <div className="p-tag">{t.toUpperCase()}</div>
            {projects
              .filter((x: ProjectData) => x.tag === t)
              .map((element: ProjectData) => {
                return (
                  <li key={element.link}>
                    <Project {...element} />
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

const getPublications = async () => {
  const filePath = path.join(process.cwd(), "public", "publications.txt");
  const publicationFile = await fs.promises.readFile(filePath, "utf-8");

  const publicationLists = publicationFile
    .split("\n")
    .filter((x) => x != "")
    .map((line: string) => {
      const [authors, year, title, venue, date, location, pages, doi] =
        line.split("===");

      const publication: PublicationData = {
        authors,
        year,
        title,
        venue,
        date,
        location,
        pages,
        doi,
      };

      return publication;
    });

  return publicationLists.filter((x) => x != null);
};

const getStaticProps = async () => {
  const filePath = path.join(process.cwd(), "public", "projects.txt");
  const projectFile = await fs.promises.readFile(filePath, "utf-8");

  const projectLists = await Promise.all(
    projectFile
      .split("\n")
      .filter((x) => x != "")
      .map(async (line: string) => {
        const [title, link, content, report, tag] = line.split("===");

        const project: ProjectData = {
          title,
          link,
          content,
          report,
          tag,
        };

        if (!project.link.includes("https://")) {
          const language = await fetch(
            `https://api.github.com/repos/${project.link}/languages`,
          );
          const l_json = await language.json();
          const filter = [
            "Objective-C",
            "Makefile",
            "Rich Text Format",
            "Roff",
            "Objective-C++",
          ];

          // const l_json = { "C": 100, "Rust": 100, "Whatever": 100, "Third": 100 };
          project.languages = Object.keys(l_json)
            .filter((a) => !filter.includes(a))
            .splice(0, 5)
            .join(",");
          project.link = `https://github.com/${project.link}`;
        }

        if (report == ".") {
          project.report = null;
        }

        return project;
      }),
  );

  return projectLists.filter((x) => x != null);
};
