import './project.css';
import React from 'react';
import Link from 'next/link';

type BlogListProps = IndexEntry & {
    writepad?: boolean
}

export const BlogListItem: React.FC<BlogListProps> = ({ title, blurb, date, slug, writepad }) => {
    const isDraft = slug.includes('drafts_');

    return (<div className='p-card'>
        <div className='p-title'>
            <Link href={`/${writepad ? 'writepad' : 'blog'}/${slug.replace(/\.md$/, '')}`}>
                <b>{isDraft ? '[DRAFT]' : ''}{title}</b>
            </Link>
            <div className='slug'>
                {date}
            </div>
        </div>
        <div>{blurb}</div>
    </div >);
}
