"use client";
import {
	use,
	useEffect,
	useState,
	KeyboardEventHandler,
	MouseEventHandler,
	useRef,
	ChangeEvent,
} from "react";
import "../custom.css";
import MarkdownIt from "markdown-it";
import React from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";
import {
	Controller,
	useForm,
	SubmitHandler,
	useFieldArray,
} from "react-hook-form";
import Image from "next/image";

const md = MarkdownIt();

const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
	return self.renderToken(tokens, idx, options);
};

md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
	tokens[idx].attrSet('target', '_blank');

	return defaultRender(tokens, idx, options, env, self);
};

console.log(md.render("[link](https://www.google.com)"));

type PageProps = Promise<{ slug: string }>;

type BlogEntry = IndexEntry & {
	blocks: BlockNode[];
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

	const {
		handleSubmit,
		register,
		control,
		watch,
		reset,
		formState: { isSubmitting, isSubmitted },
	} = useForm<BlogEntry>({
		defaultValues: async () => {
			const b = await fetch(`/api/readentry/${slug}`);
			const c = await b.json();
			console.log("default values");
			return { ...c.index, blocks: c.content };
		},
		shouldUnregister: false,
	});

	const { fields, remove, insert } = useFieldArray({ name: "blocks", control });

	useEffect(() => {
		(async () => {
			const b = await fetch(`/api/readentry/${slug}`);
			const c = await b.json();
			console.log("reset", { ...c.index, blocks: c.content });
			reset({ ...c.index, blocks: c.content });
		})();
	}, [isSubmitted, slug, reset]);

	const [editingIndex, setEditingIndex] = useState<number>(-1);

	const watchFieldArray = watch("blocks");
	const controlledFields = fields.map((field, index) => {
		return {
			...field,
			...watchFieldArray[index],
		};
	});

	const headerImage = watch("headerImage");

	const { onChange, ...rest } = register('headerImage');

	const uploadHandler = async (e: ChangeEvent<HTMLInputElement>) => {
		console.log('here?');
		const file = e.target.files?.[0];
		if (!file) return;

		const formData = new FormData();
		formData.append('file', file);

		const res = await fetch('/api/upload-header', {
			method: 'POST',
			body: formData,
		});

		const json = await res.json();
		console.log(json, json.message, json.filename);

		if (res.ok && json.filename) {
			onChange(json.filename);
		}
	}


	const onSubmit: SubmitHandler<BlogEntry> = async (data) => {

		console.log({
			content: data.blocks,
			index: {
				title: data.title,
				blurb: data.blurb,
				pinned: data.pinned,
				slug: slug,
				publish: data.publish,
				date: data.date,
				lastModified: data.lastModified
			},
		});
		const result = await fetch("/api/addentry", {
			method: "post",
			body: JSON.stringify({
				content: data.blocks,
				index: {
					title: data.title,
					blurb: data.blurb,
					slug: slug,
					pinned: data.pinned,
					publish: data.publish,
					date: data.date,
					lastModified: data.lastModified
				},
			}),
		});
		console.log(result);
	};

	const titleRef = useRef<HTMLHeadingElement>(null);
	const blurbRef = useRef<HTMLHeadingElement>(null);

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="window-post">
					<div className="titlebar">
						<div>
							<Controller
								control={control}
								name="title"
								render={({ field: { onChange, value } }) => {
									if (titleRef.current && !titleRef.current.textContent)
										titleRef.current.textContent = value;
									return (
										<h1
											contentEditable
											onInput={(e) => onChange(e.currentTarget.textContent)}
											ref={titleRef}
										></h1>
									);
								}}
							/>
							<Controller
								control={control}
								name="blurb"
								render={({ field: { onChange, value } }) => {
									if (blurbRef.current && !blurbRef.current.textContent)
										blurbRef.current.textContent = value;
									return (
										<div
											contentEditable
											onInput={(e) => onChange(e.currentTarget.textContent)}
											ref={blurbRef}
										></div>
									);
								}}
							/>
						</div>
						<div>
							<input type="checkbox" {...register("publish")} />{" "}
							<span> Publish? </span>
							<input type="checkbox" {...register("pinned")} />{" "}
							<span> Pin? </span>
						</div>
						<div>
							<button type="submit" className="titlebutton">
								{isSubmitting ? "Saving..." : isSubmitted ? "Saved" : "Save"}
							</button>
						</div>
					</div>
					<div className='header-image'>
						<input type="hidden" {...rest} name="headerImage" />

						{
							headerImage ? <Image
								src={`/${headerImage}`}
								width={1200}
								height={400}
								alt="header image"
							/> : <>
							</>
						}

						<input type="file" accept="image/*" onChange={uploadHandler} {...rest} />
					</div>
					<div className="prosebox">
						{controlledFields.map((field, index) => {
							return (
								<Controller
									key={field.id}
									name={`blocks.${index}`}
									control={control}
									render={({ field: formField }) => (
										<NewBlockDisplay
											startEdit={() => setEditingIndex(index)}
											endEdit={() => setEditingIndex(-1)}
											id={formField.value.id}
											isEditing={editingIndex == index}
											rawText={formField.value.rawText}
											renderText={formField.value.renderText}
											actualEdit={(content: string) => {
												formField.onChange({
													...formField.value,
													rawText: content,
													renderText: md.render(content),
												});
											}}
											handleEnter={(e) => {
												if (!e.shiftKey && e.key === "Enter") {
													const caretPos = e.currentTarget.selectionStart;
													const paraStr = e.currentTarget.value;

													const [pre, post] = [
														paraStr.slice(0, caretPos),
														paraStr.slice(caretPos),
													];

													console.log({ pre, post });

													const newBlock: BlockNode = {
														id: `id_${(Math.random() * 1000000).toString()}`,
														rawText: post,
														renderText: md.render(post),
													};

													setEditingIndex(index + 1);
													formField.onChange({
														...formField,
														rawText: pre,
														renderText: md.render(pre),
													});
													insert(index + 1, newBlock);
												}
											}}
											remove={() => remove(index)}
										/>
									)}
								/>
							);
						})}
					</div>
					<div className="blog-cymk">
						<div className="c box"></div>
						<div className="m box"></div>
						<div className="y box"></div>
						<div className="k box"></div>
					</div>
				</div>
			</form>
		</>
	);
}

interface NewBlockDisplayProps {
	id: string;
	isEditing: boolean;
	rawText: string;
	renderText: string;
	startEdit: () => void;
	endEdit: () => void;
	actualEdit: (content: string) => void;
	remove: () => void;
	handleEnter: KeyboardEventHandler<HTMLTextAreaElement>;
}

const NewBlockDisplay: React.FC<NewBlockDisplayProps> = ({
	id,
	isEditing,
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
		if (isEditing) {
			textareaRef.current?.focus();
		}
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, [isEditing, rawText]);

	const handleClick: MouseEventHandler<HTMLDivElement> = () => {
		if (!isEditing) {
			startEdit();
		}
	};

	return (
		<div style={{ width: "100%" }}>
			{isEditing ? (
				<div
					style={{
						position: "relative",
						width: "100%",
					}}
					onBlur={endEdit}
				>
					<textarea
						ref={textareaRef}
						className="gap prose"
						value={rawText}
						key={id}
						onKeyDown={handleEnter}
						onChange={(e) => actualEdit(e.currentTarget.value)}
					/>
					<div className="ctrlpanel">
						<button className="controls" onClick={remove}>
							<RiDeleteBin6Fill />
						</button>
					</div>
				</div>
			) : (
				<div
					className="gap"
					onClick={handleClick}
					dangerouslySetInnerHTML={{
						__html: renderText.length == 0 ? "Start typing..." : renderText,
					}}
				/>
			)}
		</div>
	);
};
