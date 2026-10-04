import "./project.css";
import Link from "next/link";
import React from "react";
import { type Project as Card, link } from "../../resumaker/ledger";

export const Project: React.FC<{
	entry: Pick<Card, "title" | "link" | "repo" | "report" | "blurb" | "role">;
	languages?: string;
}> = ({
	entry,
	languages,
}) => {
	const primary = link(entry.link);
	const report = link(entry.report);

	return (
		<div className="p-card">
			<div className="p-title">
				<b style={{ fontSize: "normal" }}>{entry.title}</b>
				<div style={{ display: "flex", alignItems: "center", marginTop: "0px" }}>
					{primary ? (
						<span className="slug">
							<Link href={primary.url}>
								{entry.repo ?? primary.label}
							</Link>
						</span>
					) : null}
					{report ? (
						<span className="slug">
							<Link href={report.url}>
								{entry.report!.includes("|") ? report.label : "Report"}
							</Link>
						</span>
					) : null}
				</div>
			</div>
			{entry.role ? <div className="role-tag">{entry.role}</div> : null}
			{languages ? (
				<div style={{ fontSize: "small", marginTop: "5px" }}>[{languages}]</div>
			) : null}
			<div className="content">{entry.blurb}</div>
		</div>
	);
};
