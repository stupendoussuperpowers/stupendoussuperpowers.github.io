import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
	api: {
		bodyParser: false,
	}
}

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
	return res.status(405).json({ error: 'Method not allowed.' });

