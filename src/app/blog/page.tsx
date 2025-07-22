import { BlogListItem } from '../../components/BlogListItem';
import './blog.css';
import React from 'react';
import { Metadata } from 'next';
import { ReadIndex } from '../../utils';

const getStaticProps = async () => {
	const indexEntries: IndexEntry[] = await ReadIndex(true);
	return indexEntries;
}

export async function generateMetadata(
): Promise<Metadata> {
	return {
		title: "Blog / Sanchit Sahay"
	}
}

export default async function Blog() {
	const articles = await getStaticProps();

	return <div className='window-blog'>
		<h1>Blog.</h1>
		{
			articles.length > 0 ?
				<ul>
					{
						articles.map((article) => {
							return <li key={article.date}>
								<BlogListItem {...article} />
							</li>
						})
					}
				</ul> :
				<div>No posts to show.</div>
		}
	</div>
}
