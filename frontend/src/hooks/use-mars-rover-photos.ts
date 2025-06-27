import { useState, useEffect } from 'react';
import { NasaApiService } from '@/services/nasa-api';
import { MarsRoverPhoto } from '@/types/nasa';
import { getErrorMessage } from '@/lib/utils';

export function useMarsRoverPhotos(
	rover: 'curiosity' | 'opportunity' | 'spirit',
	sol?: number,
	earthDate?: string,
	camera?: string,
	page: number = 1
) {
	const [data, setData] = useState<MarsRoverPhoto[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchPhotos() {
			try {
				setLoading(true);
				setError(null);
				const response = await NasaApiService.getMarsRoverPhotos(rover, sol, earthDate, camera, page);
				setData(response.photos);
			} catch (err) {
				setError(getErrorMessage(err));
			} finally {
				setLoading(false);
			}
		}

		fetchPhotos();
	}, [rover, sol, earthDate, camera, page]);

	return { data, loading, error };
}
