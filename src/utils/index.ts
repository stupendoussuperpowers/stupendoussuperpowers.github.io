import MarkdownIt from 'markdown-it';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const md = MarkdownIt();

export type IndexEntry = {
	slug: string,
	date: string,
	title: string,
	blurb: string
}

export type PostEntry = {
	title: string,
	date: string,
	htmlContent: string,
}

// Read post indexes 
export const readIndex = async (): Promise<IndexEntry[]> => {
	const filePath = path.join(process.cwd(), '/src/posts/filedb');
	const fileData = await fs.promises.readFile(filePath, 'utf-8');

	return fileData.toString().split("\n").map((line: string) => {
		const rawIndex = line.split("|");
		return {
			slug: rawIndex[0],
			date: rawIndex[1],
			title: rawIndex[2],
			blurb: rawIndex[3]
		};
	});

}

// Add entry 
export const addEntry = async (content: string, title: string, date: string, blurb: string) => {
	const genSlug = title.toLowerCase().split(" ").join("-");

	const indexPath = path.join(process.cwd(), '/src/posts/filedb');
	await fs.promises.appendFile(indexPath, `${genSlug.replace(/\.md$/, '')}|${date}|${title}|${blurb}`);

	const postPath = path.join(process.cwd(), `/src/posts/${genSlug}.md`);
	await fs.promises.writeFile(postPath, content);
}

// Read entry
export const readEntry = async (slug: string): Promise<BlogPost> => {
	const filePath = path.join(process.cwd(), `/src/posts/${slug}.md`);
	const fileData = await fs.promises.readFile(filePath, 'utf-8');

	const { data, content } = matter(fileData);

	return {
		title: data.title,
		date: data.date,
		htmlContent: md.render(content),
	}
}
