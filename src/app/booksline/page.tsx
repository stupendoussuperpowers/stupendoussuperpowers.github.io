import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { scrapeBooks } from '@/utils/scrape';

type BookRecord = Record<number, Record<number, Book[]>>;

function mergeBooks(a: BookRecord, b: BookRecord): BookRecord {
	const out = structuredClone(a);

	for (const [yearStr, months] of Object.entries(b)) {
		const year = Number(yearStr);
		out[year] ??= {};

		for (const [monthStr, books] of Object.entries(months)) {
			const month = Number(monthStr);
			out[year][month] ??= [];
			out[year][month].push(...books);
		}
	}

	return out;
}


const getStaticProps = async () => {
	const url = "https://www.goodreads.com/review/list/8159704-sanchit-sahay";
	const books: Record<number, Record<number, Book[]>> = await scrapeBooks(url);

	const url_p2 = "https://www.goodreads.com/review/list/8159704?order=d&page=2&shelf=read&sort=date_read";

	const books2 = await scrapeBooks(url_p2);

	return mergeBooks(books, books2);
}

export async function generateMetadata(
): Promise<Metadata> {
	return {
		title: "Books / Sanchit Sahay"
	}
}

const stars = (rating: number | undefined) => {
	if (!rating) return <></>;
	return <>
		{Array(rating + 1).join('* ')}
		<span style={{ color: '#aeaeae' }}>
			{Array(6 - rating).join('* ')}
		</span>
	</>;
}

const getMonth = (index: number) => {
	return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index];
}

export default async function Blog() {
	const _books = await getStaticProps(); // assume returns { books: Book[] }

	return (
		<div>
			<h1>Book Reviews!</h1>
			<Link target="_blank" href="https://www.goodreads.com/review/list/8159704?shelf=read">
				Complete list on Goodreads
			</Link>
			<table style={{ width: "100%", border: "0px", marginTop: "20px" }}>
				<tbody>
					{/* Work out a better way to do this... Basically, sort by reverse Year + Month, skip empty months*/}
					{Array.from({ length: Object.keys(_books).length }, (_, i) => new Date().getFullYear() - i).map((year) => {
						const months = Array.from({ length: 12 }, (_, i) => i);
						return months.toReversed().map((month, idx) => {
							const monthBooks = _books[year]?.[month];
							return (
								<tr key={`${year}-${month}`}>
									<td style={{ border: "0px", fontWeight: "bold" }}>{idx === 0 ? year : ""}</td>
									<td style={{ border: "0px" }}>
										{monthBooks ? getMonth(month) : ""}
									</td>
									<td style={{ border: "0px" }}>
										{monthBooks ? monthBooks.map((b) => <>
											<div key={b.title}>
												<Link target="_blank" href={b.reviewLink}>{b.title}</Link> {stars(b.rating)}
											</div >
											<div style={{ margin: '0px', padding: '0px' }}>by <i>{b.author}</i></div>
										</>) : ""}
									</td>
								</tr>
							);
						});
					})}
				</tbody>
			</table >
		</div >
	);
}

