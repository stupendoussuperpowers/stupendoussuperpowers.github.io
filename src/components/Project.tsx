import './project.css';
import Link from 'next/link';
import React from 'react';
import ReactMarkdown from 'react-markdown';

export const Project: React.FC<ProjectData> = ({ title, content, slug, report, languages }) => {
	return (<div className='p-card'>
		<div className='p-title'>
			<b style={{ fontSize: 'large' }}>{title}</b>
			<div style={{ display: "flex", alignItems: "center", marginTop: "0px" }}>
				<span className='slug'>
					<Link href={`https://github.com/${slug}`}>
						{slug}
					</Link>
				</span>
				<span className='slug'>
					{report ?
						<Link href={report}>Report</Link> : <></>}
				</span>
			</div>
		</div>
		<div style={{ fontSize: 'small' }}>[{languages}]</div>
		<ReactMarkdown>{content}</ReactMarkdown>
		<hr />
	</div >);
}
