import Link from "next/link";
import React from "react";

const AUTHOR_NAME = "Sanchit Sahay";

const renderAuthors = (authors: string) => {
  const parts = authors.split(",").map((a) => a.trim());

  return parts.map((author, idx) => (
    <React.Fragment key={author}>
      {author === AUTHOR_NAME || author === `and ${AUTHOR_NAME}` ? (
        <b>{author}</b>
      ) : (
        author
      )}
      {idx < parts.length - 1 ? ", " : ""}
    </React.Fragment>
  ));
};

export const Publication: React.FC<PublicationData> = ({
  authors,
  year,
  title,
  venue,
  date,
  location,
  pages,
  doi,
}) => {
  const link = `https://doi.org/${doi}`;

  return (
    <div style={{ marginBottom: "28px" }}>
      <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
        &quot;{title}&quot;
      </div>
      <span>{renderAuthors(authors)}</span>
      <span style={{ color: "var(--text-color-alt)", marginLeft: "5px" }}>
        <i>{venue}</i>, {date}, {location}
      </span>
      <div
        style={{
          color: "var(--text-color-alt)",
          fontSize: "small",
          marginTop: "0px",
        }}
      >
        ACM, New York, NY, USA &middot; {pages} Pages &middot; {year} &middot;{" "}
        <Link href={link}>{link}</Link>
      </div>
    </div>
  );
};
