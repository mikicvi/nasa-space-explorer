'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Download, Share2, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useApod } from '@/hooks/use-apod';
import { formatDate } from '@/lib/utils';

export default function ApodPage() {
	const [selectedDate, setSelectedDate] = useState<string>('');
	const { data: apod, loading, error } = useApod(selectedDate);

	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedDate(e.target.value);
	};

	const goToPreviousDay = () => {
		if (apod?.date) {
			const currentDate = new Date(apod.date);
			currentDate.setDate(currentDate.getDate() - 1);
			setSelectedDate(currentDate.toISOString().split('T')[0]);
		}
	};

	const goToNextDay = () => {
		if (apod?.date) {
			const currentDate = new Date(apod.date);
			const tomorrow = new Date(currentDate);
			tomorrow.setDate(currentDate.getDate() + 1);
			const today = new Date();

			if (tomorrow <= today) {
				setSelectedDate(tomorrow.toISOString().split('T')[0]);
			}
		}
	};

	const handleShare = async () => {
		if (apod && navigator.share) {
			try {
				await navigator.share({
					title: `NASA APOD: ${apod.title}`,
					text: apod.explanation.substring(0, 200) + '...',
					url: window.location.href,
				});
			} catch (err) {
				console.log('Error sharing:', err);
			}
		} else if (apod) {
			// Fallback: copy to clipboard
			navigator.clipboard.writeText(`${apod.title}\n${window.location.href}`);
		}
	};

	const handleDownload = () => {
		if (apod?.hdurl || apod?.url) {
			const link = document.createElement('a');
			link.href = apod.hdurl || apod.url;
			link.download = `nasa-apod-${apod.date}.jpg`;
			link.target = '_blank';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	};

	const isToday = apod?.date === new Date().toISOString().split('T')[0];
	const canGoNext = apod?.date && new Date(apod.date) < new Date();

	return (
		<div className='container py-8'>
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
				<div className='max-w-4xl mx-auto'>
					{/* Header */}
					<div className='text-center mb-8'>
						<Badge variant='outline' className='mb-4'>
							<Calendar className='h-3 w-3 mr-1' />
							Astronomy Picture of the Day
						</Badge>
						<h1 className='text-4xl font-bold mb-4'>Explore the Cosmos</h1>
						<p className='text-muted-foreground max-w-2xl mx-auto'>
							Each day NASA features a different image or photograph of our fascinating universe, along
							with a brief explanation written by a professional astronomer.
						</p>
					</div>

					{/* Date Picker and Navigation */}
					<div className='flex items-center justify-center gap-4 mb-8'>
						<Button variant='outline' size='sm' onClick={goToPreviousDay} disabled={!apod || loading}>
							<ChevronLeft className='h-4 w-4' />
							Previous
						</Button>

						<Input
							type='date'
							value={selectedDate}
							onChange={handleDateChange}
							max={new Date().toISOString().split('T')[0]}
							min='1995-06-16' // APOD started on June 16, 1995
							className='w-auto'
						/>

						<Button variant='outline' size='sm' onClick={goToNextDay} disabled={!canGoNext || loading}>
							Next
							<ChevronRight className='h-4 w-4' />
						</Button>
					</div>

					{/* Loading State */}
					{loading && (
						<div className='flex items-center justify-center py-12'>
							<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
						</div>
					)}

					{/* Error State */}
					{error && (
						<Card className='mb-8'>
							<CardContent className='pt-6'>
								<div className='text-center text-red-600'>
									<p>Error loading APOD: {error}</p>
									<Button variant='outline' className='mt-4' onClick={() => window.location.reload()}>
										Try Again
									</Button>
								</div>
							</CardContent>
						</Card>
					)}

					{/* APOD Content */}
					{apod && !loading && (
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6 }}
						>
							<Card className='overflow-hidden'>
								<CardHeader>
									<div className='flex items-start justify-between'>
										<div>
											<CardTitle className='text-2xl mb-2'>{apod.title}</CardTitle>
											<CardDescription className='flex items-center gap-4'>
												<span>{formatDate(apod.date, 'PPPP')}</span>
												{isToday && <Badge variant='secondary'>Today</Badge>}
												{apod.copyright && <span className='text-sm'>© {apod.copyright}</span>}
											</CardDescription>
										</div>
										<div className='flex gap-2'>
											<Button variant='outline' size='sm' onClick={handleShare}>
												<Share2 className='h-4 w-4' />
											</Button>
											{apod.media_type === 'image' && (
												<Button variant='outline' size='sm' onClick={handleDownload}>
													<Download className='h-4 w-4' />
												</Button>
											)}
											{apod.hdurl && (
												<Button variant='outline' size='sm' asChild>
													<a href={apod.hdurl} target='_blank' rel='noopener noreferrer'>
														<ExternalLink className='h-4 w-4' />
													</a>
												</Button>
											)}
										</div>
									</div>
								</CardHeader>

								<CardContent>
									{/* Media Content */}
									<div className='mb-6'>
										{apod.media_type === 'image' ? (
											<div className='relative overflow-hidden rounded-lg'>
												<img
													src={apod.hdurl || apod.url}
													alt={apod.title}
													className='w-full h-auto'
													loading='lazy'
												/>
											</div>
										) : apod.media_type === 'video' ? (
											<div className='relative overflow-hidden rounded-lg aspect-video'>
												<iframe
													src={apod.url}
													title={apod.title}
													className='w-full h-full'
													allowFullScreen
												/>
											</div>
										) : (
											<div className='flex items-center justify-center h-64 bg-muted rounded-lg'>
												<p className='text-muted-foreground'>
													Unsupported media type: {apod.media_type}
												</p>
											</div>
										)}
									</div>

									{/* Explanation */}
									<div className='prose prose-neutral dark:prose-invert max-w-none'>
										<h3 className='text-lg font-semibold mb-3'>Explanation</h3>
										<p className='text-muted-foreground leading-relaxed'>{apod.explanation}</p>
									</div>

									{/* Action Buttons */}
									<div className='flex flex-wrap gap-3 mt-6 pt-6 border-t'>
										<Button variant='outline' onClick={handleShare}>
											<Share2 className='mr-2 h-4 w-4' />
											Share
										</Button>

										{apod.media_type === 'image' && (
											<Button variant='outline' onClick={handleDownload}>
												<Download className='mr-2 h-4 w-4' />
												Download
											</Button>
										)}

										{apod.hdurl && (
											<Button variant='outline' asChild>
												<a href={apod.hdurl} target='_blank' rel='noopener noreferrer'>
													<ExternalLink className='mr-2 h-4 w-4' />
													View HD
												</a>
											</Button>
										)}

										<Button variant='outline' asChild>
											<a
												href={`https://apod.nasa.gov/apod/ap${apod.date
													.replace(/-/g, '')
													.substring(2)}.html`}
												target='_blank'
												rel='noopener noreferrer'
											>
												<ExternalLink className='mr-2 h-4 w-4' />
												View on NASA
											</a>
										</Button>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					)}

					{/* Quick Navigation */}
					{apod && !loading && (
						<div className='flex items-center justify-between mt-8'>
							<Button variant='ghost' onClick={goToPreviousDay} disabled={loading}>
								<ChevronLeft className='mr-2 h-4 w-4' />
								Previous Day
							</Button>

							<Button variant='ghost' onClick={() => setSelectedDate('')} disabled={isToday}>
								Today
							</Button>

							<Button variant='ghost' onClick={goToNextDay} disabled={!canGoNext || loading}>
								Next Day
								<ChevronRight className='ml-2 h-4 w-4' />
							</Button>
						</div>
					)}
				</div>
			</motion.div>
		</div>
	);
}
