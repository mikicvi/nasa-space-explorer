'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Calendar, Filter, Search, RefreshCw, Download, Eye, MapPin, Clock, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { NasaApiService } from '@/services/nasa-api';
import type { MarsRoverPhoto } from '@/types/nasa';
import { formatDate, formatDistanceToNow } from '@/lib/utils';

const ROVERS = [
	{ name: 'curiosity', displayName: 'Curiosity', status: 'Active', landingDate: '2012-08-05' },
	{ name: 'opportunity', displayName: 'Opportunity', status: 'Complete', landingDate: '2004-01-25' },
	{ name: 'spirit', displayName: 'Spirit', status: 'Complete', landingDate: '2004-01-04' },
];

const CAMERAS = [
	{ key: 'all', name: 'All Cameras', description: 'Show photos from all cameras' },
	{ key: 'fhaz', name: 'FHAZ', description: 'Front Hazard Avoidance Camera' },
	{ key: 'rhaz', name: 'RHAZ', description: 'Rear Hazard Avoidance Camera' },
	{ key: 'mast', name: 'MAST', description: 'Mast Camera' },
	{ key: 'chemcam', name: 'CHEMCAM', description: 'Chemistry and Camera Complex' },
	{ key: 'mahli', name: 'MAHLI', description: 'Mars Hand Lens Imager' },
	{ key: 'mardi', name: 'MARDI', description: 'Mars Descent Imager' },
	{ key: 'navcam', name: 'NAVCAM', description: 'Navigation Camera' },
];

export default function MarsRoversPage() {
	const [photos, setPhotos] = useState<MarsRoverPhoto[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedRover, setSelectedRover] = useState('curiosity');
	const [selectedCamera, setSelectedCamera] = useState('all');
	const [sol, setSol] = useState('');
	const [earthDate, setEarthDate] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedPhoto, setSelectedPhoto] = useState<MarsRoverPhoto | null>(null);
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

	const fetchPhotos = async () => {
		if (!selectedRover) return;

		setLoading(true);
		setError(null);

		try {
			let result: MarsRoverPhoto[] = [];

			if (sol || earthDate) {
				// Fetch photos for specific sol or earth date
				const response = await NasaApiService.getMarsRoverPhotos(
					selectedRover as 'curiosity' | 'opportunity' | 'spirit',
					sol ? parseInt(sol) : undefined,
					earthDate || undefined,
					selectedCamera === 'all' ? undefined : selectedCamera
				);
				result = response?.photos || [];
			} else {
				// Fetch latest photos
				const response = await NasaApiService.getLatestMarsRoverPhotos(
					selectedRover as 'curiosity' | 'opportunity' | 'spirit'
				);
				result = response?.photos || [];

				// Filter by camera if specified
				if (selectedCamera !== 'all') {
					result = result.filter((photo) => photo.camera.name.toLowerCase() === selectedCamera.toLowerCase());
				}
			}

			setPhotos(result);
		} catch (err) {
			console.error('Error fetching Mars rover photos:', err);
			setError(err instanceof Error ? err.message : 'Failed to fetch Mars rover photos');
			setPhotos([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPhotos();
	}, [selectedRover, selectedCamera]);

	const filteredPhotos = (photos || []).filter(
		(photo) =>
			searchQuery === '' ||
			photo.rover.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			photo.camera.full_name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleSearch = () => {
		fetchPhotos();
	};

	const clearFilters = () => {
		setSol('');
		setEarthDate('');
		setSearchQuery('');
		setSelectedCamera('all');
	};

	return (
		<div className='container mx-auto px-4 py-8 space-y-8'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className='text-center space-y-4'
			>
				<h1 className='text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent'>
					Mars Rover Photos
				</h1>
				<p className='text-muted-foreground max-w-2xl mx-auto'>
					Explore Mars through the eyes of NASA's robotic explorers. View stunning images from Curiosity,
					Opportunity, and Spirit rovers as they traverse the Martian landscape.
				</p>
			</motion.div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<Filter className='h-5 w-5' />
						Filters & Search
					</CardTitle>
					<CardDescription>
						Filter photos by rover, camera, date, or search through the collection
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-6'>
					{/* Rover Selection */}
					<Tabs value={selectedRover} onValueChange={setSelectedRover} className='w-full'>
						<TabsList className='grid w-full grid-cols-3'>
							{ROVERS.map((rover) => (
								<TabsTrigger key={rover.name} value={rover.name} className='flex items-center gap-2'>
									<Activity className='h-4 w-4' />
									{rover.displayName}
									<Badge
										variant={rover.status === 'Active' ? 'default' : 'secondary'}
										className='ml-1'
									>
										{rover.status}
									</Badge>
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>

					{/* Camera and Date Filters */}
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
						<div>
							<label className='text-sm font-medium mb-2 block'>Camera</label>
							<Select value={selectedCamera} onValueChange={setSelectedCamera}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{CAMERAS.map((camera) => (
										<SelectItem key={camera.key} value={camera.key}>
											<div>
												<div className='font-medium'>{camera.name}</div>
												<div className='text-xs text-muted-foreground'>
													{camera.description}
												</div>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div>
							<label className='text-sm font-medium mb-2 block'>Sol (Mars Day)</label>
							<Input
								type='number'
								placeholder='e.g., 1000'
								value={sol}
								onChange={(e) => setSol(e.target.value)}
							/>
						</div>

						<div>
							<label className='text-sm font-medium mb-2 block'>Earth Date</label>
							<Input type='date' value={earthDate} onChange={(e) => setEarthDate(e.target.value)} />
						</div>

						<div>
							<label className='text-sm font-medium mb-2 block'>Search</label>
							<div className='flex gap-2'>
								<Input
									placeholder='Search photos...'
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
								<Button onClick={handleSearch} size='sm' disabled={loading}>
									{loading ? (
										<RefreshCw className='h-4 w-4 animate-spin' />
									) : (
										<Search className='h-4 w-4' />
									)}
								</Button>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className='flex flex-wrap gap-2'>
						<Button onClick={handleSearch} disabled={loading}>
							{loading ? (
								<RefreshCw className='h-4 w-4 animate-spin mr-2' />
							) : (
								<Search className='h-4 w-4 mr-2' />
							)}
							Search Photos
						</Button>
						<Button variant='outline' onClick={clearFilters}>
							Clear Filters
						</Button>
						<Button variant='outline' onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
							{viewMode === 'grid' ? 'List View' : 'Grid View'}
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Error State */}
			{error && (
				<Alert variant='destructive'>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{/* Results */}
			<div className='space-y-4'>
				<div className='flex items-center justify-between'>
					<h2 className='text-2xl font-semibold'>
						{loading ? 'Loading...' : `${filteredPhotos.length} Photos Found`}
					</h2>
					{filteredPhotos.length > 0 && (
						<Badge variant='outline'>
							Rover: {ROVERS.find((r) => r.name === selectedRover)?.displayName}
						</Badge>
					)}
				</div>

				{/* Loading State */}
				{loading && (
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

				{/* Photos Grid/List */}
				{!loading && filteredPhotos.length > 0 && (
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
							{filteredPhotos.map((photo, index) => (
								<motion.div
									key={photo.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.1 }}
								>
									{viewMode === 'grid' ? (
										<Card className='overflow-hidden hover:shadow-lg transition-all duration-300 group'>
											<div className='relative aspect-square overflow-hidden'>
												<img
													src={photo.img_src}
													alt={`${photo.rover.name} - ${photo.camera.full_name}`}
													className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
													loading='lazy'
												/>
												<div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300' />
												<div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
													<Dialog>
														<DialogTrigger asChild>
															<Button
																size='sm'
																variant='secondary'
																onClick={() => setSelectedPhoto(photo)}
															>
																<Eye className='h-4 w-4' />
															</Button>
														</DialogTrigger>
													</Dialog>
												</div>
											</div>
											<CardContent className='p-4'>
												<div className='space-y-2'>
													<div className='flex items-center justify-between'>
														<Badge variant='outline'>{photo.camera.name}</Badge>
														<span className='text-xs text-muted-foreground'>
															Sol {photo.sol}
														</span>
													</div>
													<h3 className='font-medium text-sm'>{photo.camera.full_name}</h3>
													<div className='flex items-center gap-2 text-xs text-muted-foreground'>
														<Calendar className='h-3 w-3' />
														{formatDate(photo.earth_date)}
													</div>
													<div className='flex items-center gap-2 text-xs text-muted-foreground'>
														<MapPin className='h-3 w-3' />
														{photo.rover.name} Rover
													</div>
												</div>
											</CardContent>
										</Card>
									) : (
										<Card className='overflow-hidden hover:shadow-md transition-all duration-300'>
											<div className='flex flex-col md:flex-row'>
												<div className='md:w-48 h-48 md:h-auto relative overflow-hidden'>
													<img
														src={photo.img_src}
														alt={`${photo.rover.name} - ${photo.camera.full_name}`}
														className='w-full h-full object-cover'
														loading='lazy'
													/>
												</div>
												<CardContent className='flex-1 p-4'>
													<div className='space-y-3'>
														<div className='flex items-start justify-between'>
															<div>
																<h3 className='font-semibold'>
																	{photo.camera.full_name}
																</h3>
																<p className='text-sm text-muted-foreground'>
																	{photo.rover.name} Rover
																</p>
															</div>
															<Dialog>
																<DialogTrigger asChild>
																	<Button
																		size='sm'
																		variant='outline'
																		onClick={() => setSelectedPhoto(photo)}
																	>
																		<Eye className='h-4 w-4 mr-2' />
																		View
																	</Button>
																</DialogTrigger>
															</Dialog>
														</div>
														<div className='flex flex-wrap gap-2'>
															<Badge variant='outline'>{photo.camera.name}</Badge>
															<Badge variant='secondary'>Sol {photo.sol}</Badge>
														</div>
														<div className='grid grid-cols-2 gap-4 text-sm'>
															<div className='flex items-center gap-2'>
																<Calendar className='h-4 w-4 text-muted-foreground' />
																<span>{formatDate(photo.earth_date)}</span>
															</div>
															<div className='flex items-center gap-2'>
																<Clock className='h-4 w-4 text-muted-foreground' />
																<span>
																	{formatDistanceToNow(new Date(photo.earth_date))}{' '}
																	ago
																</span>
															</div>
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

				{/* Empty State */}
				{!loading && filteredPhotos.length === 0 && !error && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className='text-center py-12'
					>
						<Camera className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
						<h3 className='text-lg font-semibold mb-2'>No Photos Found</h3>
						<p className='text-muted-foreground mb-4'>
							Try adjusting your filters or search terms to find more photos.
						</p>
						<Button onClick={clearFilters} variant='outline'>
							Clear All Filters
						</Button>
					</motion.div>
				)}
			</div>

			{/* Photo Detail Modal */}
			{selectedPhoto && (
				<Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
					<DialogContent className='max-w-4xl max-h-[90vh] overflow-auto'>
						<DialogHeader>
							<DialogTitle>{selectedPhoto.camera.full_name}</DialogTitle>
							<DialogDescription>
								{selectedPhoto.rover.name} Rover • Sol {selectedPhoto.sol} •{' '}
								{formatDate(selectedPhoto.earth_date)}
							</DialogDescription>
						</DialogHeader>
						<div className='space-y-6'>
							<div className='relative aspect-video overflow-hidden rounded-lg'>
								<img
									src={selectedPhoto.img_src}
									alt={`${selectedPhoto.rover.name} - ${selectedPhoto.camera.full_name}`}
									className='w-full h-full object-contain bg-black'
								/>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div className='space-y-4'>
									<h4 className='font-semibold'>Camera Details</h4>
									<div className='space-y-2 text-sm'>
										<div className='flex justify-between'>
											<span className='text-muted-foreground'>Camera:</span>
											<span>{selectedPhoto.camera.full_name}</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-muted-foreground'>Camera ID:</span>
											<span>{selectedPhoto.camera.name}</span>
										</div>
									</div>
								</div>
								<div className='space-y-4'>
									<h4 className='font-semibold'>Mission Details</h4>
									<div className='space-y-2 text-sm'>
										<div className='flex justify-between'>
											<span className='text-muted-foreground'>Rover:</span>
											<span>{selectedPhoto.rover.name}</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-muted-foreground'>Sol:</span>
											<span>{selectedPhoto.sol}</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-muted-foreground'>Earth Date:</span>
											<span>{formatDate(selectedPhoto.earth_date)}</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-muted-foreground'>Status:</span>
											<Badge
												variant={
													selectedPhoto.rover.status === 'active' ? 'default' : 'secondary'
												}
											>
												{selectedPhoto.rover.status}
											</Badge>
										</div>
									</div>
								</div>
							</div>
							<div className='flex gap-2'>
								<Button asChild>
									<a href={selectedPhoto.img_src} target='_blank' rel='noopener noreferrer'>
										<Download className='h-4 w-4 mr-2' />
										Download Image
									</a>
								</Button>
								<Button variant='outline' onClick={() => setSelectedPhoto(null)}>
									Close
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
