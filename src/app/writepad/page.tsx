'use client';
import { useState, useEffect } from 'react';
import './custom.css';
import { BlogListItem } from '../../components/BlogListItem';
import React from 'react';

const randomUUID = () => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		const r = Math.random() * 16 | 0;
		const v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

const DefaultNewIndex: IndexEntry = {
	slug: `article-${randomUUID()}`,
	title: 'What this about?',
	date: '1st January 1970',
	draft: true,
	blurb: "What's this reaaalllly about?"
}

const DefaultNewPost: PostEntry = {
	index: DefaultNewIndex,
	content: [{
		rawText: 'Get started...',
		renderText: 'Get started...',
		id: `id_${(Math.random() * 1000000).toString()}`
	}]
};

export default function WritePad() {

	const [posts, setPosts] = useState<IndexEntry[]>([]);

	useEffect(() => {
		(async () => {
			const p = await fetch('/api/readindex');
			const pj = await p.json();
			console.log({ pj });
			setPosts(pj.posts)
		})()
	}, []);

	const newPost = async () => {
		await fetch('/api/addentry', {
			method: 'POST',
			body: JSON.stringify({ ...DefaultNewPost })
		});

		location.href = `/writepad/${DefaultNewIndex.slug}`;
	};

	return <>
		<div className='titlebar'>
			<h1>Posts.</h1>
			<button onClick={newPost}>New Post</button>
		</div>
		<div>
			{
				posts.length > 0 ? posts.map(ind =>
					<BlogListItem key={ind.slug} {...ind} writepad={true} />
				) : <>No posts or drafts to report.</>
			}
		</div>
	</>;
};
