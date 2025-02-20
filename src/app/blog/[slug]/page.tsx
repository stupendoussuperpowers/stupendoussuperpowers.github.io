import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

import './post.css';

const md = new MarkdownIt();

export async function generateStaticParams() {
    const posts = await fs.promises.readdir(path.join(process.cwd(), '/src/posts/'));

    return posts.map((post) => ({
        slug: post.replace(/\.md$/, ''),
    }));
}

const fetchPostContent = async (slug: string) => {
    const postPath = path.join(process.cwd(), '/src/posts/', `${slug}.md`);
    const postContent = await fs.promises.readFile(postPath, 'utf-8');

    const { data, content } = matter(postContent);

    console.log({ data, postPath, slug });

    return { data, content };
}

type PageProps = Promise<{ slug: string }>;

export default async function BlogPost({ params }: { params: PageProps }) {
    const { slug } = await params;

    const { data, content } = await fetchPostContent(slug);

    const htmlContent = md.render(content);

    return <div className='window-post'>
        <h1>{data.title}</h1>
        <h2>{data.date}</h2>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
}
