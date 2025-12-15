import { BlogListItem } from '../../components/BlogListItem';
import './blog.css';
import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ReadIndex } from '../../utils';

const getStaticProps = async () => {
	const indexEntries: IndexEntry[] = await ReadIndex(true);
	console.log(indexEntries);
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
		<div style={{ margin: '10px 0px 30px 0px' }}>
			<Link href="/booksline" > Check out the books I&apos;ve been reading. </Link>
		</div>
		{
			articles.length > 0 ?
				<ul>
					{
						articles.map((article) => {
							return <li key={article.slug} className={article.pinned ? 'pin' : ''}>
								<BlogListItem {...article} />
							</li>
						})
					}
				</ul> :
				<div>No posts to show.</div>
		}
	</div>
}
