'use client';
import { use, useState, useEffect, KeyboardEvent, MouseEvent, ChangeEvent, useRef } from 'react';
import '../custom.css';
import MarkdownIt from 'markdown-it';
import React from 'react';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';
import { RiDeleteBin6Fill } from 'react-icons/ri';

const md = MarkdownIt();

type PageProps = Promise<{ slug: string }>;

/*
 * Workflow for writepad. 
 *
 * [ view all existing posts | drafts ]
 * [ click new ]
 *    - new slug is generated as a draft. 
 *    - 'save' saves to draft version.
 *    - 'publish' pushes to regular posts. remove draft_
 * [ view existing post ]
 *    - is draft: keep draft jump to previous steps
 *    - exists: create a draft version jump to previous steps.
 * */


export default function WritePad({ params }: { params: PageProps }) {

  const { slug } = use(params);

  const [blocks, setBlocks] = useState<BlockNode[]>([]);
  const [hovers, setHovers] = useState<boolean[]>()

  const [index, setIndex] = useState<IndexEntry>({
    title: 'Loading',
    date: 'Loading',
    blurb: 'Loading',
    slug,
    draft: true,
  });

  useEffect(() => {
    (async () => {
      const b = await fetch(`/api/readentry/${slug}`);
      const c = await b.json();

      console.log({ c });
      setBlocks(c.content);
      setIndex(c.index);
    })();
  }, [slug]);

  const [newValue, setNewValue] = useState<string>('Type...');

  const handleNextBlock = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    console.log(event.key);
    if (event.key == 'Enter' && event.shiftKey) {
      const rawText = (event.target as HTMLTextAreaElement).value;
      const display = md.render((event.target as HTMLTextAreaElement).value);

      const id = 'id_' + (Math.random() * 1000000).toString();

      setNewValue('');
      setBlocks((prev) => [...prev, { id, rawText, renderText: display, isEditing: false }]);
    }
  }

  const handleInsertion = (index: number, position = 'after') => {
    console.log('[handleNewBlock] ', index, position);
    console.log('[handleNewBlock] ', blocks.length, blocks);
    const pos = position == 'after' ? index + 1 : index;
    setBlocks((prev) => {
      return position != 'delete' ? [
        ...prev.slice(0, pos),
        { id: `id_${(Math.random() * 1000000).toString()}`, rawText: 'Edit...', renderText: 'Edit...', isEditing: false },
        ...prev.slice(pos)
      ] : [...prev.slice(0, pos), ...prev.slice(pos + 1)];
    });
  }

  const handleTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setIndex((prev) => ({
      title: (event.target as HTMLInputElement).value,
      date: prev ? prev.date : '',
      blurb: prev ? prev.blurb : '',
      slug: prev ? prev.slug : '',
      draft: prev ? prev.draft : true
    }));
  }

  const handleBlurb = (event: ChangeEvent<HTMLInputElement>) => {
    setIndex((prev) => ({
      blurb: (event.target as HTMLInputElement).value,
      date: prev ? prev.date : '',
      title: prev ? prev.title : '',
      slug: prev ? prev.slug : '',
      draft: prev ? prev.draft : true
    }));
  }

  const actualEdit = (event: ChangeEvent<HTMLTextAreaElement>, id: string) => {
    event.target.style.height = 'auto';
    event.target.style.height = event.target.scrollHeight.toString() + "px";

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
    event.target.style.height = 'inherit';
    event.target.style.height = event.target.scrollHeight.toString() + "px";
    setNewValue((event.target as HTMLTextAreaElement).value);
  }

  const savePost = async (draft: boolean) => {
    console.log('Saving...', { blocks, index, draft });
    const result = await fetch('/api/addentry', {
      method: 'post',
      body: JSON.stringify({
        content: blocks,
        index: { ...index, draft }
      })
    });
    console.log({ result });
  };

  return <>
    <div className='window-post'>
      <div className='titlebar'>
        <div>
          <Editable size='h1' value={index?.title} setValue={handleTitle} />
          <Editable size='h2' value={index?.blurb} setValue={handleBlurb} />
        </div>
        <div>
          <button className='titlebutton' onClick={() => savePost(true)}>Save</button>
          <button className='titlebutton' onClick={() => savePost(false)}>Publish</button>
        </div>
      </div>
      <div className='prosebox'>
        {
          blocks.length > 0 ? blocks.map((block: BlockNode, index: number) =>
            <div key={index} className='block-display'>
              <BlockDisplay
                block={block}
                actualEdit={actualEdit}
                handleEnter={handleEnter}
                startEdit={startEdit} />
              {block.isEditing ?
                <div className='ctrlpanel'>
                  <button className='controls' onClick={() => handleInsertion(index, 'before')} ><FaCaretUp /></button>
                  <button className='controls' onClick={() => handleInsertion(index, 'delete')}><RiDeleteBin6Fill /></button>
                  <button className='controls' onClick={() => handleInsertion(index, 'after')}><FaCaretDown /></button>
                </div> : <></>}
            </div>
          ) :
            <textarea onChange={changeNextBlock} onKeyDown={handleNextBlock} />
        }
      </div>
    </div>
  </>;
}


const BlockDisplay = ({ block, handleEnter, actualEdit, startEdit }) => {

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (block.isEditing) {
      textareaRef.current?.focus();
    }
  }, [block.isEditing]);

  return <div
    style={{ width: '100%' }}
    onClick={(e) => startEdit(e, block.id)}
  >
    {
      block.isEditing ? <textarea
        ref={textareaRef}
        className='gap.prose'
        value={block.rawText}
        key={block.id}
        onKeyDown={(e) => handleEnter(e, block.id)}
        onChange={(e) => actualEdit(e, block.id)} />
        :
        <div
          className='gap'
          dangerouslySetInnerHTML={{ __html: block.renderText }} />
    }
  </div>;
}

const Editable: React.FC<{ value: string | undefined, setValue: (event: ChangeEvent<HTMLInputElement>) => void, size: string }> = ({ value, setValue, size }) => {
  const [editing, setEditing] = useState<boolean>(false);

  return editing ? <p contentEditable={true} onChange={setValue} onKeyDown={
    (e) => {
      if (e.key == 'Enter' && e.shiftKey) setEditing(false);
    }
  }>{value}</p> : size == 'h1' ? <h1 onClick={() => setEditing(true)} onInput={setValue}>{value}</h1 >
    : <div onClick={() => setEditing(true)} onInput={setValue}>{value}</div>
}
