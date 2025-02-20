import { BlogData, BlogListItem } from '@/components/BlogListItem';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import './blog.css';

const getStaticProps = async () => {
    const postPath = path.join(process.cwd(), '/src/posts');
    const articleNames = await fs.promises.readdir(postPath);

    return Promise.all(articleNames.map(async (file) => {
        const fileContent = await fs.promises.readFile(path.join(postPath, file), 'utf-8');
        const { data, content } = matter(fileContent);

        return {
            data: data,
            content: content,
            slug: file
        }
    }));
}

export default async function Blog() {

    const articles = await getStaticProps();

    return <div className='window-blog'>
        <h1>Blog.</h1>
        <ul>
            {
                articles.map((article) => {

                    const props: BlogData = { slug: article.slug, title: article.data.title, tag: article.data.tag, date: article.data.date };
                    console.log(props);
                    return <li key={article.data.title}>
                        <BlogListItem {...props} />
                    </li>
                }
                )
            }
        </ul>
    </div>
}


