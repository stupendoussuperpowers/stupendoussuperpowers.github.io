import { BlogListItem } from '../../components/BlogListItem';
import './blog.css';
import React from 'react';

import { ReadIndex } from '../../utils';

const getStaticProps = async () => {
    const indexEntries: IndexEntry[] = await ReadIndex();
    return indexEntries;
}

export default async function Blog() {
    const articles = await getStaticProps();

    return <div className='window-blog'>
        <h1>Blog.</h1>
        <ul>
            {
                articles.map((article) => {
                    return <li key={article.date}>
                        <BlogListItem {...article} />
                    </li>
                })
            }
        </ul>
    </div>
}


