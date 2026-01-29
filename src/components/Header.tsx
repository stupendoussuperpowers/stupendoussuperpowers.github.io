import './header.css';
import Link from 'next/link';
import React from 'react';

import { myCustomFont } from '@/ui/font';

export default function Header() {
	return <>
		<table>
			<tbody>
				<tr>
					<td>
						<div>
							<h1 className={myCustomFont.className}>Sanchit Sahay</h1>
							<span className='subtitle'>Systems, Virtualization, Web, Cloud and More!</span>
						</div>
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
		<div className='links'>
			<span className='nav'><Link href="https://github.com/stupendoussuperpowers">github.com/stupendoussuperpowers</Link></span>
			<span className='nav'><Link href="mailto:s.sahay@nyu.edu">Email</Link></span>
			<span className='nav'><Link href="/sanchit_sahay.pdf" download={true}>CV/Resume</Link></span>
		</div>
	</>
}

