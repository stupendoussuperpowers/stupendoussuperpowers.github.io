import './project.css';
import Link from 'next/link';
import React from 'react';

const linkLabel = (url: string) => {
	url = url.replace("https://", "");

	if (url.includes("github.com")) {
		const parts = url.split("/");
		return `${parts[1]}/${parts[2]}`
	}

	return url;

};

const getReportTitle = (s: string) => {
	const parts = s.split("|");
	if (parts.length < 2) return "Report";

	return parts[1];
}

export const Project: React.FC<ProjectData> = ({ title, content, link, report, languages, }) => {
	return (<div className='p-card'>
		<div className='p-title'>
			<b style={{ fontSize: 'normal' }}>{title}</b>
			<div style={{ display: "flex", alignItems: "center", marginTop: "0px" }}>
				<span className='slug'>
					<Link href={`${link}`}>
						{linkLabel(link)}
					</Link>
				</span>
				{report ? <span className='slug'><Link href={report}>{getReportTitle(report)}</Link></span> : <></>}
			</div>
		</div>
		{languages ? <div style={{ fontSize: 'small', marginTop: '5px' }}>[{languages}]</div> : <></>}
		<div className="content">{content}</div>
	</div >);
}
