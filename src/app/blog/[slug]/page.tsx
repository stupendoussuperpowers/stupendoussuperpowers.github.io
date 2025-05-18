import './post.css';
import { ReadIndex, ReadEntry } from '../../../utils';
import React from 'react';

export async function generateStaticParams() {
    const allArticles = await ReadIndex();
    return allArticles.map((article) => {
        return {
            slug: article.slug
        }
    });
}

type PageProps = Promise<{ slug: string }>;

export default async function BlogPost({ params }: { params: PageProps }) {
    const { slug } = await params;

    const postData = await ReadEntry(slug);

    if (postData.ok) {
        return <div className='window-post'>
            <h1>{postData.value.index.title}</h1>
            <h2>{postData.value.index.date}</h2>
            <div dangerouslySetInnerHTML={{ __html: postData.value.content.map(x => x.renderText).join("") }} />

            <div className="blog-cymk">
                <div className="c box"></div>
                <div className="m box"></div>
                <div className="y box"></div>
                <div className="k box"></div>
            </div>
        </div>;
    } else {
        return <div>Page not found. </div>
    }
}
