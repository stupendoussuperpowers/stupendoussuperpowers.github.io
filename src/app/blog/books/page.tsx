import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { myCustomFont } from '@/ui/font';
import path from 'path';
import fs from 'fs';


const getStaticProps = async () => {
	const filePath = path.join(process.cwd(), 'assets', 'books.json');

	const jsonData = fs.readFileSync(filePath, 'utf-8');
	const data = JSON.parse(jsonData);

	return groupBooks(data);
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

function groupBooks(books: Book[]) {
	const grouped: Record<number, Record<number, Book[]>> = {};

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
	const _books = await getStaticProps(); // assume returns { books: Book[] }

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
						{ length: Math.max(...years) - Math.min(...years) },
						(_, i) => Math.max(...years) - i
					).map((year) => {
						console.log(year);
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
										{monthBooks ? monthBooks.map((b) => {
											console.log({ b }); return (<>
												<div key={b.title}>
													<Link target="_blank" href={b.reviewLink}>{b.title}</Link> {stars(b.rating)}
												</div >
												<div style={{ margin: '0px', padding: '0px' }}>by <i>{b.author}</i></div>
											</>);
										}) : ""}
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

