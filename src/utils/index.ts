import fs from 'fs';
import path from 'path';

export const Ok = <T>(value: T): Ok<T> => ({ ok: true, value });
export const Err = <E>(error: E): Err<E> => ({ ok: false, error });

const JS_DATE_WITH_GMT_OFFSET = /\bGMT([+-]\d{4})\b/;

const pad2 = (value: number) => value.toString().padStart(2, '0');

const getTimezoneLabel = (dateString: string): string => {
	const offsetMatch = dateString.match(JS_DATE_WITH_GMT_OFFSET);
	if (!offsetMatch) return '';

	const [, offset] = offsetMatch;
	if (offset === '-0400' || offset === '-0500') return 'ET';

	return `${offset.slice(0, 3)}:${offset.slice(3)}`;
}

export const formatBlogTimestamp = (dateString: string): string => {
	if (!JS_DATE_WITH_GMT_OFFSET.test(dateString)) return dateString;

	const date = new Date(dateString);
	if (Number.isNaN(date.getTime())) return dateString;

	const timezone = getTimezoneLabel(dateString);
	const formatted = [
		date.getFullYear(),
		pad2(date.getMonth() + 1),
		pad2(date.getDate()),
	].join('-');

	return `${formatted} ${pad2(date.getHours())}:${pad2(date.getMinutes())}${timezone ? ` ${timezone}` : ''}`;
}

/*
 * Structure of the DB:
 * Index: stores slug, date, blurb and title
 *
 * ReadIndex()
 * - Load filedb
 * - Iterate over entries
 * - Return entries
 * 
 * WriteIndex(slug, ...index)
 * - Load filedb
 * - Find entry of slug
 * - Update slug with rest of the index.
 *
 * ReadPost(slug)
 * - Load filedb
 * - find slug 
 * - return PostEntry
 *
 * AddOrUpdatePost(slug, content)
 * - load filedb
 * - if slug exists, update existing file and index
 * - if slug doesnt exist, create new entry, new file
 *
 * DeletePost()
 * - load filedb
 * - find slug, delete entry, delete file.
 *
 * */
export const randomUUID = () => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		const r = Math.random() * 16 | 0;
		const v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

export const ReadIndex = async (published?: boolean | null): Promise<IndexEntry[]> => {
	const fileData = await fs.promises.readFile(path.join(process.cwd(), '/src/posts/indexdb.json'), 'utf-8');
	const indexJson = await JSON.parse(fileData);

	if (published) {
		return indexJson.filter((entry: IndexEntry) => entry.publish)
			.sort((a: IndexEntry, b: IndexEntry) => (new Date(b.date).getTime()) - (new Date(a.date).getTime()));
	}

	return indexJson.map((entry: IndexEntry) => entry)
		.sort((a: IndexEntry, b: IndexEntry) => (new Date(b.date).getTime()) - (new Date(a.date).getTime()));
}

export const WriteIndex = async (index: IndexEntry[]): Promise<boolean> => {
	await fs.promises.writeFile(path.join(process.cwd(), '/src/posts/indexdb.json'), `${JSON.stringify(index, null, 2)}\n`);
	return true;
}

export const AddEntry = async (index: IndexEntry, content: BlockNode[]): Promise<boolean> => {
	const indexJson = await ReadIndex();

	// Add current timestamp
	const updatedIndex = { ...index, lastModified: (new Date()).toString() };
	console.log("Last Modified: ", new Date(), (new Date()).toString());

	// Write to path
	const entryPath = path.join(process.cwd(), `/src/posts/${index.slug}`);
	await fs.promises.writeFile(entryPath, JSON.stringify(content));

	// Update or add index entry.
	const idx = indexJson.findIndex(x => x.slug == index.slug);
	if (idx == -1) indexJson.push(updatedIndex);
	else indexJson[idx] = updatedIndex;

	await WriteIndex(indexJson);

	return true;
}

// Read entry
export const ReadEntry = async (slug: string): Promise<Result<PostEntry, boolean>> => {
	const filePath = path.join(process.cwd(), `/src/posts/${slug}`);
	const fileData = await fs.promises.readFile(filePath, 'utf-8');

	const entryJson = JSON.parse(fileData);

	const indexJson = await ReadIndex();
	const indexEntry = indexJson.find(x => x.slug == slug);

	if (!indexEntry) return Err<boolean>(false);

	return Ok<PostEntry>({
		index: indexEntry,
		content: entryJson
	});
}
