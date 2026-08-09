import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import { compressImage } from "../../../scripts/compress-image.mjs";

export const config = {
    api: {
        bodyParser: false,
    },
};

type Response = { filename: string } | { error: string };

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Response>
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed." });
    }

    const form = formidable({ maxFiles: 1 });
    const [, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
        return res.status(400).json({ error: "No file uploaded." });
    }

    const filename = path.basename(file.originalFilename || file.newFilename);
    const buffer = await fs.readFile(file.filepath);
    const compressed = await compressImage(buffer, filename);

    await fs.writeFile(path.join(process.cwd(), "public", filename), compressed);
    await fs.unlink(file.filepath);

    return res.status(200).json({ filename });
}
