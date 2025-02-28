'use client';
import { use, useState, useEffect, KeyboardEvent, MouseEvent, ChangeEvent } from 'react';
import '../custom.css';
import MarkdownIt from 'markdown-it';
import { BlockNode, IndexEntry } from '@/utils/index';

const md = MarkdownIt();

type PageProps = Promise<{ slug: string }>;

export default function WritePad({ params }: { params: PageProps }) {

  const { slug } = use(params);

  useEffect(() => {
    (async () => {
      const b = await fetch(`/api/readentry/${slug}`);
      const c = await b.json();

      setBlocks(c.content);
      setIndex(c.index);
    })();
  }, [slug]);

  const [blocks, setBlocks] = useState<BlockNode[]>([]);
  const [index, setIndex] = useState<IndexEntry | null>(null);


  const [newValue, setNewValue] = useState<string>('Type...');

  const handleNextBlock = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key == 'Enter' && event.shiftKey) {
      const rawText = (event.target as HTMLTextAreaElement).value;
      const display = md.render((event.target as HTMLTextAreaElement).value);

      const id = 'id_' + (Math.random() * 1000000).toString();

      setNewValue('');
      setBlocks((prev) => [...prev, { id, rawText, renderText: display, isEditing: false }]);

    }
  }

  const handleTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setIndex((prev) => ({
      title: (event.target as HTMLInputElement).value,
      date: prev ? prev.date : '',
      blurb: prev ? prev.blurb : '',
      slug: prev ? prev.slug : ''
    }));
  }

  const handleBlurb = (event: ChangeEvent<HTMLInputElement>) => {
    setIndex((prev) => ({
      blurb: (event.target as HTMLInputElement).value,
      date: prev ? prev.date : '',
      title: prev ? prev.blurb : '',
      slug: prev ? prev.slug : ''
    }));
  }

  const actualEdit = (event: ChangeEvent<HTMLTextAreaElement>, id: string) => {
    const block = blocks.map(x => {
      if (x.id == id) {
        x.rawText = (event.target as HTMLTextAreaElement).value;
      }
      return x;
    });

    setBlocks([...block]);
  };

  const startEdit = (_: MouseEvent<HTMLDivElement>, id: string) => {
    const block = blocks.map(x => {
      if (x.id == id) {
        x.isEditing = true;
      }
      return x;
    });

    setBlocks([...block]);
  };

  const handleEnter = (event: KeyboardEvent<HTMLTextAreaElement>, id: string) => {
    if (event.shiftKey && event.key == "Enter") {
      const block = blocks.map((x) => {
        if (x.id == id) {
          x.isEditing = false;
          x.renderText = md.render(x.rawText);
        }
        return x;
      });

      setBlocks([...block]);
    }
  };

  const changeNextBlock = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNewValue((event.target as HTMLTextAreaElement).value);
  }

  const savePost = async (draft: boolean) => {
    const result = await fetch('/api/addentry', {
      method: 'post',
      body: JSON.stringify({
        content: blocks,
        index: index,
        draft: draft,
      })
    });

    console.log({ result });
  };

  return <>
    <div className='window-post'>
      <div className='titlebar'>
        <Editable size='h1' value={index?.title} setValue={handleTitle} />
        <Editable size='h2' value={index?.blurb} setValue={handleBlurb} />
        <div>
          <button className='titlebutton' onClick={() => savePost(true)}>Save</button>
          <button className='titlebutton' onClick={() => savePost(false)}>Publish</button>
        </div>
      </div>
      {
        blocks.map((block: BlockNode, index: number) => {
          return block.isEditing ? <textarea
            className='gap'
            value={block.rawText}
            key={block.id}
            onKeyDown={(e) => handleEnter(e, block.id)}
            onChange={(e) => actualEdit(e, block.id)} />
            :
            <div key={index}
              className='gap'
              onClick={(e) => startEdit(e, block.id)}
              dangerouslySetInnerHTML={{ __html: block.renderText }} />
        })
      }
    </div>
    <textarea value={newValue} onKeyDown={handleNextBlock} onChange={changeNextBlock} />
  </>;
}

const Editable: React.FC<{ value: string | undefined, setValue: (event: ChangeEvent<HTMLInputElement>) => void, size: string }> = ({ value, setValue, size }) => {
  const [editing, setEditing] = useState<boolean>(false);

  return editing ? <input value={value} onChange={setValue} onKeyDown={
    (e) => {
      if (e.key == 'Enter' && e.shiftKey) setEditing(false);
    }
  } /> : size == 'h1' ? <h1 onClick={() => setEditing(true)} onInput={setValue}>{value}</h1 >
    : <h2 onClick={() => setEditing(true)} onInput={setValue}>{value}</h2>
}


