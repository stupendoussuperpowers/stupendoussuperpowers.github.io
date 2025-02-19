import './header.css';
import Link from 'next/link';

export default function Header() {
    return <>
        <table>
            <tbody>
                <tr>
                    <td>
                        <h1 className='title'>Sanchit Sahay</h1>
                        <span className='subtitle'>Systems, Virtualization, Web, Cloud and More!</span>
                    </td>
                    <td>
                        <Link href="/">Home</Link>
                    </td>
                    <td>
                        <Link href="/projects">Projects</Link>
                    </td>
                    <td>
                        <Link href="/blog">Blog</Link>
                    </td>
                </tr>
            </tbody>
        </table>

        <table className='contacts'>
            <tbody>
                <tr>
                    <td>Github</td>
                    <td>Email</td>
                    <td>CV/Resume</td>
                </tr>
            </tbody>
        </table>
    </>
}