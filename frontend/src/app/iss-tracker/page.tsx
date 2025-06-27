'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Satellite, MapPin, Clock, Globe, RefreshCw, Target, Activity, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { NasaApiService } from '@/services/nasa-api';
import type { ISSPosition } from '@/types/nasa';
import { formatCoordinates } from '@/lib/utils';

interface ISSPassTime {
	duration: number;
	risetime: number;
}

interface LocationCoords {
	latitude: number;
	longitude: number;
	name?: string;
}

// Popular cities for quick selection
const POPULAR_LOCATIONS: LocationCoords[] = [
	{ latitude: 40.7128, longitude: -74.006, name: 'New York, USA' },
	{ latitude: 51.5074, longitude: -0.1278, name: 'London, UK' },
	{ latitude: 35.6762, longitude: 139.6503, name: 'Tokyo, Japan' },
	{ latitude: -33.8688, longitude: 151.2093, name: 'Sydney, Australia' },
	{ latitude: 48.8566, longitude: 2.3522, name: 'Paris, France' },
	{ latitude: 55.7558, longitude: 37.6173, name: 'Moscow, Russia' },
];

export default function ISSTrackerPage() {
	const [issPosition, setIssPosition] = useState<ISSPosition | null>(null);
	const [passTimes, setPassTimes] = useState<ISSPassTime[]>([]);
	const [passTimesMessage, setPassTimesMessage] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
	const [manualLocation, setManualLocation] = useState<LocationCoords>({ latitude: 0, longitude: 0 });
	const [locationInput, setLocationInput] = useState({ lat: '', lon: '' });
	const [autoRefresh, setAutoRefresh] = useState(false); // Changed to false by default
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	// Fetch ISS current position
	const fetchISSPosition = async () => {
		try {
			const position = await NasaApiService.getISSPosition();
			setIssPosition(position);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch ISS position');
		}
	};

	// Fetch ISS pass times for a location
	const fetchPassTimes = async (location: LocationCoords) => {
		setLoading(true);
		try {
			const response = await NasaApiService.getISSPassTimes(location.latitude, location.longitude);
			setPassTimes(response.response || []);
			setPassTimesMessage(response.message || null);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch pass times');
			setPassTimes([]);
			setPassTimesMessage(null);
		} finally {
			setLoading(false);
		}
	};

	// Get user's current location
	const getUserLocation = () => {
		if (!navigator.geolocation) {
			setError('Geolocation is not supported by this browser');
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const location = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					name: 'Your Location',
				};
				setUserLocation(location);
				fetchPassTimes(location);
			},
			(error) => {
				setError('Unable to get your location: ' + error.message);
			}
		);
	};

	// Handle manual location input
	const handleManualLocation = () => {
		const lat = parseFloat(locationInput.lat);
		const lon = parseFloat(locationInput.lon);

		if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
			setError('Please enter valid coordinates (lat: -90 to 90, lon: -180 to 180)');
			return;
		}

		const location = { latitude: lat, longitude: lon, name: 'Manual Location' };
		setManualLocation(location);
		fetchPassTimes(location);
	};

	// Handle popular location selection
	const handlePopularLocation = (location: LocationCoords) => {
		setManualLocation(location);
		setLocationInput({ lat: location.latitude.toString(), lon: location.longitude.toString() });
		fetchPassTimes(location);
	};

	// Auto-refresh ISS position
	useEffect(() => {
		fetchISSPosition();

		if (autoRefresh) {
			intervalRef.current = setInterval(fetchISSPosition, 60000); // Update every 60 seconds (changed from 10s)
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [autoRefresh]);

	// Format pass time
	const formatPassTime = (timestamp: number) => {
		const date = new Date(timestamp * 1000);
		return {
			date: date.toLocaleDateString(),
			time: date.toLocaleTimeString(),
			relative: getRelativeTime(date),
		};
	};

	// Get relative time
	const getRelativeTime = (date: Date) => {
		const now = new Date();
		const diffMs = date.getTime() - now.getTime();
		const diffMinutes = Math.floor(diffMs / (1000 * 60));
		const diffHours = Math.floor(diffMinutes / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffMs < 0) return 'Passed';
		if (diffMinutes < 60) return `In ${diffMinutes} minutes`;
		if (diffHours < 24) return `In ${diffHours} hours`;
		return `In ${diffDays} days`;
	};

	// Format duration
	const formatDuration = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}m ${remainingSeconds}s`;
	};

	return (
		<div className='container mx-auto px-4 py-8 space-y-8'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className='text-center space-y-4'
			>
				<h1 className='text-4xl font-bold bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent'>
					ISS Live Tracker
				</h1>
				<p className='text-muted-foreground max-w-2xl mx-auto'>
					Track the International Space Station in real-time as it orbits Earth at 17,500 mph. Find out when
					it will pass over your location. Auto-refresh is disabled by default to prevent rate limiting.
				</p>
			</motion.div>

			{/* Error Alert */}
			{error && (
				<Alert variant='destructive'>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{/* ISS Current Position */}
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<Satellite className='h-5 w-5' />
						Current ISS Position
						<Button variant='outline' size='sm' onClick={fetchISSPosition} className='ml-auto'>
							<RefreshCw className='h-4 w-4 mr-2' />
							Refresh
						</Button>
					</CardTitle>
					<CardDescription>Real-time location of the International Space Station</CardDescription>
				</CardHeader>
				<CardContent>
					{issPosition ? (
						<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
							<div className='space-y-4'>
								<div>
									<h3 className='font-semibold mb-2'>Coordinates</h3>
									<div className='space-y-2'>
										<div className='flex items-center gap-2'>
											<MapPin className='h-4 w-4 text-muted-foreground' />
											<span className='text-sm'>
												Lat: {parseFloat(issPosition.iss_position.latitude).toFixed(4)}°
											</span>
										</div>
										<div className='flex items-center gap-2'>
											<Globe className='h-4 w-4 text-muted-foreground' />
											<span className='text-sm'>
												Lon: {parseFloat(issPosition.iss_position.longitude).toFixed(4)}°
											</span>
										</div>
									</div>
								</div>
							</div>

							<div className='space-y-4'>
								<div>
									<h3 className='font-semibold mb-2'>Status</h3>
									<div className='space-y-2'>
										<div className='flex items-center gap-2'>
											<Activity className='h-4 w-4 text-green-500' />
											<Badge variant='default'>Active</Badge>
										</div>
										<div className='flex items-center gap-2'>
											<Clock className='h-4 w-4 text-muted-foreground' />
											<span className='text-sm'>
												Updated: {new Date(issPosition.timestamp * 1000).toLocaleTimeString()}
											</span>
										</div>
									</div>
								</div>
							</div>

							<div className='space-y-4'>
								<div>
									<h3 className='font-semibold mb-2'>Mission Info</h3>
									<div className='space-y-2'>
										<div className='flex items-center gap-2'>
											<Users className='h-4 w-4 text-muted-foreground' />
											<span className='text-sm'>~7 Crew Members</span>
										</div>
										<div className='flex items-center gap-2'>
											<Zap className='h-4 w-4 text-muted-foreground' />
											<span className='text-sm'>17,500 mph</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className='space-y-3'>
							<Skeleton className='h-6 w-48' />
							<Skeleton className='h-4 w-64' />
							<Skeleton className='h-4 w-56' />
						</div>
					)}

					{/* Auto-refresh toggle */}
					<div className='mt-6 flex items-center gap-2'>
						<Button variant='outline' size='sm' onClick={() => setAutoRefresh(!autoRefresh)}>
							{autoRefresh ? 'Disable' : 'Enable'} Auto-refresh
						</Button>
						<span className='text-sm text-muted-foreground'>
							{autoRefresh ? 'Updates every 60 seconds' : 'Manual refresh only'}
						</span>
					</div>
				</CardContent>
			</Card>

			{/* Location Selection & Pass Times */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
				{/* Location Selection */}
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center gap-2'>
							<Target className='h-5 w-5' />
							Select Location
						</CardTitle>
						<CardDescription>Choose a location to see when the ISS will pass overhead</CardDescription>
					</CardHeader>
					<CardContent className='space-y-6'>
						{/* Current Location */}
						<div>
							<Button onClick={getUserLocation} className='w-full'>
								<MapPin className='h-4 w-4 mr-2' />
								Use My Current Location
							</Button>
						</div>

						{/* Manual Location Input */}
						<div className='space-y-4'>
							<h3 className='font-medium'>Enter Coordinates</h3>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<label className='text-sm font-medium mb-2 block'>Latitude</label>
									<Input
										type='number'
										placeholder='e.g., 40.7128'
										value={locationInput.lat}
										onChange={(e) => setLocationInput({ ...locationInput, lat: e.target.value })}
										step='any'
										min='-90'
										max='90'
									/>
								</div>
								<div>
									<label className='text-sm font-medium mb-2 block'>Longitude</label>
									<Input
										type='number'
										placeholder='e.g., -74.0060'
										value={locationInput.lon}
										onChange={(e) => setLocationInput({ ...locationInput, lon: e.target.value })}
										step='any'
										min='-180'
										max='180'
									/>
								</div>
							</div>
							<Button onClick={handleManualLocation} className='w-full' variant='outline'>
								Get Pass Times
							</Button>
						</div>

						{/* Popular Locations */}
						<div className='space-y-4'>
							<h3 className='font-medium'>Popular Locations</h3>
							<div className='grid grid-cols-1 gap-2'>
								{POPULAR_LOCATIONS.map((location, index) => (
									<Button
										key={index}
										variant='ghost'
										className='justify-start h-auto p-3'
										onClick={() => handlePopularLocation(location)}
									>
										<div className='text-left'>
											<div className='font-medium'>{location.name}</div>
											<div className='text-xs text-muted-foreground'>
												{location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°
											</div>
										</div>
									</Button>
								))}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Pass Times */}
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center gap-2'>
							<Clock className='h-5 w-5' />
							Upcoming Passes
						</CardTitle>
						<CardDescription>When the ISS will be visible from your selected location</CardDescription>
					</CardHeader>
					<CardContent>
						{loading ? (
							<div className='space-y-4'>
								{Array.from({ length: 3 }).map((_, i) => (
									<div key={i} className='space-y-2'>
										<Skeleton className='h-4 w-full' />
										<Skeleton className='h-4 w-3/4' />
									</div>
								))}
							</div>
						) : passTimesMessage ? (
							<Alert>
								<Clock className='h-4 w-4' />
								<AlertDescription className='space-y-2'>
									<p>{passTimesMessage}</p>
									<p className='text-sm'>
										For ISS pass predictions, please visit{' '}
										<a
											href='https://spotthestation.nasa.gov/'
											target='_blank'
											rel='noopener noreferrer'
											className='text-blue-500 hover:text-blue-700 underline'
										>
											NASA's Spot the Station
										</a>{' '}
										website.
									</p>
								</AlertDescription>
							</Alert>
						) : passTimes.length > 0 ? (
							<div className='space-y-4'>
								{passTimes.map((pass, index) => {
									const passTime = formatPassTime(pass.risetime);
									return (
										<Card key={index}>
											<CardContent className='p-4'>
												<div className='flex items-center justify-between'>
													<div>
														<div className='font-medium'>{passTime.date}</div>
														<div className='text-sm text-muted-foreground'>
															{passTime.time}
														</div>
													</div>
													<div className='text-right'>
														<Badge variant='outline'>{passTime.relative}</Badge>
														<div className='text-sm text-muted-foreground mt-1'>
															Duration: {formatDuration(pass.duration)}
														</div>
													</div>
												</div>
											</CardContent>
										</Card>
									);
								})}
							</div>
						) : (
							<div className='text-center py-8'>
								<Satellite className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
								<h3 className='text-lg font-semibold mb-2'>No Pass Times</h3>
								<p className='text-muted-foreground'>
									Select a location to see when the ISS will pass overhead.
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* ISS Facts */}
			<Card>
				<CardHeader>
					<CardTitle>About the International Space Station</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						<div className='text-center'>
							<div className='text-3xl font-bold text-blue-500'>408 km</div>
							<div className='text-sm text-muted-foreground'>Average Altitude</div>
						</div>
						<div className='text-center'>
							<div className='text-3xl font-bold text-green-500'>90 min</div>
							<div className='text-sm text-muted-foreground'>Orbital Period</div>
						</div>
						<div className='text-center'>
							<div className='text-3xl font-bold text-purple-500'>16</div>
							<div className='text-sm text-muted-foreground'>Orbits per Day</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
