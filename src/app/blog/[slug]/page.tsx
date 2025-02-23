import './post.css';
import { readIndex, readEntry, PostEntry } from '@/utils';

export async function generateStaticParams() {
    const allArticles = await readIndex();

    allArticles.map((article) => {
        return {
            slug: article.slug
        }
    });
}

type PageProps = Promise<{ slug: string }>;

export default async function BlogPost({ params }: { params: PageProps }) {
    const { slug } = await params;

    const postData: PostEntry = await readEntry(slug);

    return <div className='window-post'>
        <h1>{postData.title}</h1>
        <h2>{postData.date}</h2>
        <div dangerouslySetInnerHTML={{ __html: postData.htmlContent }} />
    </div>
}
