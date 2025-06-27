import { useState, useEffect } from 'react';
import { NasaApiService } from '@/services/nasa-api';
import { ApodData } from '@/types/nasa';
import { getErrorMessage } from '@/lib/utils';

export function useApod(date?: string) {
	const [data, setData] = useState<ApodData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchApod() {
			try {
				setLoading(true);
				setError(null);
				const apodData = await NasaApiService.getApod(date);
				setData(apodData);
			} catch (err) {
				setError(getErrorMessage(err));
			} finally {
				setLoading(false);
			}
		}

		fetchApod();
	}, [date]);

	return {
		data,
		loading,
		error,
		refetch: () => {
			setLoading(true);
			setError(null);
		},
	};
}
