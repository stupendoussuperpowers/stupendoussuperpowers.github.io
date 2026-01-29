import localFont from 'next/font/local';
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

