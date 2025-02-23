'use client';
import { useState, KeyboardEvent, ChangeEvent, FormEventHandler, FormEvent } from 'react';

import MarkdownIt from 'markdown-it';

const md = MarkdownIt();

type BlockNode = {
  rawText: string,
  renderText: string,
}

export default function WritePad() {

  const [blocks, setBlocks] = useState<BlockNode[]>([]);
  const [title, setTitle] = useState<string>('This is the title...');

  const handleNextBlock = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key == 'Enter') {
      const rawText = (event.target as HTMLInputElement).value;
      const display = md.render((event.target as HTMLInputElement).value);

      setBlocks((prev) => [...prev, { rawText, renderText: display }]);
    }
  }

  const handleTitle = (event: FormEvent<HTMLDivElement>) => {
    setTitle(`${event.currentTarget.textContent}`);
  }

  const handleBlockEdit = (event: FormEvent<HTMLDivElement>) => {

    const rawData = event.currentTarget.getAttribute('data-raw');

    event.currentTarget.setHTMLUnsafe(`${rawData}`);
  }

  const handleBlockBlur = (event: FormEvent<HTMLDivElement>, index: number) => {
    setBlocks(prev => {
      const newBlocks = [...prev];
      newBlocks[index] = { rawText: event.currentTarget.innerText, renderText: md.render(event.currentTarget.innerText) };
      return newBlocks;
    });
  }

  return <>
    <div className='window-post'>
      <h1 onChange={handleTitle} contentEditable={true}>{title}</h1>
      <h2>01/01/1970</h2>
      {
        blocks.map((block: BlockNode, index: number) => {
          return <div key={index}
            data-raw={block.rawText}
            onBlur={(event) => handleBlockBlur(event, index)}
            onClick={handleBlockEdit}
            contentEditable={true}
            dangerouslySetInnerHTML={{ __html: block.renderText }} />
        })
      }
    </div>
    <input placeholder="New Text Here..." onKeyDown={handleNextBlock} />
  </>;
}
