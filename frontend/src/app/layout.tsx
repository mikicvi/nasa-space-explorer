import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { APP_CONFIG } from '@/constants';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: {
		default: APP_CONFIG.name,
		template: `%s | ${APP_CONFIG.name}`,
	},
	description: APP_CONFIG.description,
	keywords: ['NASA', 'space', 'astronomy', 'mars', 'ISS', 'APOD', 'API'],
	authors: [{ name: APP_CONFIG.author }],
	creator: APP_CONFIG.author,
	openGraph: {
		type: 'website',
		locale: 'en_UK',
		url: process.env.NEXT_PUBLIC_APP_URL,
		siteName: APP_CONFIG.name,
		title: APP_CONFIG.name,
		description: APP_CONFIG.description,
	},
	twitter: {
		card: 'summary_large_image',
		title: APP_CONFIG.name,
		description: APP_CONFIG.description,
		creator: APP_CONFIG.social.twitter,
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={inter.className}>
				<div className='relative min-h-screen flex flex-col'>
					<Navigation />
					<main className='flex-1'>{children}</main>
					<Footer />
				</div>
			</body>
		</html>
	);
}
