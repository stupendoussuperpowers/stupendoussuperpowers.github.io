'use client';
import { use, useEffect, useState, KeyboardEvent, KeyboardEventHandler, ChangeEventHandler, MouseEventHandler, ChangeEvent, useRef } from 'react';
import '../custom.css';
import MarkdownIt from 'markdown-it';
import React from 'react';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { Controller, useForm, SubmitHandler, useFieldArray } from 'react-hook-form';

const md = MarkdownIt();

type IndexEntry = {
	title: string;
	blurb: string;
	date?: string;
	slug?: string;
	draft?: boolean;
};

type PageProps = Promise<{ slug: string }>;

type BlockNode = {
	id: string;
	rawText: string;
	renderText: string;
};

type BlogEntry = IndexEntry & {
	blocks: BlockNode[]
};

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

	const { handleSubmit, control, setValue, watch,
		formState: { isSubmitting, isSubmitted } }
		= useForm<BlogEntry>({
			defaultValues: async () => {
				const b = await fetch(`/api/readentry/${slug}`);
				const c = await b.json();
				return { ...c.index, blocks: c.content };
			}
		});

	const { fields, remove, insert } = useFieldArray({ name: "blocks", control });

	const watchFieldArray = watch("blocks");
	const controlledFields = fields.map((field, index) => {
		return {
			...field,
			...watchFieldArray[index]
		}
	});

	// Local state for which block is being edited (by index)
	const [editingBlockIndex, setEditingBlockIndex] = useState<number | null>(0); // Start with first block editable

	const onSubmit: SubmitHandler<BlogEntry> = async (data,) => {
		const result = await fetch('/api/addentry', {
			method: 'post',
			body: JSON.stringify({
				content: data.blocks,
				index: {
					title: data.title,
					blurb: data.blurb,
					date: data.date,
					slug: data.slug,
					draft: true
				}
			})
		});
		console.log(result);
	};

	const actualEdit = (e: ChangeEvent<HTMLTextAreaElement>, index: number) => {
		const newRawText = e.target.value;
		const newRenderText = md.render(newRawText);
		setValue(`blocks.${index}.rawText`, newRawText);
		setValue(`blocks.${index}.renderText`, newRenderText);
	}

	const handleEnter = (e: KeyboardEvent<HTMLTextAreaElement>, index: number) => {
		if (!e.shiftKey && e.key === "Enter") {
			const caretPos = e.currentTarget.selectionStart;
			const paraStr = e.currentTarget.value;

			const [pre, post] = [paraStr.slice(0, caretPos), paraStr.slice(caretPos)];

			const newBlock = {
				id: `id_${(Math.random() * 1000000).toString()}`,
				rawText: post,
				renderText: md.render(post),
			};

			e.currentTarget.value = pre;

			setValue(`blocks.${index}.rawText`, pre);
			setValue(`blocks.${index}.renderText`, md.render(pre));
			insert(index + 1, newBlock);
			setEditingBlockIndex(index + 1);
		}
	};

	const titleRef = useRef<HTMLHeadingElement>(null);
	const blurbRef = useRef<HTMLHeadingElement>(null);

	// If fields change (e.g. after async load), reset editingBlockIndex to first block
	useEffect(() => {
		if (fields.length > 0) {
			setEditingBlockIndex(0);
		}
	}, [fields.length]);

	return <>
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className='window-post'>
				<div className='titlebar'>
					<div>
						<Controller
							control={control}
							name="title"
							render={({ field: { onChange, value } }) => {
								if (titleRef.current && !titleRef.current.textContent)
									titleRef.current.textContent = value;
								return < h1
									contentEditable
									onInput={(e) => onChange(e.currentTarget.textContent)}
									ref={titleRef}
								>
								</h1>;
							}}
						/>
						<Controller
							control={control}
							name="blurb"
							render={({ field: { onChange, value } }) => {
								if (blurbRef.current && !blurbRef.current.textContent)
									blurbRef.current.textContent = value;
								return <div
									contentEditable
									onInput={(e) => onChange(e.currentTarget.textContent)}
									ref={blurbRef}
								></div>;
							}}
						/>
					</div>
					<div>
						<button type="submit" className='titlebutton'>Save</button>
					</div>
				</div>
				<div className='prosebox'>
					{
						controlledFields.map((field, index) => {
							return <Controller
								key={field.id}
								name={`blocks.${index}`}
								control={control}
								render={({ field: formField }) => (
									<NewBlockDisplay
										id={formField.value.id}
										editing={editingBlockIndex === index}
										rawText={formField.value.rawText}
										renderText={formField.value.renderText}
										startEdit={() => setEditingBlockIndex(index)}
										endEdit={() => setEditingBlockIndex(null)}
										actualEdit={(e) => actualEdit(e, index)}
										handleEnter={(e) => handleEnter(e, index)}
										remove={() => remove(index)}
									/>
								)}
							/>;
						})
					}
				</div>
				<div className="blog-cymk">
					<div className="c box"></div>
					<div className="m box"></div>
					<div className="y box"></div>
					<div className="k box"></div>
				</div>
			</div >
		</form>
	</>;
}

interface NewBlockDisplayProps {
	id: string,
	editing: boolean,
	rawText: string,
	renderText: string,
	startEdit: () => void,
	endEdit: () => void,
	actualEdit: ChangeEventHandler<HTMLTextAreaElement>,
	remove: () => void,
	handleEnter: KeyboardEventHandler<HTMLTextAreaElement>,
};

const NewBlockDisplay: React.FC<NewBlockDisplayProps> = ({
	id,
	editing,
	rawText,
	renderText,
	startEdit,
	endEdit,
	actualEdit,
	handleEnter,
	remove,
}) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (editing) {
			textareaRef.current?.focus();
			if (textareaRef.current) {
				textareaRef.current.style.height = 'auto';
				textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
			}
		}
	}, [editing]);

	const handleClick: MouseEventHandler<HTMLDivElement> = (_) => {
		if (!editing) {
			startEdit();
		}
	};

	return <div
		style={{ width: '100%' }}
	>
		{
			editing ? <div style={{
				position: "relative",
				width: "100%"
			}}
				onBlur={endEdit}
			>
				<textarea
					ref={textareaRef}
					className='gap prose'
					value={rawText}
					key={id}
					onKeyDown={handleEnter}
					onChange={actualEdit} />
				<div className="ctrlpanel">
					<button className='controls' onClick={remove}><RiDeleteBin6Fill /></button>
				</div>
			</div>
				:
				<div
					className='gap'
					onClick={handleClick}
					dangerouslySetInnerHTML={{ __html: renderText.length == 0 ? "Start typing..." : renderText }} />
		}
	</div >;
} 