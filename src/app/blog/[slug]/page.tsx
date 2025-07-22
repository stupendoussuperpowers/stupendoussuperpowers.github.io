import './post.css';
import { ReadIndex, ReadEntry } from '../../../utils';
import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';

export async function generateStaticParams() {
	const allArticles = await ReadIndex();
	return allArticles.map((article) => {
		return {
			slug: article.slug
		}
	});
}

type PageProps = Promise<{ slug: string }>;

export async function generateMetadata(
	{ params }: { params: PageProps },
): Promise<Metadata> {

	const { slug } = await params;
	console.log(params, slug);

	const postData = await ReadEntry(slug);

	return {
		title: postData.ok ? postData.value.index.title : "Blog / Sanchit Sahay",
		description: postData.ok ? postData.value.index.blurb : "",
	}
}


export default async function BlogPost({ params }: { params: PageProps }) {
	const { slug } = await params;

	const postData = await ReadEntry(slug);

	if (postData.ok) {
		return <div className='window-post'>
			<h1>{postData.value.index.title}</h1>
			<div>{postData.value.index.blurb}</div>
			<h2>{postData.value.index.date}</h2>
			<div className="header-image">
				{
					postData.value.index.headerImage ?
						<Image
							src={`/${postData.value.index.headerImage}`}
							width={1200}
							height={400}
							alt={'portrait'}
						/> : <> </>
				}
			</div>
			<div dangerouslySetInnerHTML={{ __html: postData.value.content.map(x => x.renderText).join("") }} />

			<div className="blog-cymk">
				<div>Last modified on: {postData.value.index.lastModified}   </div>
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
