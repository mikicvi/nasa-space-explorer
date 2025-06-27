'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Camera, Globe, Satellite, Rocket, Telescope, Zap, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApod } from '@/hooks/use-apod';
import { useISSPosition } from '@/hooks/use-iss-position';
import { formatCoordinates } from '@/lib/utils';

const features = [
	{
		title: 'Astronomy Picture of the Day',
		description: "Discover the cosmos with NASA's daily featured image and explanation.",
		icon: Calendar,
		href: '/apod',
		color: 'from-blue-500 to-blue-600',
	},
	{
		title: 'Mars Rover Photos',
		description: 'Explore Mars through the eyes of Curiosity, Opportunity, and Spirit rovers.',
		icon: Camera,
		href: '/mars-rovers',
		color: 'from-red-500 to-red-600',
	},
	{
		title: 'ISS Live Tracker',
		description: 'Track the International Space Station in real-time as it orbits Earth.',
		icon: Satellite,
		href: '/iss-tracker',
		color: 'from-green-500 to-green-600',
	},
	{
		title: 'Near Earth Objects',
		description: 'Monitor asteroids and comets approaching our planet.',
		icon: Globe,
		href: '/neo',
		color: 'from-purple-500 to-purple-600',
	},
	{
		title: 'NASA Image Gallery',
		description: "Browse NASA's vast collection of space imagery and videos.",
		icon: Telescope,
		href: '/gallery',
		color: 'from-yellow-500 to-yellow-600',
	},
];

const stats = [
	{ label: 'NASA APIs', value: '10+' },
	{ label: 'Images Available', value: '100K+' },
	{ label: 'Mars Photos', value: '500K+' },
	{ label: 'Daily Updates', value: 'Live' },
];

export default function HomePage() {
	const { data: apod } = useApod();
	const { data: issPosition } = useISSPosition();

	return (
		<div className='flex flex-col'>
			{/* Hero Section */}
			<section className='relative py-20 lg:py-32 overflow-hidden'>
				<div className='absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5' />
				<div className='container relative'>
					<div className='mx-auto max-w-4xl text-center'>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
						>
							<Badge variant='outline' className='mb-6'>
								<Rocket className='h-3 w-3 mr-1' />
								Powered by NASA APIs
							</Badge>
							<h1 className='text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl'>
								Explore the{' '}
								<span className='bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
									Universe
								</span>
							</h1>
							<p className='mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto'>
								Journey through space with NASA&apos;s amazing data. From Mars rover photos to real-time
								ISS tracking, discover the wonders of our universe through cutting-edge APIs.
							</p>
							<div className='mt-10 flex items-center justify-center gap-4'>
								<Button size='lg' asChild>
									<Link href='/apod'>
										Start Exploring
										<ArrowRight className='ml-2 h-4 w-4' />
									</Link>
								</Button>
								<Button variant='outline' size='lg' asChild>
									<Link href='/about'>Learn More</Link>
								</Button>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Live Data Section */}
			<section className='py-16 bg-muted/30'>
				<div className='container'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className='text-center mb-12'
					>
						<h2 className='text-3xl font-bold mb-4'>Live Space Data</h2>
						<p className='text-muted-foreground max-w-2xl mx-auto'>
							Real-time information from space, updated automatically.
						</p>
					</motion.div>

					<div className='grid gap-8 md:grid-cols-2'>
						{/* APOD Preview */}
						{apod && (
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.6 }}
								viewport={{ once: true }}
							>
								<Card className='overflow-hidden'>
									<CardHeader>
										<CardTitle className='flex items-center'>
											<Calendar className='h-5 w-5 mr-2' />
											Today&apos;s Astronomy Picture
										</CardTitle>
										<CardDescription>{apod.title}</CardDescription>
									</CardHeader>
									<CardContent>
										<div className='aspect-video relative overflow-hidden rounded-lg mb-4'>
											{apod.media_type === 'image' ? (
												<img
													src={apod.url}
													alt={apod.title}
													className='object-cover w-full h-full'
												/>
											) : (
												<div className='flex items-center justify-center h-full bg-muted'>
													<p className='text-muted-foreground'>Video content</p>
												</div>
											)}
										</div>
										<Button asChild variant='outline' className='w-full'>
											<Link href='/apod'>View Full Image & Explanation</Link>
										</Button>
									</CardContent>
								</Card>
							</motion.div>
						)}

						{/* ISS Position */}
						{issPosition && (
							<motion.div
								initial={{ opacity: 0, x: 20 }}
								whileInView={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.6 }}
								viewport={{ once: true }}
							>
								<Card>
									<CardHeader>
										<CardTitle className='flex items-center'>
											<Satellite className='h-5 w-5 mr-2' />
											ISS Current Location
										</CardTitle>
										<CardDescription>
											Live tracking of the International Space Station
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className='space-y-4'>
											<div className='flex items-center justify-between'>
												<span className='text-sm font-medium'>Coordinates:</span>
												<Badge variant='secondary'>
													<MapPin className='h-3 w-3 mr-1' />
													{formatCoordinates(
														parseFloat(issPosition.iss_position.latitude),
														parseFloat(issPosition.iss_position.longitude)
													)}
												</Badge>
											</div>
											<div className='flex items-center justify-between'>
												<span className='text-sm font-medium'>Last Updated:</span>
												<span className='text-sm text-muted-foreground'>
													{new Date(issPosition.timestamp * 1000).toLocaleTimeString()}
												</span>
											</div>
											<Button asChild variant='outline' className='w-full'>
												<Link href='/iss-tracker'>Track ISS Live</Link>
											</Button>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						)}
					</div>
				</div>
			</section>

			{/* Features Grid */}
			<section className='py-20'>
				<div className='container'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className='text-center mb-16'
					>
						<h2 className='text-3xl font-bold mb-4'>Explore Space Data</h2>
						<p className='text-muted-foreground max-w-2xl mx-auto'>
							Discover the universe through NASA&apos;s comprehensive collection of APIs and data sources.
						</p>
					</motion.div>

					<div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
						{features.map((feature, index) => (
							<motion.div
								key={feature.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
								viewport={{ once: true }}
							>
								<Link href={feature.href}>
									<Card className='h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group'>
										<CardHeader>
											<div
												className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}
											>
												<feature.icon className='h-6 w-6 text-white' />
											</div>
											<CardTitle className='group-hover:text-primary transition-colors'>
												{feature.title}
											</CardTitle>
											<CardDescription>{feature.description}</CardDescription>
										</CardHeader>
										<CardContent>
											<Button variant='ghost' className='w-full justify-between'>
												Explore
												<ArrowRight className='h-4 w-4' />
											</Button>
										</CardContent>
									</Card>
								</Link>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className='py-16 bg-muted/30'>
				<div className='container'>
					<div className='grid gap-8 md:grid-cols-4'>
						{stats.map((stat, index) => (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, scale: 0.5 }}
								whileInView={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
								viewport={{ once: true }}
								className='text-center'
							>
								<div className='text-4xl font-bold text-primary mb-2'>{stat.value}</div>
								<div className='text-muted-foreground'>{stat.label}</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className='py-20'>
				<div className='container'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className='max-w-4xl mx-auto text-center'
					>
						<h2 className='text-3xl font-bold mb-4'>Ready to Explore Space?</h2>
						<p className='text-muted-foreground mb-8 max-w-2xl mx-auto'>
							Start your journey through the cosmos with NASA&apos;s amazing data. From daily astronomy
							pictures to real-time space tracking.
						</p>
						<div className='flex items-center justify-center gap-4'>
							<Button size='lg' asChild>
								<Link href='/apod'>
									<Zap className='mr-2 h-4 w-4' />
									Get Started
								</Link>
							</Button>
							<Button variant='outline' size='lg' asChild>
								<Link href='https://api.nasa.gov' target='_blank'>
									NASA APIs
								</Link>
							</Button>
						</div>
					</motion.div>
				</div>
			</section>
		</div>
	);
}
