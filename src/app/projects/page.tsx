import { Project, ProjectData } from '@/components/Project';

import fs from 'fs';
import path from 'path';

export default async function ProjectsPage() {
    const projects = await getStaticProps();
    return <div>
        <h1>Projects.</h1>
        <ul>
            {
                projects.map((element: ProjectData) => {
                    return <li key={element.slug}>
                        <Project {...element} />
                    </li>
                })
            }
        </ul>
    </div>;
}

const getStaticProps = async () => {
    const filePath = path.join(process.cwd(), 'public', 'projects.txt');
    const projectFile = await fs.promises.readFile(filePath, 'utf-8');

    const projectLists = await Promise.all(projectFile.split('\n').map(async (line: string) => {
        const [slug, content] = line.split('===', 2);
        const title = slug.split('/', 2)[1];

        if (content == undefined) return null;

        const readme_fetch = await fetch(`https://api.github.com/repos/${slug}/contents/README.md`);
        const readme_json = await readme_fetch.json();

        const readme = atob(readme_json.content);

        const language = await fetch(`https://api.github.com/repos/${slug}/languages`);
        const l_json = await language.json();

        const languages = Object.keys(l_json).join(',');

        return {
            title: title,
            slug: slug,
            content: content,
            readme: readme,
            languages: languages,
        };
    }));

    return projectLists.filter((x) => x != null);
}
