import { scrapeBooks } from "../../utils/scrape";

export async function GET() {
	const url = "https://www.goodreads.com/review/list/8159704?shelf=read&view=table";

	const books = await scrapeBooks(url);

	return Response.json({
		count: books.length,
		books,
	});
}
