'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	Search,
	Download,
	Eye,
	Grid,
	List,
	Play,
	Image as ImageIcon,
	Video,
	ExternalLink,
	Heart,
	Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NasaApiService } from '@/services/nasa-api';
import { formatDate } from '@/lib/utils';

interface ImageItem {
	title: string;
	description: string;
	nasa_id: string;
	media_type: string;
	date_created: string;
	center: string;
	keywords?: string[];
	href?: string;
	render?: string;
}

const POPULAR_SEARCHES = [
	'Apollo',
	'Mars',
	'Jupiter',
	'Saturn',
	'Hubble',
	'Earth',
	'Moon',
	'Galaxy',
	'Nebula',
	'Astronaut',
	'Space Station',
	'Rocket Launch',
];

const MEDIA_TYPES = [
	{ value: 'all', label: 'All Media' },
	{ value: 'image', label: 'Images Only' },
	{ value: 'video', label: 'Videos Only' },
	{ value: 'audio', label: 'Audio Only' },
];

export default function ImageGalleryPage() {
	const [images, setImages] = useState<ImageItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [mediaType, setMediaType] = useState('all');
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [favorites, setFavorites] = useState<Set<string>>(new Set());
	const [totalPages, setTotalPages] = useState(1);
	const [hasSearched, setHasSearched] = useState(false);

	// Load favorites from localStorage
	useEffect(() => {
		const savedFavorites = localStorage.getItem('nasa-favorites');
		if (savedFavorites) {
			setFavorites(new Set(JSON.parse(savedFavorites)));
		}
	}, []);

	// Save favorites to localStorage
	useEffect(() => {
		localStorage.setItem('nasa-favorites', JSON.stringify(Array.from(favorites)));
	}, [favorites]);

	// Fetch images
	const fetchImages = async (query: string, page: number = 1, resetResults: boolean = true) => {
		if (!query.trim()) {
			setError('Please enter a search term');
			return;
		}

		setLoading(true);
		setError(null);
		if (resetResults) {
			setImages([]);
			setCurrentPage(1);
		}

		try {
			const response = await NasaApiService.searchImages(
				query,
				mediaType === 'all' ? undefined : (mediaType as 'image' | 'video' | 'audio'),
				page
			);

			const processedImages: ImageItem[] = response.collection.items.map((item) => {
				const imageData = item.data[0];
				const links = item.links?.[0];

				return {
					title: imageData.title,
					description: imageData.description,
					nasa_id: imageData.nasa_id,
					media_type: imageData.media_type,
					date_created: imageData.date_created,
					center: imageData.center,
					keywords: imageData.keywords,
					href: links?.href,
					render: links?.render,
				};
			});

			if (resetResults) {
				setImages(processedImages);
			} else {
				setImages((prev) => [...prev, ...processedImages]);
			}

			// Calculate total pages (NASA API doesn't provide this, so we estimate)
			setTotalPages(10); // Fixed number since we don't have total_hits
			setHasSearched(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch images');
			setImages([]);
		} finally {
			setLoading(false);
		}
	};

	// Handle search
	const handleSearch = () => {
		if (searchQuery.trim()) {
			fetchImages(searchQuery, 1, true);
		}
	};

	// Handle popular search
	const handlePopularSearch = (query: string) => {
		setSearchQuery(query);
		fetchImages(query, 1, true);
	};

	// Load more images
	const loadMore = () => {
		if (currentPage < totalPages && !loading) {
			const nextPage = currentPage + 1;
			setCurrentPage(nextPage);
			fetchImages(searchQuery, nextPage, false);
		}
	};

	// Toggle favorite
	const toggleFavorite = (nasa_id: string) => {
		const newFavorites = new Set(favorites);
		if (newFavorites.has(nasa_id)) {
			newFavorites.delete(nasa_id);
		} else {
			newFavorites.add(nasa_id);
		}
		setFavorites(newFavorites);
	};

	// Share image
	const shareImage = async (image: ImageItem) => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: image.title,
					text: image.description,
					url: window.location.href,
				});
			} catch (err) {
				// User cancelled sharing
			}
		} else {
			// Fallback: copy to clipboard
			navigator.clipboard.writeText(`${image.title} - ${window.location.href}`);
		}
	};

	// Get media icon
	const getMediaIcon = (mediaType: string) => {
		switch (mediaType) {
			case 'image':
				return <ImageIcon className='h-4 w-4' />;
			case 'video':
				return <Video className='h-4 w-4' />;
			case 'audio':
				return <Play className='h-4 w-4' />;
			default:
				return <ImageIcon className='h-4 w-4' />;
		}
	};

	// Filter favorite images
	const favoriteImages = images.filter((image) => favorites.has(image.nasa_id));

	return (
		<div className='container mx-auto px-4 py-8 space-y-8'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className='text-center space-y-4'
			>
				<h1 className='text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent'>
					NASA Image Gallery
				</h1>
				<p className='text-muted-foreground max-w-2xl mx-auto'>
					Explore NASA's vast collection of space imagery, videos, and audio recordings. Discover stunning
					visuals from missions, telescopes, and research programs.
				</p>
			</motion.div>

			{/* Search */}
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<Search className='h-5 w-5' />
						Search NASA Media
					</CardTitle>
					<CardDescription>Search through NASA's extensive media library</CardDescription>
				</CardHeader>
				<CardContent className='space-y-6'>
					{/* Main Search */}
					<div className='flex flex-col md:flex-row gap-4'>
						<div className='flex-1'>
							<Input
								placeholder='Search for space images, videos, and audio...'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
								className='text-lg'
							/>
						</div>
						<div className='flex gap-2'>
							<Select value={mediaType} onValueChange={setMediaType}>
								<SelectTrigger className='w-40'>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{MEDIA_TYPES.map((type) => (
										<SelectItem key={type.value} value={type.value}>
											{type.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Button onClick={handleSearch} disabled={loading}>
								{loading ? 'Searching...' : 'Search'}
							</Button>
						</div>
					</div>

					{/* Popular Searches */}
					<div>
						<h3 className='text-sm font-medium mb-3'>Popular Searches</h3>
						<div className='flex flex-wrap gap-2'>
							{POPULAR_SEARCHES.map((search) => (
								<Button
									key={search}
									variant='outline'
									size='sm'
									onClick={() => handlePopularSearch(search)}
									className='text-xs'
								>
									{search}
								</Button>
							))}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Error Alert */}
			{error && (
				<Alert variant='destructive'>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{/* Results */}
			{hasSearched && (
				<div className='space-y-6'>
					<Tabs defaultValue='results' className='w-full'>
						<div className='flex items-center justify-between'>
							<TabsList>
								<TabsTrigger value='results' className='flex items-center gap-2'>
									<Grid className='h-4 w-4' />
									Results ({images.length})
								</TabsTrigger>
								<TabsTrigger value='favorites' className='flex items-center gap-2'>
									<Heart className='h-4 w-4' />
									Favorites ({favoriteImages.length})
								</TabsTrigger>
							</TabsList>

							<div className='flex items-center gap-2'>
								<Button
									variant='outline'
									size='sm'
									onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
								>
									{viewMode === 'grid' ? <List className='h-4 w-4' /> : <Grid className='h-4 w-4' />}
								</Button>
							</div>
						</div>

						<TabsContent value='results' className='space-y-6'>
							{/* Loading State */}
							{loading && images.length === 0 && (
								<div
									className={
										viewMode === 'grid'
											? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
											: 'space-y-4'
									}
								>
									{Array.from({ length: 8 }).map((_, i) => (
										<div key={i} className='space-y-3'>
											<Skeleton className='h-48 w-full rounded-lg' />
											<div className='space-y-2'>
												<Skeleton className='h-4 w-3/4' />
												<Skeleton className='h-4 w-1/2' />
											</div>
										</div>
									))}
								</div>
							)}

							{/* Images Grid/List */}
							{images.length > 0 && (
								<AnimatePresence mode='wait'>
									<motion.div
										key={viewMode}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										className={
											viewMode === 'grid'
												? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
												: 'space-y-4'
										}
									>
										{images.map((image, index) => (
											<motion.div
												key={image.nasa_id}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: index * 0.05 }}
											>
												{viewMode === 'grid' ? (
													<Card className='overflow-hidden hover:shadow-lg transition-all duration-300 group'>
														<div className='relative aspect-square overflow-hidden'>
															{image.href && (
																<img
																	src={image.href}
																	alt={image.title}
																	className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
																	loading='lazy'
																/>
															)}
															<div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300' />
															<div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-1'>
																<Button
																	size='sm'
																	variant='secondary'
																	onClick={() => toggleFavorite(image.nasa_id)}
																>
																	<Heart
																		className={`h-4 w-4 ${
																			favorites.has(image.nasa_id)
																				? 'fill-current text-red-500'
																				: ''
																		}`}
																	/>
																</Button>
																<Button
																	size='sm'
																	variant='secondary'
																	onClick={() => setSelectedImage(image)}
																>
																	<Eye className='h-4 w-4' />
																</Button>
															</div>
															<div className='absolute top-2 left-2'>
																<Badge
																	variant='secondary'
																	className='flex items-center gap-1'
																>
																	{getMediaIcon(image.media_type)}
																	{image.media_type}
																</Badge>
															</div>
														</div>
														<CardContent className='p-4'>
															<div className='space-y-2'>
																<h3 className='font-medium text-sm line-clamp-2'>
																	{image.title}
																</h3>
																<p className='text-xs text-muted-foreground line-clamp-2'>
																	{image.description}
																</p>
																<div className='flex items-center justify-between text-xs'>
																	<span className='text-muted-foreground'>
																		{image.center}
																	</span>
																	<span className='text-muted-foreground'>
																		{formatDate(image.date_created, 'MMM dd, yyyy')}
																	</span>
																</div>
															</div>
														</CardContent>
													</Card>
												) : (
													<Card className='overflow-hidden hover:shadow-md transition-all duration-300'>
														<div className='flex flex-col md:flex-row'>
															<div className='md:w-48 h-48 md:h-auto relative overflow-hidden'>
																{image.href && (
																	<img
																		src={image.href}
																		alt={image.title}
																		className='w-full h-full object-cover'
																		loading='lazy'
																	/>
																)}
																<div className='absolute top-2 left-2'>
																	<Badge
																		variant='secondary'
																		className='flex items-center gap-1'
																	>
																		{getMediaIcon(image.media_type)}
																		{image.media_type}
																	</Badge>
																</div>
															</div>
															<CardContent className='flex-1 p-4'>
																<div className='space-y-3'>
																	<div className='flex items-start justify-between'>
																		<div className='flex-1'>
																			<h3 className='font-semibold'>
																				{image.title}
																			</h3>
																			<p className='text-sm text-muted-foreground mt-1 line-clamp-3'>
																				{image.description}
																			</p>
																		</div>
																		<div className='flex gap-2 ml-4'>
																			<Button
																				size='sm'
																				variant='outline'
																				onClick={() =>
																					toggleFavorite(image.nasa_id)
																				}
																			>
																				<Heart
																					className={`h-4 w-4 ${
																						favorites.has(image.nasa_id)
																							? 'fill-current text-red-500'
																							: ''
																					}`}
																				/>
																			</Button>
																			<Button
																				size='sm'
																				variant='outline'
																				onClick={() => setSelectedImage(image)}
																			>
																				<Eye className='h-4 w-4 mr-2' />
																				View
																			</Button>
																		</div>
																	</div>
																	<div className='flex flex-wrap gap-2'>
																		{image.keywords?.slice(0, 3).map((keyword) => (
																			<Badge
																				key={keyword}
																				variant='outline'
																				className='text-xs'
																			>
																				{keyword}
																			</Badge>
																		))}
																	</div>
																	<div className='flex items-center justify-between text-sm'>
																		<span className='text-muted-foreground'>
																			{image.center}
																		</span>
																		<span className='text-muted-foreground'>
																			{formatDate(
																				image.date_created,
																				'MMM dd, yyyy'
																			)}
																		</span>
																	</div>
																</div>
															</CardContent>
														</div>
													</Card>
												)}
											</motion.div>
										))}
									</motion.div>
								</AnimatePresence>
							)}

							{/* Load More Button */}
							{images.length > 0 && currentPage < totalPages && (
								<div className='text-center'>
									<Button onClick={loadMore} disabled={loading} variant='outline'>
										{loading ? 'Loading...' : 'Load More'}
									</Button>
								</div>
							)}

							{/* No Results */}
							{!loading && images.length === 0 && hasSearched && (
								<motion.div
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									className='text-center py-12'
								>
									<Search className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
									<h3 className='text-lg font-semibold mb-2'>No Results Found</h3>
									<p className='text-muted-foreground mb-4'>
										Try a different search term or check your spelling.
									</p>
									<div className='space-y-2'>
										<p className='text-sm text-muted-foreground'>Try searching for:</p>
										<div className='flex flex-wrap gap-2 justify-center'>
											{POPULAR_SEARCHES.slice(0, 4).map((search) => (
												<Button
													key={search}
													variant='outline'
													size='sm'
													onClick={() => handlePopularSearch(search)}
												>
													{search}
												</Button>
											))}
										</div>
									</div>
								</motion.div>
							)}
						</TabsContent>

						<TabsContent value='favorites' className='space-y-6'>
							{favoriteImages.length > 0 ? (
								<div
									className={
										viewMode === 'grid'
											? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
											: 'space-y-4'
									}
								>
									{favoriteImages.map((image, index) => (
										<motion.div
											key={image.nasa_id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: index * 0.05 }}
										>
											{/* Same card structure as above, but for favorites */}
											<Card className='overflow-hidden hover:shadow-lg transition-all duration-300 group'>
												<div className='relative aspect-square overflow-hidden'>
													{image.href && (
														<img
															src={image.href}
															alt={image.title}
															className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
															loading='lazy'
														/>
													)}
													<div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-1'>
														<Button
															size='sm'
															variant='secondary'
															onClick={() => toggleFavorite(image.nasa_id)}
														>
															<Heart className='h-4 w-4 fill-current text-red-500' />
														</Button>
														<Button
															size='sm'
															variant='secondary'
															onClick={() => setSelectedImage(image)}
														>
															<Eye className='h-4 w-4' />
														</Button>
													</div>
												</div>
												<CardContent className='p-4'>
													<div className='space-y-2'>
														<h3 className='font-medium text-sm line-clamp-2'>
															{image.title}
														</h3>
														<p className='text-xs text-muted-foreground line-clamp-2'>
															{image.description}
														</p>
													</div>
												</CardContent>
											</Card>
										</motion.div>
									))}
								</div>
							) : (
								<motion.div
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									className='text-center py-12'
								>
									<Heart className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
									<h3 className='text-lg font-semibold mb-2'>No Favorites Yet</h3>
									<p className='text-muted-foreground'>
										Start exploring and save your favorite images by clicking the heart icon.
									</p>
								</motion.div>
							)}
						</TabsContent>
					</Tabs>
				</div>
			)}

			{/* Image Detail Modal */}
			{selectedImage && (
				<Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
					<DialogContent className='max-w-6xl max-h-[90vh] overflow-auto'>
						<DialogHeader>
							<DialogTitle className='flex items-center justify-between'>
								<span>{selectedImage.title}</span>
								<div className='flex gap-2'>
									<Button
										size='sm'
										variant='outline'
										onClick={() => toggleFavorite(selectedImage.nasa_id)}
									>
										<Heart
											className={`h-4 w-4 ${
												favorites.has(selectedImage.nasa_id) ? 'fill-current text-red-500' : ''
											}`}
										/>
									</Button>
									<Button size='sm' variant='outline' onClick={() => shareImage(selectedImage)}>
										<Share2 className='h-4 w-4' />
									</Button>
								</div>
							</DialogTitle>
							<DialogDescription>
								NASA ID: {selectedImage.nasa_id} • {selectedImage.center} •{' '}
								{formatDate(selectedImage.date_created)}
							</DialogDescription>
						</DialogHeader>

						<div className='space-y-6'>
							{/* Media Display */}
							<div className='relative aspect-video overflow-hidden rounded-lg bg-black'>
								{selectedImage.media_type === 'image' && selectedImage.href && (
									<img
										src={selectedImage.href}
										alt={selectedImage.title}
										className='w-full h-full object-contain'
									/>
								)}
								{selectedImage.media_type === 'video' && selectedImage.href && (
									<video
										src={selectedImage.href}
										controls
										className='w-full h-full'
										poster={selectedImage.render}
									/>
								)}
								{selectedImage.media_type === 'audio' && selectedImage.href && (
									<div className='flex items-center justify-center h-full'>
										<audio controls src={selectedImage.href} className='w-full max-w-md' />
									</div>
								)}
							</div>

							{/* Details */}
							<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
								<div className='space-y-4'>
									<div>
										<h3 className='font-semibold mb-2'>Description</h3>
										<p className='text-sm text-muted-foreground'>{selectedImage.description}</p>
									</div>

									{selectedImage.keywords && selectedImage.keywords.length > 0 && (
										<div>
											<h3 className='font-semibold mb-2'>Keywords</h3>
											<div className='flex flex-wrap gap-2'>
												{selectedImage.keywords.map((keyword) => (
													<Badge key={keyword} variant='outline'>
														{keyword}
													</Badge>
												))}
											</div>
										</div>
									)}
								</div>

								<div className='space-y-4'>
									<div>
										<h3 className='font-semibold mb-2'>Details</h3>
										<div className='space-y-2 text-sm'>
											<div className='flex justify-between'>
												<span className='text-muted-foreground'>Media Type:</span>
												<Badge variant='outline' className='flex items-center gap-1'>
													{getMediaIcon(selectedImage.media_type)}
													{selectedImage.media_type}
												</Badge>
											</div>
											<div className='flex justify-between'>
												<span className='text-muted-foreground'>Center:</span>
												<span>{selectedImage.center}</span>
											</div>
											<div className='flex justify-between'>
												<span className='text-muted-foreground'>Date Created:</span>
												<span>{formatDate(selectedImage.date_created)}</span>
											</div>
											<div className='flex justify-between'>
												<span className='text-muted-foreground'>NASA ID:</span>
												<span className='font-mono text-xs'>{selectedImage.nasa_id}</span>
											</div>
										</div>
									</div>

									<div className='space-y-2'>
										{selectedImage.href && (
											<Button asChild className='w-full'>
												<a
													href={selectedImage.href}
													target='_blank'
													rel='noopener noreferrer'
													download
												>
													<Download className='h-4 w-4 mr-2' />
													Download Original
												</a>
											</Button>
										)}
										<Button variant='outline' className='w-full' asChild>
											<a
												href={`https://images.nasa.gov/details-${selectedImage.nasa_id}`}
												target='_blank'
												rel='noopener noreferrer'
											>
												<ExternalLink className='h-4 w-4 mr-2' />
												View on NASA
											</a>
										</Button>
									</div>
								</div>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
