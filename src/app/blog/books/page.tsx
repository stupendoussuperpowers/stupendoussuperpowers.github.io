import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { myCustomFont } from "@/ui/font";
import path from "path";
import fs from "fs";
import "./page.css";

type BookAnnotation = {
  label: string;
  tone: "month-pick" | "recommendation" | "place";
  value?: string;
};

type GroupedBooks = Record<number, Record<number, Book[]>>;

const getStaticProps = async () => {
  const filePath = path.join(process.cwd(), "assets", "books.json");
  const books = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Book[];

  return {
    groupedBooks: groupBooks(books),
    bookStats: getBookStats(books),
  };
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "(Book) Stack Trace / Sanchit Sahay",
  };
}

const stars = (rating: number | undefined) => {
  if (!rating) return <></>;
  return (
    <>
      {" "}
      <span
        style={{
          display: "inline-block",
          whiteSpace: "nowrap",
          marginTop: "0px",
        }}
      >
        {Array(rating).fill("*").join(" ")}
        <span style={{ color: "#aeaeae" }}>
          {rating < 5
            ? ` ${Array(5 - rating)
                .fill("*")
                .join(" ")}`
            : ""}
        </span>
      </span>
    </>
  );
};

const getMonth = (index: number) => {
  return [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "",
  ][index];
};

function getYearMonth(dateStr: string) {
  const date = new Date(dateStr);

  return {
    year: date.getFullYear(),
    month: date.getMonth(),
  };
}

function groupBooks(books: Book[]) {
  const grouped: GroupedBooks = {};

  for (const book of books) {
    const { year, month } = getYearMonth(book.dateRead);

    if (!grouped[year]) grouped[year] = {};
    if (!grouped[year][month]) grouped[year][month] = [];

    grouped[year][month].push(book);
  }

  return grouped;
}

function getBookStats(books: Book[]) {
  const datedBooks = books.map((book) => ({
    book,
    ym: getYearMonth(book.dateRead),
  }));
  const latest = datedBooks.toSorted(
    (a, b) =>
      b.ym.year - a.ym.year ||
      b.ym.month - a.ym.month ||
      Number(b.book.rating ?? 0) - Number(a.book.rating ?? 0),
  )[0]!;
  const ratings = books
    .map((book) => book.rating)
    .filter((rating): rating is number => typeof rating === "number");
  const countryCounts = new Map<string, number>();
  const countryCodes = new Set<string>();

  for (const book of books) {
    const countries = book.countryOfOrigin
      ?.split(",")
      .map((country) => country.trim())
      .filter(Boolean);

    for (const country of countries ?? []) {
      countryCounts.set(country, (countryCounts.get(country) ?? 0) + 1);
    }

    for (const code of getCountryCodes(book)) {
      countryCodes.add(code);
    }
  }

  const latestYearBooks = datedBooks
    .filter(({ ym }) => ym.year === latest.ym.year)
    .map(({ book }) => book);
  const latestYearRatings = latestYearBooks
    .map((book) => book.rating)
    .filter((rating): rating is number => typeof rating === "number");

  return {
    currentYear: latest.ym.year,
    currentYearCount: latestYearBooks.length,
    currentYearAverage: latestYearRatings.length
      ? (
          latestYearRatings.reduce((sum, rating) => sum + rating, 0) /
          latestYearRatings.length
        ).toFixed(1)
      : "n/a",
    averageRating: ratings.length
      ? (
          ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        ).toFixed(1)
      : "n/a",
    countryCount: countryCounts.size,
    countryFlags: Array.from(countryCodes).map(countryCodeToFlag),
  };
}

const bookKey = (book: Book) =>
  book.reviewLink || `${book.title}-${book.author}-${book.dateRead}`;

const getCountryCodes = (book: Book) =>
  book.isoCode
    ?.split(",")
    .map((code) => code.trim().toUpperCase())
    .filter(Boolean) ?? [];

const countryCodeToFlag = (code: string) => ({
  code,
  flag: Array.from(code)
    .map((letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)))
    .join(""),
  label: new Intl.DisplayNames(["en"], { type: "region" }).of(code),
});

function addAnnotation(
  annotations: Map<string, BookAnnotation[]>,
  book: Book,
  annotation: BookAnnotation,
) {
  const key = bookKey(book);
  annotations.set(key, [...(annotations.get(key) ?? []), annotation]);
}

function getBookHighlights(groupedBooks: GroupedBooks) {
  const annotations = new Map<string, BookAnnotation[]>();
  const yearWinners = new Map<string, number>();
  const years: number[] = Object.keys(groupedBooks)
    .map(Number)
    .toSorted((a, b) => b - a);

  for (const year of years) {
    for (let month = 11; month >= 0; month--) {
      const monthBooks: Book[] = groupedBooks[year]?.[month] ?? [];

      for (const book of monthBooks) {
        if (book.botm) {
          addAnnotation(annotations, book, {
            label: `BOTM / ${getMonth(month)} ${year}`,
            tone: "month-pick",
          });
        }

        if (book.boty) {
          yearWinners.set(bookKey(book), year);
        }

        if (book.recList) {
          addAnnotation(annotations, book, {
            label: "rec list",
            tone: "recommendation",
          });
        }
      }
    }
  }

  const seenPlaces = new Set<string>();
  for (const year of years.toReversed()) {
    for (let month = 0; month < 12; month++) {
      const monthBooks: Book[] = groupedBooks[year]?.[month] ?? [];

      for (const book of monthBooks) {
        const bookCountries =
          book.countryOfOrigin
            ?.split(",")
            .map((country) => country.trim())
            .filter(Boolean) ?? [];

        for (const place of bookCountries) {
          if (seenPlaces.has(place)) continue;
          seenPlaces.add(place);
          addAnnotation(annotations, book, {
            label: "+1 Country",
            tone: "place",
            value: place,
          });
        }
      }
    }
  }

  return { annotations, yearWinners };
}

function BookAnnotations({ annotations }: { annotations: BookAnnotation[] }) {
  const listNotes = annotations.filter(
    (annotation) => annotation.tone !== "place",
  );
  const placeNotes = annotations.filter(
    (annotation) => annotation.tone === "place",
  );

  return (
    <div className="book-annotations">
      <div className="book-note-row">
        {listNotes.map((annotation) => (
          <span
            className={`book-note book-note-${annotation.tone}`}
            key={`${annotation.label}-${annotation.value ?? ""}`}
          >
            <span>{annotation.label}</span>
            {annotation.value && (
              <span className="book-note-value">{annotation.value}</span>
            )}
          </span>
        ))}
      </div>
      <div className="book-note-row book-note-row-place">
        {placeNotes.map((annotation) => (
          <span
            className={`book-note book-note-${annotation.tone}`}
            key={`${annotation.label}-${annotation.value ?? ""}`}
          >
            <span>{annotation.label}</span>
            {annotation.value && (
              <span className="book-note-value">{annotation.value}</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

function BookTimelineEntry({
  book,
  annotations,
  yearWinnerYear,
}: {
  book: Book;
  annotations: BookAnnotation[];
  yearWinnerYear?: number;
}) {
  const isYearWinner = yearWinnerYear !== undefined;
  const isInterimWinner = yearWinnerYear === new Date().getFullYear();

  return (
    <div className={isYearWinner ? "book-entry book-entry-boty" : "book-entry"}>
      <div className="book-details">
        <div>
          {book.reviewLink ? (
            <Link target="_blank" href={book.reviewLink}>
              {book.title}
            </Link>
          ) : (
            <span style={{ fontWeight: "bold" }}>{book.title}</span>
          )}
          {stars(book.rating)}
        </div>
        <div className="book-author">
          by <i>{book.author}</i>
        </div>
      </div>
      <div className="book-entry-meta">
        {isYearWinner && (
          <div className="book-boty-label">
            BOTY{isInterimWinner ? " (Interim)" : ""}
          </div>
        )}
        <BookAnnotations annotations={annotations} />
      </div>
    </div>
  );
}

function TimelineMonthRow({
  bookHighlights,
  groupedBooks,
  month,
  year,
}: {
  bookHighlights: ReturnType<typeof getBookHighlights>;
  groupedBooks: GroupedBooks;
  month: number;
  year: number;
}) {
  const monthBooks = groupedBooks[year]?.[month];
  const isYearTick = month === 12 && year != 2026;

  return (
    <tr
      className={monthBooks || isYearTick ? undefined : "empty-month"}
      key={`${year}-${month}`}
    >
      <td className="timeline-year-label">{isYearTick ? year + 1 : ""}</td>
      <td
        className={
          isYearTick
            ? "timeline-marker timeline-marker-year"
            : "timeline-marker"
        }
        aria-hidden="true"
      >
        {(monthBooks || isYearTick) && <span />}
      </td>
      <td className="timeline-month-label">
        {monthBooks ? getMonth(month) : ""}
      </td>
      <td className="timeline-books-cell">
        {monthBooks?.map((book) => (
          <BookTimelineEntry
            annotations={bookHighlights.annotations.get(bookKey(book)) ?? []}
            book={book}
            key={bookKey(book)}
            yearWinnerYear={bookHighlights.yearWinners.get(bookKey(book))}
          />
        ))}
      </td>
    </tr>
  );
}

function BooksTimeline({
  bookHighlights,
  groupedBooks,
}: {
  bookHighlights: ReturnType<typeof getBookHighlights>;
  groupedBooks: GroupedBooks;
}) {
  const years = Object.keys(groupedBooks).map(Number);

  return (
    <table className="books-timeline">
      <tbody>
        {Array.from(
          { length: Math.max(...years) - Math.min(...years) + 1 },
          (_, i) => Math.max(...years) - i,
        ).map((year) =>
          Array.from({ length: 13 }, (_, i) => 12 - i).map((month) => (
            <TimelineMonthRow
              bookHighlights={bookHighlights}
              groupedBooks={groupedBooks}
              key={`${year}-${month}`}
              month={month}
              year={year}
            />
          )),
        )}
      </tbody>
    </table>
  );
}

function FlagList({
  flags,
}: {
  flags: ReturnType<typeof countryCodeToFlag>[];
}) {
  return (
    <span className="books-country-flags">
      {flags.map((country) => (
        <span
          aria-label={`Flag of ${country.label}`}
          key={country.code}
          role="img"
          title={country.label}
        >
          {country.flag}
        </span>
      ))}
    </span>
  );
}

export default async function Blog() {
  const { groupedBooks: _books, bookStats } = await getStaticProps(); // assume returns { books: Book[] }
  const bookHighlights = getBookHighlights(_books);
  const flagMidpoint = Math.ceil(bookStats.countryFlags.length / 2);
  const firstCountryFlags = bookStats.countryFlags.slice(0, flagMidpoint);
  const secondCountryFlags = bookStats.countryFlags.slice(flagMidpoint);

  return (
    <div style={{ position: "relative" }}>
      <div>
        <div className="title">
          <div className={myCustomFont.className} style={{ fontSize: "40px" }}>
            (Book) Stack Trace
          </div>
          <Link
            target="_blank"
            href="https://www.goodreads.com/review/list/8159704?shelf=read"
            style={{ margin: "0px" }}
          >
            View on Goodreads
          </Link>
        </div>
        <div className="books-stats-line">
          <dl className="books-stats-summary">
            <div>
              {bookStats.currentYear} Books <b>{bookStats.currentYearCount}</b>
            </div>
            <div>
              {bookStats.currentYear} Avg{" "}
              <b>{bookStats.currentYearAverage}/5</b>
            </div>
            <div>
              Overall <b>{bookStats.averageRating}/5</b>
            </div>
          </dl>
          <div className="books-country-stats">
            <FlagList flags={firstCountryFlags} />
            <span>
              Countries <strong>{bookStats.countryCount}</strong>
            </span>
            <FlagList flags={secondCountryFlags} />
          </div>
        </div>
        <div className="books-layout">
          <BooksTimeline
            bookHighlights={bookHighlights}
            groupedBooks={_books}
          />
        </div>
      </div>
    </div>
  );
}
