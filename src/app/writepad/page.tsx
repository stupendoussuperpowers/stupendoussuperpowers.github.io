'use client';
import { IndexEntry, PostEntry } from '@/utils';
import './custom.css';
import { BlockNode } from '@/utils';

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
    </div>
  </>;
}


