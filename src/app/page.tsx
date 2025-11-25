import './custom.css';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { ReadIndex } from '@/utils';
import { Metadata } from 'next';

const getStaticProps = async () => {
	const indexEntries: IndexEntry[] = await ReadIndex(true);
	console.log({ indexEntries });
	return indexEntries;
}

export async function generateMetadata(
): Promise<Metadata> {
	return {
		title: 'Home / Sanchit Sahay'
	}
}

export default async function Home() {

	const articles = (await getStaticProps()).filter(x => x.pinned);

	console.log({ articles });

	return (
		<div className='window'>
			<div className='portrait'>
				<Image src='/mt_washington.jpg'
					width={150}
					height={400}
					alt='portrait'
					style={{ objectFit: "cover" }}
				/>
			</div>
			<div className='scrollable'>
				<p>
					Come one, come all to my corner of the internet!
				</p>
				<p>
					I&apos;m a graduate student in CS at NYU, working with the <Link href="https://ssl.engineering.nyu.edu/">Secure Systems Lab</Link>.
				</p>
				<p>
					Areas of interest include distributed systems, operating systems, cloud, virtualization, and web technologies.
				</p>
				<p>
					Take a look at my recent <Link href="/projects">Projects</Link>, or head over to my <Link href="/blog">Blog</Link>, get started with one of my posts here:
				</p>
				<ul>
					{
						articles.map(art => (
							<li key={art.slug}>
								<Link href={`/blog/${art.slug}`}>{art.title}</Link>
								<span> {art.blurb} </span>
							</li>
						))
					}
				</ul>
				<hr />
				<p>
					[2024-Pres] <b>New York University</b>, MS Computer Science <br />

					[2022-2024] <b>Commvault Systems</b>, Virtual Server Agent team. <br />

					[2021-2021] <b>LegalAI</b>, Fullstack Web & DevOps Intern. <br />

					[2018-2022] <b>Manipal Institute of Technology</b>, B.Tech (IT)
				</p>

			</div>
		</div >
	);
}
