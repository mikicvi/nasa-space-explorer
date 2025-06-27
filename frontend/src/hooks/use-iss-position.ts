import { useState, useEffect } from 'react';
import { NasaApiService } from '@/services/nasa-api';
import { ISSPosition } from '@/types/nasa';
import { getErrorMessage } from '@/lib/utils';

export function useISSPosition(refreshInterval: number = 10000) {
	const [data, setData] = useState<ISSPosition | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchISSPosition() {
			try {
				setError(null);
				const position = await NasaApiService.getISSPosition();
				setData(position);
				setLoading(false);
			} catch (err) {
				setError(getErrorMessage(err));
				setLoading(false);
			}
		}

		fetchISSPosition();
		const interval = setInterval(fetchISSPosition, refreshInterval);

		return () => clearInterval(interval);
	}, [refreshInterval]);

	return { data, loading, error };
}
