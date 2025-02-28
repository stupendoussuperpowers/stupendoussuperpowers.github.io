'use client';
import { useState, useEffect } from 'react';
import './custom.css';
import { BlogListItem } from '../../components/BlogListItem';
import React from 'react';

const DefaultNewBlock: BlockNode = {
  id: `id_${Math.random() * 100000000}`,
  rawText: 'Add something here...',
  renderText: '<p>Add something here...</p>',
  isEditing: false
}

const DefaultNewIndex: IndexEntry = {
  slug: `article-${Math.random() * 400}-${Math.random() * 400}-${Math.random() * 400}-${Math.random() * 400}-`,
  title: 'What this about?',
  date: '1st January 1970',
  blurb: "What's this reaaalllly about?"
}

const DefaultNewPost: PostEntry = {
  index: DefaultNewIndex,
  content: [DefaultNewBlock]
};

export default function WritePad() {

  const [posts, setPosts] = useState<IndexEntry[] | null>(null);

  useEffect(() => {
    (async () => {
      const p = await fetch('/api/readindex');
      const pj = await p.json();

      setPosts(pj)
    })()
  }, []);

  const newPost = async () => {
    await fetch('/api/addentry', {
      method: 'POST',
      body: JSON.stringify({ ...DefaultNewPost })
    });

    location.href = `/writepad/drafts-${DefaultNewIndex.slug}`;
  };

  return <>
    <div className='titlebar'>
      <h1>Posts.</h1>
      <button onClick={newPost}>New Post</button>
      {
        posts?.map(ind =>
          <BlogListItem key={ind.slug} {...ind} />
        )
      }
    </div>
  </>;
}
