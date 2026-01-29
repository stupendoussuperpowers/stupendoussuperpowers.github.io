import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import React from 'react';

import localFont from 'next/font/local';

export const metadata: Metadata = {
	title: "Sanchit Sahay",
	description: "Welcome to my website!",
};

// src/ui/fonts.ts or app/layout.tsx

export const myCustomFont = localFont({
	src: [
		{
			path: '../../public/Coustard-Regular.ttf', // Adjust path based on your file structure
			weight: '400',
			style: 'normal',
		},
		{
			path: '../../public/Coustard-Black.ttf',
			weight: '700',
			style: 'normal',
		},
	],
	display: 'swap', // Optional: controls font display behavior
	variable: '--font-my-custom-font', // Optional: for use with Tailwind CSS
});


export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className='debug'>
				<div className='actualbody'>
					<Header />
					{children}
					{/* <div className="debug-grid"></div> */}
					<Footer />
				</div>
				<div className="cmyk start">
					<div className="c box"></div>
					<div className="m box"></div>
					<div className="y box"></div>
					<div className="k box"></div>
				</div>
			</body>
		</html>
	);
}
