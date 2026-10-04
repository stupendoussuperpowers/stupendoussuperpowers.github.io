import Link from "next/link";
import React from "react";
import { type Paper, me, when } from "../../resumaker/ledger";

const authorList = (authors: string[] = []) =>
  authors.map((author, idx) => (
    <React.Fragment key={author}>
      {author === "@me" ? <b>{me.name}</b> : author}
      {idx < authors.length - 1 ? ", " : ""}
    </React.Fragment>
  ));

export const Publication: React.FC<{ entry: Paper }> = ({ entry }) => {
  const at = when(entry.when)!;
  const doi = `https://doi.org/${entry.doi}`;

  return (
    <div style={{ marginBottom: "28px" }}>
      <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
        &quot;{entry.title}&quot;{" "}
        {entry.pdf ? (
          <>
            &middot;{" "}
            <Link href={entry.pdf} target="_blank">
              PDF
            </Link>
          </>
        ) : null}
      </div>
      <span>{authorList(entry.authors)}</span>
      <span style={{ color: "var(--text-color-alt)", marginLeft: "5px" }}>
        <i>
          {entry.status === "to-appear" ? "To appear in " : ""}
          {entry.venue}
          {entry.short ? ` (${entry.short})` : ""}
        </i>
        , {at.long}, {entry.where}
      </span>
      <div
        style={{
          color: "var(--text-color-alt)",
          fontSize: "small",
          marginTop: "0px",
        }}
      >
        {entry.publisher} &middot; {entry.pages} Pages &middot;{" "}
        {at.key.slice(0, 4)} &middot;{" "}
        <Link href={doi} target="_blank">
          {doi}
        </Link>
      </div>
    </div>
  );
};
