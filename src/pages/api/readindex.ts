import type { NextApiRequest, NextApiResponse } from "next";
import { ReadIndex } from "../../utils";

type Message = {
	posts: IndexEntry[]
};

export default async function POST(req: NextApiRequest, res: NextApiResponse<Message>) {
	const index = await ReadIndex();
	return res.status(200).json({ posts: index });
}
