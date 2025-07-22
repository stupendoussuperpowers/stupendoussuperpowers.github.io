import { Project } from '../../components/Project';

import React from 'react';
import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';

export default async function ProjectsPage() {
	const projects = await getStaticProps();
	return <div>
		<h1>Projects.</h1>
		<br />
		<ul>
			{
				projects.map((element: ProjectData) => {
					return <li key={element.slug}>
						<Project {...element} />
					</li>
				})
			}
		</ul>
		<br />
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

	const projectLists = await Promise.all(projectFile.split('\n').map(async (line: string) => {
		const [slug, content, report] = line.split('===', 3);
		const title = slug.split('/', 2)[1];

		if (content == undefined) return null;

		const language = await fetch(`https://api.github.com/repos/${slug}/languages`);
		const l_json = await language.json();

		const filter = ["Objective-C", "Makefile", "Rich Text Format", "Roff", "Objective-C++"];

		const languages = Object.keys(l_json).filter(a => !filter.includes(a)).join(',');

		return {
			title: title,
			slug: slug,
			content: content,
			report: report,
			languages: languages,
		};
	}));

	return projectLists.filter((x) => x != null);
}
