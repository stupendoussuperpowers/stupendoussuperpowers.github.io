declare global {
  type BlockNode = {
    rawText: string,
    renderText: string,
    isEditing: boolean,
    id: string,
  }

  type IndexEntry = {
    slug: string,
    date: string,
    title: string,
    blurb: string
  }

  type PostEntry = {
    index: IndexEntry,
    content: BlockNode[]
  }

  type Ok<T> = { ok: true, value: T };
  type Err<T> = { ok: false, error: T };
  type Result<T, E> = Ok<T> | Err<E>;

  type ProjectData = {
    title: string,
    content: string,
    slug: string,
    readme: string,
    languages: string,
  };

}

export { };


