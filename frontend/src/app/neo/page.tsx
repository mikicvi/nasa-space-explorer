'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, AlertTriangle, Calendar, Ruler, Zap, Search, Filter, Eye, ExternalLink, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NasaApiService } from '@/services/nasa-api';
import type { NeoData } from '@/types/nasa';
import { formatDate, formatNumber } from '@/lib/utils';

export default function NearEarthObjectsPage() {
	const [neoData, setNeoData] = useState<Record<string, NeoData[]>>({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedNeo, setSelectedNeo] = useState<NeoData | null>(null);
	const [sortBy, setSortBy] = useState<'date' | 'size' | 'distance' | 'hazardous'>('date');
	const [filterHazardous, setFilterHazardous] = useState<'all' | 'hazardous' | 'safe'>('all');

	// Initialize with current week
	useEffect(() => {
		const today = new Date();
		const nextWeek = new Date(today);
		nextWeek.setDate(today.getDate() + 7);

		setStartDate(today.toISOString().split('T')[0]);
		setEndDate(nextWeek.toISOString().split('T')[0]);
	}, []);

	// Fetch NEO data
	const fetchNeoData = async () => {
		if (!startDate || !endDate) {
			setError('Please select both start and end dates');
			return;
		}

		const start = new Date(startDate);
		const end = new Date(endDate);
		const diffTime = Math.abs(end.getTime() - start.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays > 7) {
			setError('Date range cannot exceed 7 days due to API limitations');
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const response = await NasaApiService.getNearEarthObjects(startDate, endDate);
			setNeoData(response.near_earth_objects);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch NEO data');
			setNeoData({});
		} finally {
			setLoading(false);
		}
	};

	// Auto-fetch when dates change
	useEffect(() => {
		if (startDate && endDate) {
			fetchNeoData();
		}
	}, [startDate, endDate]);

	// Get all NEOs as flat array
	const getAllNeos = (): NeoData[] => {
		return Object.values(neoData).flat();
	};

	// Filter and sort NEOs
	const getFilteredNeos = (): NeoData[] => {
		let neos = getAllNeos();

		// Apply search filter
		if (searchQuery) {
			neos = neos.filter(
				(neo) => neo.name.toLowerCase().includes(searchQuery.toLowerCase()) || neo.id.includes(searchQuery)
			);
		}

		// Apply hazardous filter
		if (filterHazardous !== 'all') {
			neos = neos.filter((neo) =>
				filterHazardous === 'hazardous'
					? neo.is_potentially_hazardous_asteroid
					: !neo.is_potentially_hazardous_asteroid
			);
		}

		// Sort NEOs
		neos.sort((a, b) => {
			switch (sortBy) {
				case 'date':
					return (
						new Date(a.close_approach_data[0]?.close_approach_date || 0).getTime() -
						new Date(b.close_approach_data[0]?.close_approach_date || 0).getTime()
					);
				case 'size':
					return (
						b.estimated_diameter.kilometers.estimated_diameter_max -
						a.estimated_diameter.kilometers.estimated_diameter_max
					);
				case 'distance':
					return (
						parseFloat(a.close_approach_data[0]?.miss_distance.kilometers || '0') -
						parseFloat(b.close_approach_data[0]?.miss_distance.kilometers || '0')
					);
				case 'hazardous':
					return Number(b.is_potentially_hazardous_asteroid) - Number(a.is_potentially_hazardous_asteroid);
				default:
					return 0;
			}
		});

		return neos;
	};

	// Get statistics
	const getStatistics = () => {
		const allNeos = getAllNeos();
		const hazardous = allNeos.filter((neo) => neo.is_potentially_hazardous_asteroid);
		const largest = allNeos.reduce(
			(prev, current) =>
				prev.estimated_diameter.kilometers.estimated_diameter_max >
				current.estimated_diameter.kilometers.estimated_diameter_max
					? prev
					: current,
			allNeos[0]
		);
		const closest = allNeos.reduce((prev, current) => {
			const prevDistance = parseFloat(prev.close_approach_data[0]?.miss_distance.kilometers || 'Infinity');
			const currentDistance = parseFloat(current.close_approach_data[0]?.miss_distance.kilometers || 'Infinity');
			return prevDistance < currentDistance ? prev : current;
		}, allNeos[0]);

		return {
			total: allNeos.length,
			hazardous: hazardous.length,
			largest,
			closest,
		};
	};

	const statistics = getAllNeos().length > 0 ? getStatistics() : null;
	const filteredNeos = getFilteredNeos();

	// Format diameter
	const formatDiameter = (neo: NeoData) => {
		const min = neo.estimated_diameter.kilometers.estimated_diameter_min;
		const max = neo.estimated_diameter.kilometers.estimated_diameter_max;
		return `${min.toFixed(3)} - ${max.toFixed(3)} km`;
	};

	// Format distance
	const formatDistance = (distance: string) => {
		const km = parseFloat(distance);
		if (km > 1000000) {
			return `${(km / 1000000).toFixed(2)} million km`;
		}
		return `${formatNumber(km)} km`;
	};

	// Format velocity
	const formatVelocity = (velocity: string) => {
		return `${formatNumber(parseFloat(velocity))} km/h`;
	};

	return (
		<div className='container mx-auto px-4 py-8 space-y-8'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className='text-center space-y-4'
			>
				<h1 className='text-4xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent'>
					Near Earth Objects
				</h1>
				<p className='text-muted-foreground max-w-2xl mx-auto'>
					Monitor asteroids and comets that come close to Earth's orbit. Track potentially hazardous objects
					and learn about their characteristics and approach data.
				</p>
			</motion.div>

			{/* Date Selection */}
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<Calendar className='h-5 w-5' />
						Date Range Selection
					</CardTitle>
					<CardDescription>Select a date range to view Near Earth Objects (maximum 7 days)</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
						<div>
							<label className='text-sm font-medium mb-2 block'>Start Date</label>
							<Input type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)} />
						</div>
						<div>
							<label className='text-sm font-medium mb-2 block'>End Date</label>
							<Input type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)} />
						</div>
						<div className='flex items-end'>
							<Button onClick={fetchNeoData} disabled={loading} className='w-full'>
								{loading ? 'Loading...' : 'Search NEOs'}
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Error Alert */}
			{error && (
				<Alert variant='destructive'>
					<AlertTriangle className='h-4 w-4' />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{/* Statistics */}
			{statistics && (
				<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
					<Card>
						<CardContent className='p-6 text-center'>
							<div className='text-3xl font-bold text-blue-500'>{statistics.total}</div>
							<div className='text-sm text-muted-foreground'>Total Objects</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className='p-6 text-center'>
							<div className='text-3xl font-bold text-red-500'>{statistics.hazardous}</div>
							<div className='text-sm text-muted-foreground'>Potentially Hazardous</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className='p-6 text-center'>
							<div className='text-3xl font-bold text-green-500'>
								{statistics.largest
									? statistics.largest.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)
									: 0}
							</div>
							<div className='text-sm text-muted-foreground'>Largest (km)</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className='p-6 text-center'>
							<div className='text-3xl font-bold text-purple-500'>
								{statistics.closest
									? formatDistance(
											statistics.closest.close_approach_data[0]?.miss_distance.kilometers || '0'
									  ).split(' ')[0]
									: 0}
							</div>
							<div className='text-sm text-muted-foreground'>Closest (million km)</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Filters and Search */}
			{getAllNeos().length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center gap-2'>
							<Filter className='h-5 w-5' />
							Filters & Search
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
							<div>
								<label className='text-sm font-medium mb-2 block'>Search</label>
								<Input
									placeholder='Search by name or ID...'
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
							<div>
								<label className='text-sm font-medium mb-2 block'>Sort By</label>
								<Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='date'>Approach Date</SelectItem>
										<SelectItem value='size'>Size</SelectItem>
										<SelectItem value='distance'>Distance</SelectItem>
										<SelectItem value='hazardous'>Hazardous First</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<label className='text-sm font-medium mb-2 block'>Filter</label>
								<Select
									value={filterHazardous}
									onValueChange={(value: any) => setFilterHazardous(value)}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='all'>All Objects</SelectItem>
										<SelectItem value='hazardous'>Hazardous Only</SelectItem>
										<SelectItem value='safe'>Safe Only</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className='flex items-end'>
								<Button
									variant='outline'
									onClick={() => {
										setSearchQuery('');
										setSortBy('date');
										setFilterHazardous('all');
									}}
									className='w-full'
								>
									Clear Filters
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* NEO List */}
			<div className='space-y-4'>
				<div className='flex items-center justify-between'>
					<h2 className='text-2xl font-semibold'>
						{loading ? 'Loading...' : `${filteredNeos.length} Objects Found`}
					</h2>
				</div>

				{/* Loading State */}
				{loading && (
					<div className='space-y-4'>
						{Array.from({ length: 5 }).map((_, i) => (
							<Card key={i}>
								<CardContent className='p-6'>
									<div className='space-y-3'>
										<Skeleton className='h-6 w-3/4' />
										<Skeleton className='h-4 w-1/2' />
										<div className='flex gap-2'>
											<Skeleton className='h-6 w-20' />
											<Skeleton className='h-6 w-20' />
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}

				{/* NEO Cards */}
				{!loading && filteredNeos.length > 0 && (
					<AnimatePresence>
						<div className='space-y-4'>
							{filteredNeos.map((neo, index) => (
								<motion.div
									key={neo.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ delay: index * 0.1 }}
								>
									<Card className='hover:shadow-lg transition-all duration-300'>
										<CardContent className='p-6'>
											<div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
												<div className='space-y-3 flex-1'>
													<div className='flex items-start gap-3'>
														<div className='flex-1'>
															<h3 className='text-lg font-semibold'>{neo.name}</h3>
															<p className='text-sm text-muted-foreground'>
																ID: {neo.id}
															</p>
														</div>
														<div className='flex gap-2'>
															{neo.is_potentially_hazardous_asteroid && (
																<Badge
																	variant='destructive'
																	className='flex items-center gap-1'
																>
																	<AlertTriangle className='h-3 w-3' />
																	Hazardous
																</Badge>
															)}
															<Badge variant='outline'>
																H: {neo.absolute_magnitude_h}
															</Badge>
														</div>
													</div>

													<div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
														<div className='flex items-center gap-2'>
															<Ruler className='h-4 w-4 text-muted-foreground' />
															<span>Size: {formatDiameter(neo)}</span>
														</div>
														{neo.close_approach_data[0] && (
															<>
																<div className='flex items-center gap-2'>
																	<Target className='h-4 w-4 text-muted-foreground' />
																	<span>
																		Distance:{' '}
																		{formatDistance(
																			neo.close_approach_data[0].miss_distance
																				.kilometers
																		)}
																	</span>
																</div>
																<div className='flex items-center gap-2'>
																	<Zap className='h-4 w-4 text-muted-foreground' />
																	<span>
																		Speed:{' '}
																		{formatVelocity(
																			neo.close_approach_data[0].relative_velocity
																				.kilometers_per_hour
																		)}
																	</span>
																</div>
															</>
														)}
													</div>

													{neo.close_approach_data[0] && (
														<div className='flex items-center gap-2 text-sm'>
															<Calendar className='h-4 w-4 text-muted-foreground' />
															<span>
																Closest Approach:{' '}
																{formatDate(
																	neo.close_approach_data[0].close_approach_date
																)}
															</span>
														</div>
													)}
												</div>

												<div className='flex gap-2'>
													<Dialog>
														<DialogTrigger asChild>
															<Button
																variant='outline'
																onClick={() => setSelectedNeo(neo)}
															>
																<Eye className='h-4 w-4 mr-2' />
																Details
															</Button>
														</DialogTrigger>
													</Dialog>
													<Button variant='outline' asChild>
														<a
															href={neo.nasa_jpl_url}
															target='_blank'
															rel='noopener noreferrer'
														>
															<ExternalLink className='h-4 w-4 mr-2' />
															NASA JPL
														</a>
													</Button>
												</div>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							))}
						</div>
					</AnimatePresence>
				)}

				{/* Empty State */}
				{!loading && filteredNeos.length === 0 && getAllNeos().length > 0 && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className='text-center py-12'
					>
						<Search className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
						<h3 className='text-lg font-semibold mb-2'>No Objects Found</h3>
						<p className='text-muted-foreground mb-4'>Try adjusting your search criteria or filters.</p>
						<Button
							variant='outline'
							onClick={() => {
								setSearchQuery('');
								setFilterHazardous('all');
							}}
						>
							Clear Filters
						</Button>
					</motion.div>
				)}

				{/* No Data State */}
				{!loading && getAllNeos().length === 0 && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className='text-center py-12'
					>
						<Globe className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
						<h3 className='text-lg font-semibold mb-2'>No Data Available</h3>
						<p className='text-muted-foreground mb-4'>Select a date range to view Near Earth Objects.</p>
					</motion.div>
				)}
			</div>

			{/* NEO Detail Modal */}
			{selectedNeo && (
				<Dialog open={!!selectedNeo} onOpenChange={() => setSelectedNeo(null)}>
					<DialogContent className='max-w-4xl max-h-[90vh] overflow-auto'>
						<DialogHeader>
							<DialogTitle className='flex items-center gap-2'>
								{selectedNeo.name}
								{selectedNeo.is_potentially_hazardous_asteroid && (
									<Badge variant='destructive' className='flex items-center gap-1'>
										<AlertTriangle className='h-3 w-3' />
										Potentially Hazardous
									</Badge>
								)}
							</DialogTitle>
							<DialogDescription>Near Earth Object Details • ID: {selectedNeo.id}</DialogDescription>
						</DialogHeader>

						<Tabs defaultValue='overview' className='w-full'>
							<TabsList className='grid w-full grid-cols-2'>
								<TabsTrigger value='overview'>Overview</TabsTrigger>
								<TabsTrigger value='approaches'>Close Approaches</TabsTrigger>
							</TabsList>

							<TabsContent value='overview' className='space-y-6'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									<Card>
										<CardHeader>
											<CardTitle className='text-lg'>Physical Characteristics</CardTitle>
										</CardHeader>
										<CardContent className='space-y-4'>
											<div className='flex justify-between'>
												<span className='text-muted-foreground'>Absolute Magnitude:</span>
												<span>{selectedNeo.absolute_magnitude_h}</span>
											</div>
											<div className='flex justify-between'>
												<span className='text-muted-foreground'>Est. Diameter (km):</span>
												<span>{formatDiameter(selectedNeo)}</span>
											</div>
											<div className='flex justify-between'>
												<span className='text-muted-foreground'>Est. Diameter (m):</span>
												<span>
													{selectedNeo.estimated_diameter.meters.estimated_diameter_min.toFixed(
														0
													)}{' '}
													-{' '}
													{selectedNeo.estimated_diameter.meters.estimated_diameter_max.toFixed(
														0
													)}{' '}
													m
												</span>
											</div>
											<div className='flex justify-between'>
												<span className='text-muted-foreground'>Potentially Hazardous:</span>
												<Badge
													variant={
														selectedNeo.is_potentially_hazardous_asteroid
															? 'destructive'
															: 'secondary'
													}
												>
													{selectedNeo.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
												</Badge>
											</div>
										</CardContent>
									</Card>

									<Card>
										<CardHeader>
											<CardTitle className='text-lg'>Classification</CardTitle>
										</CardHeader>
										<CardContent className='space-y-4'>
											<div className='flex justify-between'>
												<span className='text-muted-foreground'>NEO Reference ID:</span>
												<span>{selectedNeo.neo_reference_id}</span>
											</div>
											<div className='flex justify-between'>
												<span className='text-muted-foreground'>Object Type:</span>
												<span>Near Earth Asteroid</span>
											</div>
											<div className='pt-4'>
												<Button asChild className='w-full'>
													<a
														href={selectedNeo.nasa_jpl_url}
														target='_blank'
														rel='noopener noreferrer'
													>
														<ExternalLink className='h-4 w-4 mr-2' />
														View on NASA JPL
													</a>
												</Button>
											</div>
										</CardContent>
									</Card>
								</div>
							</TabsContent>

							<TabsContent value='approaches' className='space-y-4'>
								{selectedNeo.close_approach_data.length > 0 ? (
									<div className='space-y-4'>
										{selectedNeo.close_approach_data.map((approach, index) => (
											<Card key={index}>
												<CardContent className='p-6'>
													<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
														<div>
															<h4 className='font-medium mb-2'>Date & Time</h4>
															<div className='text-sm space-y-1'>
																<div>{formatDate(approach.close_approach_date)}</div>
																<div className='text-muted-foreground'>
																	{approach.close_approach_date_full}
																</div>
															</div>
														</div>
														<div>
															<h4 className='font-medium mb-2'>Miss Distance</h4>
															<div className='text-sm space-y-1'>
																<div>
																	{formatDistance(approach.miss_distance.kilometers)}
																</div>
																<div className='text-muted-foreground'>
																	{approach.miss_distance.lunar} lunar distances
																</div>
															</div>
														</div>
														<div>
															<h4 className='font-medium mb-2'>Relative Velocity</h4>
															<div className='text-sm space-y-1'>
																<div>
																	{formatVelocity(
																		approach.relative_velocity.kilometers_per_hour
																	)}
																</div>
																<div className='text-muted-foreground'>
																	{approach.relative_velocity.kilometers_per_second}{' '}
																	km/s
																</div>
															</div>
														</div>
														<div>
															<h4 className='font-medium mb-2'>Orbiting Body</h4>
															<div className='text-sm'>
																<Badge variant='outline'>
																	{approach.orbiting_body}
																</Badge>
															</div>
														</div>
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								) : (
									<div className='text-center py-8'>
										<Calendar className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
										<h3 className='text-lg font-semibold mb-2'>No Approach Data</h3>
										<p className='text-muted-foreground'>
											No close approach data available for this object.
										</p>
									</div>
								)}
							</TabsContent>
						</Tabs>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
