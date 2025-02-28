import type { NextApiRequest, NextApiResponse } from "next";
import { AddEntry } from "@/utils";

type Message = {
	success: boolean
};

export default async function POST(req: NextApiRequest, res: NextApiResponse<Message>) {
	if (req.method == 'POST') {
		const { index, content, draft } = JSON.parse(req.body);

		if (draft) {
			index.slug = 'drafts-' + index.slug;
		}

		await AddEntry(index, content);
		return res.status(200).json({ success: true });
	}
}
