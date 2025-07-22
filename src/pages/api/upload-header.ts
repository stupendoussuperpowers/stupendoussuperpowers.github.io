import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import path from 'path';

export const config = {
	api: {
		bodyParser: false,
	}
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method != 'POST')
		return res.status(405).json({ error: 'Method not allowed.' });

	const form = formidable({
		uploadDir: path.join(process.cwd(), 'public'),
		keepExtensions: true,
		filename: (_name: string) => {
			return `${Date.now()}-${_name}`;
		}
	});

	form.parse(req, async (err, fields, files) => {
		if (err) {
			console.error('Upload error:', err);
			return res.status(500).json({ error: 'File Parsing Error' });
		}

		//	const file = files.file as formidable.File;
		//	console.log(file, Array.isArray(file));

		//	if (!file[0] /*|| Array.isArray(file)*/)
		//			return res.status(400).json({ error: "Invalid File Format" });

		//	const filename = path.basename(file[0].filepath);

		return res.status(200).json({ message: "Upload successful", filename: "filename" })

	});
}
