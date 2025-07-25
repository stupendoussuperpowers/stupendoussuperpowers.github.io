import './project.css';
import React from 'react';
import Link from 'next/link';

type BlogListProps = IndexEntry & {
	writepad?: boolean
}

export const BlogListItem: React.FC<BlogListProps> = ({ publish, title, blurb, date, slug, writepad }) => {
	console.log(publish, title, blurb, date, slug, writepad);
	return (<div className='p-card'>
		<div className='p-title'>
			<Link href={`/${writepad ? 'writepad' : 'blog'}/${slug.replace(/\.md$/, '')}`}>
				<b>{!publish ? '[DRAFT] ' : ''}{title}</b>
			</Link>
			<div className='slug'>
				{date}
			</div>
		</div>
		<div>{blurb}</div>
	</div >);
}
