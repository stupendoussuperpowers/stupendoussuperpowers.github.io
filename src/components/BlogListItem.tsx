import './project.css';
import Link from 'next/link';

export type BlogData = {
    title: string,
    tag: string,
    date: string,
    slug: string,
}

export const BlogListItem: React.FC<BlogData> = ({ title, tag, date, slug }) => {

    return (<div className='p-card'>
        <div className='p-title'>
            <Link href={`/blog/${slug.replace(/\.md$/, '')}`}>
                <b>{title}</b>
            </Link>
            <div className='slug'>
                {date}
            </div>
        </div>
        <div>{tag}</div>
    </div >);
}
