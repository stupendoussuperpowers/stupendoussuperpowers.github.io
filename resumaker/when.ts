const SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
const FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export type When = {
	/** sortable, e.g. "2025-09" */
	key: string;
	/** "Sept 2025" */
	month: string;
	/** "Sept 2025 – Present" / "Jan 2022 – Aug 2024" */
	span: string;
	/** "2025-Pres" / "2022-2024" — the homepage timeline */
	years: string;
	/** "October 06, 2026" — publication dates */
	long: string;
	open: boolean;
};

// Academic terms sort as the month they start in.
const TERMS: Record<string, [string, string]> = {
	spring: ["01", "Spring"],
	summer: ["05", "Summer"],
	fall: ["09", "Fall"],
};

const month = (v: string) => {
	const [y, m] = v.split("-");
	if (m in TERMS) return `${TERMS[m][1]} ${y}`;
	return m ? `${SHORT[+m - 1]} ${y}` : y;
};

export function when(v?: string): When | null {
	if (!v) return null;

	const [from, to] = v.split("/").map((s) => s.trim());
	const open = v.includes("/") && !to;
	const [y, m, d] = from.split("-");

	return {
		key: m in TERMS ? `${y}-${TERMS[m][0]}` : from,
		month: month(from),
		span: open ? `${month(from)} – Present` : to ? `${month(from)} – ${month(to)}` : month(from),
		years: open ? `${y}-Pres` : `${y}-${to ? to.split("-")[0] : y}`,
		long: d ? `${FULL[+m - 1]} ${d}, ${y}` : month(from),
		open,
	};
}

/** Newest first. Open-ended spans sort above closed ones. */
export const byRecency = (a: { when?: string }, b: { when?: string }) => {
	const [x, y] = [when(a.when), when(b.when)];
	if (!x || !y) return 0;
	if (x.open !== y.open) return x.open ? -1 : 1;
	return y.key.localeCompare(x.key);
};
