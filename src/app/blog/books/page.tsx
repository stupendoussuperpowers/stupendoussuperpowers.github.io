import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { myCustomFont } from '@/ui/font';
import path from 'path';
import fs from 'fs';
import * as cheerio from 'cheerio';

type BookWithCover = Book & {
	coverUrl?: string;
};


const getStaticProps = async () => {
	const filePath = path.join(process.cwd(), 'assets', 'books.json');

	const jsonData = fs.readFileSync(filePath, 'utf-8');
	const data = JSON.parse(jsonData) as Book[];
	const coverMap = getCoverMap();
	const books = data.map((book) => {
		const reviewId = getReviewId(book.reviewLink);

		return {
			...book,
			coverUrl: reviewId ? coverMap.get(reviewId) : undefined,
		};
	});

	return {
		groupedBooks: groupBooks(books),
		coverUrls: books.flatMap((book) => book.coverUrl ? [book.coverUrl] : []),
	};
}

const getReviewId = (reviewLink: string | undefined) => reviewLink?.match(/review\/show\/(\d+)/)?.[1];

const getCoverMap = () => {
	const filePath = path.join(process.cwd(), 'assets', 'Books.html');
	const coverMap = new Map<string, string>();

	if (!fs.existsSync(filePath)) return coverMap;

	const html = fs.readFileSync(filePath, 'utf-8');
	const $ = cheerio.load(html);

	$('img[id^="cover_review_"]').each((_, image) => {
		const id = $(image).attr('id')?.replace('cover_review_', '');
		const src = $(image).attr('src');

		if (id && src) coverMap.set(id, src);
	});

	return coverMap;
};

export async function generateMetadata(
): Promise<Metadata> {
	return {
		title: "Books / Sanchit Sahay"
	}
}

const stars = (rating: number | undefined) => {
	if (!rating) return <></>;
	return <>
		{' '}
		<span style={{ display: 'inline-block', whiteSpace: 'nowrap', marginTop: "0px" }}>
			{Array(rating).fill('*').join(' ')}
			<span style={{ color: '#aeaeae' }}>
				{rating < 5 ? ` ${Array(5 - rating).fill('*').join(' ')}` : ''}
			</span>
		</span>
	</>;
}

const getMonth = (index: number) => {
	return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""][index];
}

function getYearMonth(dateStr: string) {
	if (!dateStr) return null;

	const date = new Date(dateStr);

	return {
		year: date.getFullYear(),
		month: date.getMonth()
	}
}

function groupBooks(books: BookWithCover[]) {
	const grouped: Record<number, Record<number, BookWithCover[]>> = {};

	for (const book of books) {
		if (!book.dateRead) continue;

		const ym = getYearMonth(book.dateRead);
		if (!ym) continue;

		const { year, month } = ym;


		if (!grouped[year]) grouped[year] = {};
		if (!grouped[year][month]) grouped[year][month] = [];

		grouped[year][month].push(book);
	}

	return grouped;
}

export default async function Blog() {
	const { groupedBooks: _books, coverUrls } = await getStaticProps(); // assume returns { books: Book[] }

	/*
	 {
		title: 'Let It Snow',
		author: 'Green, John',
		rating: 0,
		dateRead: 'Jan 2019',
		reviewLink: 'https://goodreads.com//review/show/4506097080',
		year: 2008,
		countryOfOrigin: 'United States',
		isoCode: 'USA'
		}
    */

	const years = Object.keys(_books).map(Number);

	return (
		<div style={{ position: 'relative' }}>
			<div>
				<div className={myCustomFont.className}
					style={{ fontSize: "40px", marginBottom: "20px" }}
				>Book Reviews!</div>
				<Link target="_blank" href="https://www.goodreads.com/review/list/8159704?shelf=read">
					Complete list on Goodreads
				</Link>
				<table style={{ width: "100%", border: "0px", marginTop: "20px" }}>
					<tbody>
						{/* Work out a better way to do this... Basically, sort by reverse Year + Month, skip empty months*/}
						{Array.from(
							{ length: Math.max(...years) - Math.min(...years) + 1 },
							(_, i) => Math.max(...years) - i
						).map((year) => {
							const months = Array.from({ length: 13 }, (_, i) => i);
							return months.toReversed().map((month, idx) => {
								const monthBooks = _books[year]?.[month];
								return (
									<tr key={`${year}-${month}`}>
										<td style={{ border: "0px", fontWeight: "bold" }}>{idx === 0 && year != 2026 ? year + 1 : ""}</td>
										<td style={{ border: "0px" }}>
											{monthBooks ? getMonth(month) : ""}
										</td>
										<td key={`${month}-${idx}`} style={{ border: "0px", marginTop: "10px" }}>
											{monthBooks ? monthBooks.map((b) => (
												<React.Fragment key={b.reviewLink}>
													<div>
														{b.reviewLink ?
															<Link target="_blank" href={b.reviewLink}>{b.title}</Link>
															: <span style={{
																fontWeight: "bold"
															}}>{b.title}</span>}
														{stars(b.rating)}
													</div >
													<div style={{ margin: '0px', padding: '0px' }}>by <i>{b.author}</i></div>
												</React.Fragment>
											)) : ""}
										</td>
									</tr>
								);
							});
						})}
					</tbody>
				</table >
			</div>
		</div >
	);
}
