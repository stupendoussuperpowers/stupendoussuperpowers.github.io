declare global {
	type BlockNode = {
		rawText: string;
		renderText: string;
		id: string;
	};

	type IndexEntry = {
		slug: string;
		date: string;
		lastModified: string;
		title: string;
		publish: boolean;
		blurb: string;
		headerImage: string | null;
		pinned: boolean;
	};

	type PostEntry = {
		index: IndexEntry;
		content: BlockNode[];
	};

	type Ok<T> = { ok: true; value: T };
	type Err<T> = { ok: false; error: T };
	type Result<T, E> = Ok<T> | Err<E>;


	type ProjectData = {
		title: string;
		link: string;
		content: string;
		report: string | null;
		languages?: string | null;
		tag: string;
	}

	type Book = {
		title: string;
		author: string;
		rating?: number | undefined;
		dateRead: string;
		reviewLink: string;
	};
}

export { };
