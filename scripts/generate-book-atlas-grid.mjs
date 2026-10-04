// One-off build script: rasterizes a low-res world land/sea mask from
// scripts/data/countries.geo.json and cross-references assets/books.json
// to produce assets/book-atlas-grid.json (a pixel grid + per-country stats)
// consumed statically by src/app/blog/book-atlas. Re-run manually after
// editing books.json:
//   node scripts/generate-book-atlas-grid.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const geo = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "countries.geo.json"), "utf-8"),
);
const books = JSON.parse(
  fs.readFileSync(path.join(root, "assets", "books.json"), "utf-8"),
);

// books.json country names -> countries.geo.json feature names.
// Cape Verde is too small to survive this low-res dataset's simplification,
// so it's placed by hand below instead of being polygon-matched.
const NAME_ALIASES = {
  Nigeria: "Nigeria",
  "Spain (Basque)": "Spain",
  "United Kingdom": "United Kingdom",
  "United States": "United States of America",
  Albania: "Albania",
  Cameroon: "Cameroon",
  Denmark: "Denmark",
  "Czech Republic": "Czech Republic",
  Italy: "Italy",
  Canada: "Canada",
  Poland: "Poland",
  France: "France",
  India: "India",
  Chile: "Chile",
  Ireland: "Ireland",
  Iran: "Iran",
};

function pointInRing(x, y, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function pointInPolygon(x, y, polygon) {
  // polygon: [outerRing, ...holeRings]
  if (!pointInRing(x, y, polygon[0])) return false;
  for (let h = 1; h < polygon.length; h++) {
    if (pointInRing(x, y, polygon[h])) return false;
  }
  return true;
}

function pointInGeometry(x, y, geometry) {
  if (geometry.type === "Polygon") {
    return pointInPolygon(x, y, geometry.coordinates);
  }
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates.some((poly) => pointInPolygon(x, y, poly));
  }
  return false;
}

function bboxOf(geometry) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  const rings =
    geometry.type === "Polygon"
      ? geometry.coordinates
      : geometry.coordinates.flat();
  for (const ring of rings) {
    for (const [x, y] of ring) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  return { minX, minY, maxX, maxY };
}

const features = geo.features.map((f) => ({
  name: f.properties.name,
  geometry: f.geometry,
  bbox: bboxOf(f.geometry),
}));

// --- Aggregate books.json by country -------------------------------------

function parseDateRead(raw) {
  const withDay = Date.parse(raw);
  if (!Number.isNaN(withDay)) return withDay;
  const withMonth = Date.parse(`1 ${raw}`);
  if (!Number.isNaN(withMonth)) return withMonth;
  return Date.parse(`Jan 1, ${raw}`);
}

const countryStats = new Map(); // iso -> { name, count, books: [], firstRead }

for (const book of books) {
  const isoCodes = (book.isoCode ?? "")
    .split(",")
    .map((c) => c.trim().toUpperCase())
    .filter(Boolean);
  const names = (book.countryOfOrigin ?? "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  const readTime = parseDateRead(book.dateRead);

  isoCodes.forEach((iso, i) => {
    const name = names[i] ?? names[0] ?? iso;
    const entry = countryStats.get(iso) ?? {
      name,
      count: 0,
      books: [],
      firstRead: Infinity,
    };
    entry.count += 1;
    entry.books.push({
      title: book.title,
      author: book.author,
      reviewLink: book.reviewLink,
    });
    if (!Number.isNaN(readTime)) {
      entry.firstRead = Math.min(entry.firstRead, readTime);
    }
    countryStats.set(iso, entry);
  });
}

// rank by how many books came from each country, most-read first
const rankOrder = [...countryStats.keys()].sort((a, b) => {
  const byCount = countryStats.get(b).count - countryStats.get(a).count;
  if (byCount !== 0) return byCount;
  return countryStats.get(a).name.localeCompare(countryStats.get(b).name);
});
rankOrder.forEach((iso, i) => {
  countryStats.get(iso).rank = i + 1;
});

// --- Per-country pixel icons -----------------------------------------------
// Each visited country gets its own small standalone raster (not placed on a
// shared world canvas), sized to its own bounding box. That way a tiny island
// nation and a continent-spanning one can each read clearly as a shape,
// without fighting over shared screen space.

const ICON_MAX_DIM = 11;
const ICON_MIN_DIM = 3;

function largestRing(geometry) {
  // ignore exclaves (e.g. Alaska/Hawaii tacked onto the US, Corsica onto
  // France) by keeping only the polygon with the most vertices, so the icon
  // traces the country's main landmass instead of a distorted bbox spanning
  // both.
  const polygons =
    geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  return polygons.reduce((best, poly) => {
    const size = poly.reduce((sum, ring) => sum + ring.length, 0);
    return size > best.size ? { poly, size } : best;
  }, { poly: polygons[0], size: -1 }).poly;
}

function rasterizeIcon(geometry) {
  const mainPolygon = largestRing(geometry);
  const mainGeometry = { type: "Polygon", coordinates: mainPolygon };
  const { minX, minY, maxX, maxY } = bboxOf(mainGeometry);
  const lonSpan = maxX - minX || 1;
  const latSpan = maxY - minY || 1;

  let cols, rows;
  if (lonSpan >= latSpan) {
    cols = ICON_MAX_DIM;
    rows = Math.max(ICON_MIN_DIM, Math.round(ICON_MAX_DIM * (latSpan / lonSpan)));
  } else {
    rows = ICON_MAX_DIM;
    cols = Math.max(ICON_MIN_DIM, Math.round(ICON_MAX_DIM * (lonSpan / latSpan)));
  }

  const mask = [];
  for (let r = 0; r < rows; r++) {
    const lat = maxY - ((r + 0.5) / rows) * latSpan;
    const rowMask = [];
    for (let c = 0; c < cols; c++) {
      const lon = minX + ((c + 0.5) / cols) * lonSpan;
      rowMask.push(pointInGeometry(lon, lat, mainGeometry));
    }
    mask.push(rowMask);
  }
  return { cols, rows, mask };
}

// a plus-shaped placeholder for countries too small to survive this
// low-res dataset's simplification (currently just Cape Verde)
function placeholderIcon() {
  const dim = 5;
  const mid = Math.floor(dim / 2);
  const mask = Array.from({ length: dim }, (_, r) =>
    Array.from({ length: dim }, (_, c) => r === mid || c === mid),
  );
  return { cols: dim, rows: dim, mask };
}

const featureByGeoName = new Map(features.map((f) => [f.name, f]));

const countries = rankOrder.map((iso) => {
  const stats = countryStats.get(iso);
  const geoName = NAME_ALIASES[stats.name];
  const feature = geoName ? featureByGeoName.get(geoName) : undefined;
  const icon = feature ? rasterizeIcon(feature.geometry) : placeholderIcon();

  return {
    iso,
    name: stats.name,
    count: stats.count,
    books: stats.books,
    rank: stats.rank,
    icon,
  };
});

const output = { countries };

fs.writeFileSync(
  path.join(root, "assets", "book-atlas-grid.json"),
  JSON.stringify(output),
);

console.log(
  `Wrote assets/book-atlas-grid.json (${countries.length} countries).`,
);
