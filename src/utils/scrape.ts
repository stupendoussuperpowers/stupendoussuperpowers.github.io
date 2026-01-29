import * as cheerio from "cheerio";
import fs from "fs/promises";
import path from "path";

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

export async function scrapeBooks(url: string) {
	const res = await fetch(url, {
		headers: {
			"User-Agent": "Mozilla/5.0",
			"Accept-Language": "en-US,en;q=0.9",
		},
	});

	if (!res.ok) {
		throw new Error(`Failed to fetch: ${res.status}`);
	}

	const filePath = path.join(process.cwd(), "assets", "Books.html");
	const html = await fs.readFile(filePath, "utf8");
	// const html = await res.text();
	const $ = cheerio.load(html);

	const books: Book[] = [];

	$("#books tbody tr").each((_, row) => {
		const title = $(row).find("td.title a").first().text().trim();
		const author = $(row).find("td.author a").first().text().trim();

		if (!title) return;

		const ratingText = $(row).find("td.rating .value .stars").attr("data-rating") ?? "0";

		const dateRead = $(row).find("td.date_read .date_read_value").text();

		const reviewLink = $(row).find("td.actions .value .viewLinkWrapper a").attr("href");
		console.log({ reviewLink });

		books.push({
			title,
			author,
			rating: parseInt(ratingText) ?? 0,
			dateRead,
			reviewLink: `https://goodreads.com/${reviewLink}`
		});
	});

	return groupBooks(books);
}

