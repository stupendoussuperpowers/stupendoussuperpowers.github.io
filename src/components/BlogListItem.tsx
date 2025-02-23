import './project.css';
import Link from 'next/link';
import { IndexEntry } from '@/utils';

export const BlogListItem: React.FC<IndexEntry> = ({ title, blurb, date, slug }) => {

    return (<div className='p-card'>
        <div className='p-title'>
            <Link href={`/blog/${slug.replace(/\.md$/, '')}`}>
                <b>{title}</b>
            </Link>
            <div className='slug'>
                {date}
            </div>
        </div>
        <div>{blurb}</div>
    </div >);
}
