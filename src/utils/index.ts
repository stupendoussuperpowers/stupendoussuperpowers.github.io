import fs from 'fs';
import path from 'path';

const Ok = <T>(value: T): Ok<T> => ({ ok: true, value });
const Err = <E>(error: E): Err<E> => ({ ok: false, error });




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


export const ReadIndex = async (): Promise<IndexEntry[]> => {
	const fileData = await fs.promises.readFile(path.join(process.cwd(), '/src/posts/indexdb.json'), 'utf-8');
	const indexJson = await JSON.parse(fileData);

	return indexJson.map((entry: IndexEntry) => entry);
}


export const AddEntry = async (index: IndexEntry, content: BlockNode[]): Promise<boolean> => {
	const indexJson = await ReadIndex();

	// Write to path
	const entryPath = path.join(process.cwd(), `/src/posts/${index.slug}`);
	await fs.promises.writeFile(entryPath, JSON.stringify(content));

	// Update or add index entry. 
	const idx = indexJson.findIndex(x => x.slug == index.slug);

	if (idx != -1) indexJson.push(index);
	else indexJson[idx] = index;

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

