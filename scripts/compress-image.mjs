import sharp from "sharp";
import path from "path";

// Max dimension for photos/diagrams shown at typical blog/card widths.
// Header images and inline post images never need to be wider than this.
const MAX_DIMENSION = 1600;

const resizeOpts = {
  width: MAX_DIMENSION,
  height: MAX_DIMENSION,
  fit: "inside",
  withoutEnlargement: true,
};

/**
 * Re-encodes an image buffer in place (same format), resized to fit within
 * MAX_DIMENSION and recompressed. Returns the original buffer untouched if
 * the compressed version isn't actually smaller.
 */
export async function compressImage(buffer, filename) {
  const ext = path.extname(filename).toLowerCase();
  let pipeline = sharp(buffer, {
    animated: true,
    limitInputPixels: false,
  }).resize(resizeOpts);

  switch (ext) {
    case ".jpg":
    case ".jpeg":
      pipeline = pipeline.jpeg({ quality: 75, mozjpeg: true });
      break;
    case ".png":
      pipeline = pipeline.png({ quality: 80, palette: true });
      break;
    case ".gif":
      pipeline = pipeline.gif();
      break;
    case ".webp":
      pipeline = pipeline.webp({ quality: 75 });
      break;
    default:
      return buffer;
  }

  const compressed = await pipeline.toBuffer();
  return compressed.length < buffer.length ? compressed : buffer;
}
