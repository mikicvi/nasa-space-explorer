import Link from 'next/link';
import { Rocket } from 'lucide-react';
import { APP_CONFIG } from '@/constants';

export function Footer() {
	return (
		<footer className='border-t bg-background'>
			<div className='container py-8 md:py-12'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
					{/* Brand */}
					<div className='col-span-1 md:col-span-2'>
						<Link href='/' className='flex items-center space-x-2 mb-4'>
							<Rocket className='h-6 w-6 text-primary' />
							<span className='font-bold text-xl'>{APP_CONFIG.name}</span>
						</Link>
						<p className='text-muted-foreground mb-4 max-w-md'>{APP_CONFIG.description}</p>
						<p className='text-sm text-muted-foreground'>Built with ❤️ using NASA&apos;s amazing APIs</p>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className='font-semibold mb-4'>Explore</h3>
						<ul className='space-y-2 text-sm'>
							<li>
								<Link
									href='/apod'
									className='text-muted-foreground hover:text-primary transition-colors'
								>
									Astronomy Picture of the Day
								</Link>
							</li>
							<li>
								<Link
									href='/mars-rovers'
									className='text-muted-foreground hover:text-primary transition-colors'
								>
									Mars Rover Photos
								</Link>
							</li>
							<li>
								<Link
									href='/iss-tracker'
									className='text-muted-foreground hover:text-primary transition-colors'
								>
									ISS Tracker
								</Link>
							</li>
							<li>
								<Link
									href='/neo'
									className='text-muted-foreground hover:text-primary transition-colors'
								>
									Near Earth Objects
								</Link>
							</li>
						</ul>
					</div>

					{/* Resources */}
					<div>
						<h3 className='font-semibold mb-4'>Resources</h3>
						<ul className='space-y-2 text-sm'>
							<li>
								<Link
									href='https://api.nasa.gov'
									target='_blank'
									className='text-muted-foreground hover:text-primary transition-colors'
								>
									NASA API
								</Link>
							</li>
							<li>
								<Link
									href='https://www.nasa.gov'
									target='_blank'
									className='text-muted-foreground hover:text-primary transition-colors'
								>
									NASA.gov
								</Link>
							</li>
							<li>
								<Link
									href='https://github.com/nasa'
									target='_blank'
									className='text-muted-foreground hover:text-primary transition-colors'
								>
									NASA on GitHub
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className='border-t mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center'>
					<p className='text-sm text-muted-foreground'>© 2025 {APP_CONFIG.name}. Data provided by NASA.</p>
				</div>
			</div>
		</footer>
	);
}
