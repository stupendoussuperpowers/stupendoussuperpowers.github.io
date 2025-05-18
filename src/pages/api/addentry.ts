import type { NextApiRequest, NextApiResponse } from "next";
import { AddEntry } from "../../utils";

type Message = {
	success: boolean
};

export default async function POST(req: NextApiRequest, res: NextApiResponse<Message>) {
	if (req.method == 'POST') {
		const { index, content } = JSON.parse(req.body);

		await AddEntry(index, content);
		return res.status(200).json({ success: true });
	}
}
