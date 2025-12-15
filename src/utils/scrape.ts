import * as cheerio from "cheerio";

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

function getStars(blurb: string) {
	const ratingMap: Record<string, number> = {
		"it was amazing": 5,
		"really liked it": 4,
		"liked it": 3,
		"it was ok": 2,
		"did not like": 1,
	};

	return ratingMap[blurb];
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

	const html = await res.text();
	const $ = cheerio.load(html);

	const books: Book[] = [];

	$("#books tbody tr").each((_, row) => {
		const title = $(row).find("td.title a").first().text().trim();
		const author = $(row).find("td.author a").first().text().trim();

		if (!title) return;

		const ratingText = $(row).find("td.rating .staticStars").text();

		const dateRead = $(row).find("td.date_read .date_read_value").text();

		const reviewLink = $(row).find("td.actions a").attr("href");
		console.log(reviewLink);

		books.push({
			title,
			author,
			rating: getStars(ratingText),
			dateRead,
			reviewLink: `https://goodreads.com/${reviewLink}`
		});
	});

	return groupBooks(books);
}

