import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingGridProps {
	count?: number;
	className?: string;
}

export function LoadingGrid({ count = 8, className = '' }: LoadingGridProps) {
	return (
		<div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
			{Array.from({ length: count }).map((_, i) => (
				<div key={i} className='space-y-3'>
					<Skeleton className='h-48 w-full rounded-lg' />
					<div className='space-y-2'>
						<Skeleton className='h-4 w-3/4' />
						<Skeleton className='h-4 w-1/2' />
					</div>
				</div>
			))}
		</div>
	);
}

interface LoadingListProps {
	count?: number;
	className?: string;
}

export function LoadingList({ count = 5, className = '' }: LoadingListProps) {
	return (
		<div className={`space-y-4 ${className}`}>
			{Array.from({ length: count }).map((_, i) => (
				<div
					key={i}
					className='flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 p-4 border rounded-lg'
				>
					<Skeleton className='h-32 w-full md:w-48 rounded-lg' />
					<div className='flex-1 space-y-3'>
						<Skeleton className='h-6 w-3/4' />
						<Skeleton className='h-4 w-full' />
						<Skeleton className='h-4 w-2/3' />
						<div className='flex space-x-2'>
							<Skeleton className='h-6 w-16' />
							<Skeleton className='h-6 w-16' />
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

interface LoadingCardProps {
	count?: number;
	className?: string;
}

export function LoadingCard({ count = 1, className = '' }: LoadingCardProps) {
	return (
		<div className={`space-y-4 ${className}`}>
			{Array.from({ length: count }).map((_, i) => (
				<div key={i} className='p-6 border rounded-lg space-y-4'>
					<div className='flex items-center justify-between'>
						<Skeleton className='h-6 w-1/3' />
						<Skeleton className='h-8 w-20' />
					</div>
					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-2/3' />
					<div className='flex space-x-2'>
						<Skeleton className='h-6 w-16' />
						<Skeleton className='h-6 w-16' />
						<Skeleton className='h-6 w-16' />
					</div>
				</div>
			))}
		</div>
	);
}

interface LoadingStatsProps {
	count?: number;
	className?: string;
}

export function LoadingStats({ count = 4, className = '' }: LoadingStatsProps) {
	return (
		<div className={`grid grid-cols-2 md:grid-cols-${count} gap-4 ${className}`}>
			{Array.from({ length: count }).map((_, i) => (
				<div key={i} className='p-6 border rounded-lg text-center space-y-2'>
					<Skeleton className='h-8 w-16 mx-auto' />
					<Skeleton className='h-4 w-20 mx-auto' />
				</div>
			))}
		</div>
	);
}
