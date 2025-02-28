import './project.css';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import React from 'react';

export const Project: React.FC<ProjectData> = ({ title, content, slug, readme, languages }) => {
    return (<div className='p-card'>
        <div className='p-title'>
            <b>{title}</b>
            <div className='slug'>
                <Link href={`https://github.com/${slug}`}>
                    {slug}
                </Link>
            </div>
        </div>
        <div>[{languages}]</div>
        <div>{content}</div>
        <div>
            <details>
                <summary> README.md</summary>
                <ReactMarkdown>
                    {readme}
                </ReactMarkdown>
            </details>
        </div>
    </div>);
}
