import localFont from 'next/font/local';
import { JetBrains_Mono } from 'next/font/google';

export const myCustomFont = localFont({
	src: [
		{
			path: '../../public/Coustard-Regular.ttf', // Adjust path based on your file structure
			weight: '400',
			style: 'normal',
		}
	],
	display: 'swap', // Optional: controls font display behavior
	variable: '--font-my-custom-font', // Optional: for use with Tailwind CSS
});

export const jetbrainsMono = JetBrains_Mono({
	subsets: ['latin'],
	weight: ['500', '600', '800'],
	display: 'swap',
	variable: '--font-jetbrains-mono',
});

