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
    href?: string;
    entryType?: string;
  };

  type PostEntry = {
    index: IndexEntry;
    content: BlockNode[];
  };

  type Ok<T> = { ok: true; value: T };
  type Err<T> = { ok: false; error: T };
  type Result<T, E> = Ok<T> | Err<E>;

  type Book = {
    title: string;
    author: string;
    rating?: number | undefined;
    dateRead: string;
    reviewLink?: string;
    year?: number | string;
    countryOfOrigin?: string;
    isoCode?: string;
    botm?: boolean;
    boty?: boolean;
    recList?: boolean;
  };
}

export {};
