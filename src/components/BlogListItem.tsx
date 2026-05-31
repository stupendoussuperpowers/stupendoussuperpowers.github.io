import './project.css';
import React from 'react';
import Link from 'next/link';

type BlogListProps = IndexEntry & {
	writepad?: boolean;
	href?: string;
	entryType?: string;
}

export const BlogListItem: React.FC<BlogListProps> = ({ publish, title, blurb, date, slug, writepad, href, entryType }) => {
	const linkHref = href ?? `/${writepad ? 'writepad' : 'blog'}/${slug.replace(/\.md$/, '')}`;

	return (<div className='p-card'>
		<div className='p-title'>
			<Link href={linkHref}>
				<b>{!publish ? '[DRAFT] ' : ''}{title}</b>
			</Link>
			<div className='slug'>
				{entryType ? `${entryType} / ` : ''}{date}
			</div>
		</div>
		<div style={{ marginTop: "calc(var(--line-height) / 2)" }}>{blurb}</div>
	</div >);
}
