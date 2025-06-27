import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, isValid } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Date formatting utilities
export function formatDate(date: string | Date, formatString: string = 'PPP'): string {
	try {
		const dateObj = typeof date === 'string' ? parseISO(date) : date;
		if (!isValid(dateObj)) return 'Invalid date';
		return format(dateObj, formatString);
	} catch {
		return 'Invalid date';
	}
}

export function formatRelativeDate(date: string | Date): string {
	try {
		const dateObj = typeof date === 'string' ? parseISO(date) : date;
		if (!isValid(dateObj)) return 'Invalid date';

		const now = new Date();
		const diffInMs = now.getTime() - dateObj.getTime();
		const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

		if (diffInDays === 0) return 'Today';
		if (diffInDays === 1) return 'Yesterday';
		if (diffInDays < 7) return `${diffInDays} days ago`;
		if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
		if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
		return `${Math.floor(diffInDays / 365)} years ago`;
	} catch {
		return 'Invalid date';
	}
}

// Number formatting utilities
export function formatNumber(num: number, options?: Intl.NumberFormatOptions): string {
	return new Intl.NumberFormat('en-US', options).format(num);
}

export function formatDistance(distanceKm: number): string {
	if (distanceKm < 1000) {
		return `${formatNumber(distanceKm, { maximumFractionDigits: 2 })} km`;
	}
	return `${formatNumber(distanceKm / 1000, { maximumFractionDigits: 2 })} thousand km`;
}

export function formatVelocity(velocityKmh: number): string {
	return `${formatNumber(velocityKmh, { maximumFractionDigits: 2 })} km/h`;
}

export function formatTemperature(tempCelsius: number): string {
	const fahrenheit = (tempCelsius * 9) / 5 + 32;
	return `${formatNumber(tempCelsius, { maximumFractionDigits: 1 })}°C (${formatNumber(fahrenheit, {
		maximumFractionDigits: 1,
	})}°F)`;
}

// URL and slug utilities
export function createSlug(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength).trim() + '...';
}

// Coordinate utilities
export function formatCoordinates(lat: number, lon: number): string {
	const latDir = lat >= 0 ? 'N' : 'S';
	const lonDir = lon >= 0 ? 'E' : 'W';
	return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lon).toFixed(4)}°${lonDir}`;
}

// Error handling utilities
export function getErrorMessage(error: unknown): string {
	if (error instanceof Error) return error.message;
	if (typeof error === 'string') return error;
	return 'An unknown error occurred';
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
	let timeout: NodeJS.Timeout;
	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}
