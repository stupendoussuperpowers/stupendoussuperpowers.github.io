import { Project } from '../../components/Project';

import React from 'react';
import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';

import { myCustomFont } from '@/ui/font';

export default async function ProjectsPage() {
	const projects = await getStaticProps();

	const tags = [...new Set(projects.map(p => p.tag))].filter(x => x);
	console.log({ tags });

	return <div style={{ marginBottom: '80px', width: '100%' }}>
		<h1>Projects.</h1>
		{
			tags.map((t: string) => {
				return <>
					<div key={t} className="p-tag">{t.toUpperCase()}</div>
					{
						projects.filter((x: ProjectData) => x.tag === t)
							.map((element: ProjectData) => {
								return <li key={element.link}>
									<Project {...element} />
								</li>
							})}
				</>
			})
		}
	</div>;
}


export async function generateMetadata(
): Promise<Metadata> {
	return {
		title: "Projects / Sanchit Sahay"
	}
}

const getStaticProps = async () => {
	const filePath = path.join(process.cwd(), 'public', 'projects.txt');
	const projectFile = await fs.promises.readFile(filePath, 'utf-8');

	const projectLists = await Promise.all(projectFile.split("\n")
		.filter(x => x != "")
		.map(async (line: string) => {
			const [title, link, content, report, tag] = line.split("===");
			console.log(line.split("==="));

			const project: ProjectData = {
				title, link, content, report, tag
			};

			if (!project.link.includes("https://")) {
				const language = await fetch(`https://api.github.com/repos/${project.link}/languages`);
				const l_json = await language.json();
				console.log({ l_json });
				const filter = ["Objective-C", "Makefile", "Rich Text Format", "Roff", "Objective-C++"];

				//				const l_json = { "C": 100, "Rust": 100, "Whatever": 100, "Third": 100 };
				project.languages = Object.keys(l_json).filter(a => !filter.includes(a)).splice(0, 5).join(',');
				project.link = `https://github.com/${project.link}`;
			}

			if (report == ".") {
				project.report = null
			}

			console.log(project);
			return project;

		}));

	return projectLists.filter((x) => x != null);
}
