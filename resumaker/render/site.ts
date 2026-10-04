// What the site's pages ask the ledger for.
import { byRecency, degrees, employment, papers, projects, research, when } from "../ledger";

/** Research cards for /projects, mirroring the resume's Research section. */
export const siteResearch = () => research.map((r) => ({ ...r, role: r.roleTag }));

/** Project cards for /projects, mirroring the resume's Open Source and Course
 * Projects section: any project with a blurb. */
export const siteProjects = () => projects.filter((p) => p.blurb && p.tag);

export const sitePapers = () => [...papers].sort(byRecency);

export type TimelineRow = {
	id: string;
	years: string;
	/** Blank when it repeats the row above. */
	org: string;
	label: string;
	suffix?: string;
};

/** The homepage timeline: degrees and jobs marked `timeline`, newest first. */
export const siteTimeline = (): TimelineRow[] => {
	const rows = [
		...degrees.map((d) => ({ ...d, org: d.school, label: d.degree, suffix: d.field })),
		...employment.map((j) => ({ ...j, label: j.role, suffix: undefined })),
	]
		.filter((e) => e.timeline)
		.sort(byRecency);

	return rows.map((e, i) => {
		const repeated = rows[i - 1]?.org === e.org;
		const [label, suffix] =
			typeof e.timeline === "string"
				? e.timeline.split("|").map((s) => s.trim())
				: [e.label, repeated ? undefined : e.suffix];
		return { id: e.id, years: when(e.when)!.years, org: repeated ? "" : e.org, label, suffix };
	});
};
