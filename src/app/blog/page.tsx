import { BlogListItem } from '../../components/BlogListItem';
import './blog.css';
import React from 'react';
import { Metadata } from 'next';
import { ReadIndex } from '../../utils';

import { myCustomFont } from '@/ui/font';

const getStaticProps = async () => {
	const indexEntries: IndexEntry[] = await ReadIndex(true);
	return indexEntries;
}

export async function generateMetadata(
): Promise<Metadata> {
	return {
		title: "Pocket Litter / Sanchit Sahay"
	}
}

export default async function Blog() {
	const entries = await getStaticProps();
	const pinnedEntries = entries.filter((entry) => entry.pinned);
	const chronologicalEntries = entries.filter((entry) => !entry.pinned);

	return <div className='window-blog'>
		<div className={myCustomFont.className}
			style={{ fontSize: "40px" }}
		>Pocket Litter</div>

		<p className="pocket-litter-intro">
			You turn the keys on the door after a long and ardous journey, and before you sneak into your PJs and jump into your cozy bed you empty your pockets. What falls out are some used ticket stubs, a receipt for a meal, or a tissue from your hotel bedside table. Things that are moments away from being crumpled up and thrown in the bin, despite being perhaps the truest account one can sketch of your journey.<br /><br />
			Come examine one such journey.
		</p>
		{
			entries.length > 0 ?
				<>
					{
						pinnedEntries.length > 0 ?
							<ul>
								{
									pinnedEntries.map((entry) => {
										return <li key={entry.slug} className='pin'>
											<BlogListItem {...entry} />
										</li>
									})
								}
							</ul> :
							<></>
					}
					<hr />
					<br />
					<ul>
						{
							chronologicalEntries.map((entry) => {
								return <li key={entry.slug}>
									<BlogListItem {...entry} />
								</li>
							})
						}
					</ul>
				</> :
				<div>No Pocket Litter to show.</div>
		}
	</div >
}
