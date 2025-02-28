import type { NextApiRequest, NextApiResponse } from "next";
import { PostEntry, ReadEntry } from "@/utils";

export default async function POST(req: NextApiRequest, res: NextApiResponse<PostEntry | boolean>) {
	const { slug } = req.query;

	const result = await ReadEntry(slug as string);

	if (result.ok) {
		return res.status(200).json(result.value);
	} else {
		return res.status(500).json(result.error);
	}

}
