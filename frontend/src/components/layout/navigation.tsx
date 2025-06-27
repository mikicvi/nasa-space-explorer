'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Rocket, Camera, Satellite, Menu, Github, Twitter, Home, Car, Target, Images } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { APP_CONFIG } from '@/constants';
import { cn } from '@/lib/utils';

const navigation = [
	{ name: 'Home', href: '/', icon: Home, shortName: 'Home' },
	{ name: 'APOD', href: '/apod', icon: Camera, shortName: 'APOD' },
	{ name: 'Mars Rovers', href: '/mars-rovers', icon: Car, shortName: 'Mars' },
	{ name: 'ISS Tracker', href: '/iss-tracker', icon: Satellite, shortName: 'ISS' },
	{ name: 'Near Earth Objects', href: '/neo', icon: Target, shortName: 'NEO' },
	{ name: 'Image Gallery', href: '/gallery', icon: Images, shortName: 'Gallery' },
];

export function Navigation() {
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

	return (
		<header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8'>
				{/* Logo */}
				<Link href='/' className='flex items-center space-x-2 min-w-0 flex-shrink-0'>
					<motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
						<Rocket className='h-5 w-5 sm:h-6 sm:w-6 text-primary' />
					</motion.div>
					<span className='font-bold text-base sm:text-lg lg:text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent truncate'>
						NASA Explorer
					</span>
				</Link>

				{/* Desktop Navigation */}
				<nav className='hidden md:flex items-center space-x-1 lg:space-x-2 xl:space-x-4'>
					{navigation.map((item) => {
						const isActive = pathname === item.href;
						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									'flex items-center space-x-1.5 lg:space-x-2 text-sm font-medium transition-all duration-200 hover:text-primary hover:bg-primary/5 px-2 lg:px-3 py-2 rounded-md whitespace-nowrap',
									isActive ? 'text-primary bg-primary/10 shadow-sm' : 'text-muted-foreground'
								)}
							>
								<item.icon className='h-4 w-4 flex-shrink-0' />
								<span className='hidden md:block xl:hidden'>{item.shortName}</span>
								<span className='hidden xl:block'>{item.name}</span>
							</Link>
						);
					})}
				</nav>

				{/* Social Links - Hidden on small screens */}
				<div className='hidden lg:flex items-center space-x-1'>
					<Button variant='ghost' size='sm' asChild>
						<Link
							href={`https://github.com/${APP_CONFIG.github}`}
							target='_blank'
							rel='noopener noreferrer'
						>
							<Github className='h-4 w-4' />
							<span className='sr-only'>GitHub</span>
						</Link>
					</Button>
					<Button variant='ghost' size='sm' asChild>
						<Link
							href={`https://twitter.com/${APP_CONFIG.social.twitter}`}
							target='_blank'
							rel='noopener noreferrer'
						>
							<Twitter className='h-4 w-4' />
							<span className='sr-only'>Twitter</span>
						</Link>
					</Button>
				</div>

				{/* Mobile Menu */}
				<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
					<SheetTrigger asChild className='md:hidden'>
						<Button variant='ghost' size='sm'>
							<Menu className='h-5 w-5' />
							<span className='sr-only'>Toggle menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side='right' className='w-[300px] sm:w-[400px]'>
						<div className='flex flex-col space-y-4 mt-6'>
							{navigation.map((item) => {
								const isActive = pathname === item.href;
								return (
									<Link
										key={item.href}
										href={item.href}
										onClick={() => setMobileMenuOpen(false)}
										className={cn(
											'flex items-center space-x-3 text-lg font-medium transition-colors hover:text-primary p-2 rounded-md',
											isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground'
										)}
									>
										<item.icon className='h-5 w-5' />
										<span>{item.name}</span>
									</Link>
								);
							})}

							<div className='border-t pt-4 mt-6'>
								<div className='flex space-x-2'>
									<Button variant='outline' size='sm' asChild>
										<Link href={`https://github.com/${APP_CONFIG.github}`} target='_blank'>
											<Github className='h-4 w-4 mr-2' />
											GitHub
										</Link>
									</Button>
									<Button variant='outline' size='sm' asChild>
										<Link href={`https://twitter.com/${APP_CONFIG.social.twitter}`} target='_blank'>
											<Twitter className='h-4 w-4 mr-2' />
											Twitter
										</Link>
									</Button>
								</div>
							</div>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</header>
	);
}
