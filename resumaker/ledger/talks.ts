import type { Talk } from "./types";

export const talks: Talk[] = [
	{
		id: "openssf-eu26",
		title: "Over the Shoulder: Improving SBOM Accuracy by Watching the Build",
		venue: "OpenSSF Community Day EU",
		where: "Prague",
		when: "2026-10",
	},
	{
		id: "pycon26",
		title:
			"Asleep at the Wheel: Getting your SBOMs to pay attention to Python builds",
		venue: "PyCon US",
		where: "Long Beach",
		when: "2026-05",
		links: {
			schedule: "https://us.pycon.org/2026/schedule/presentation/116",
			video: "https://youtu.be/VYY3HnRtV6U?si=yOaUd6htQnPzMJnE",
		},
	},
	{
		id: "kubecon25",
		title: "OpenSSF SBOMit Meeting",
		venue: "KubeCon + CloudNativeCon",
		where: "Atlanta",
		when: "2025-11",
	},
];
