import axios from 'axios';
import type {
	ApodData,
	MarsRoverPhoto,
	NeoData,
	ISSPosition,
	NasaImage,
	Launch,
	Astronaut,
	SpaceNews,
} from '@/types/nasa';

// Backend API base URL
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

// Create axios instance for backend API
const backendApi = axios.create({
	baseURL: `${BACKEND_BASE_URL}/api/nasa`,
	timeout: 30000,
});

// Simple cache for ISS position to prevent excessive API calls
const issPositionCache = {
	data: null as ISSPosition | null,
	timestamp: 0,
	ttl: 30000, // 30 seconds cache
};

// Response wrapper interface
interface ApiResponse<T> {
	success: boolean;
	data: T;
	error?: string;
}

export class NasaApiService {
	// Astronomy Picture of the Day
	static async getApod(date?: string): Promise<ApodData> {
		const params = date ? { date } : {};
		const response = await backendApi.get<ApiResponse<ApodData>>('/apod', { params });
		if (!response.data.success) {
			throw new Error(response.data.error || 'Failed to fetch APOD data');
		}
		return response.data.data;
	}

	static async getApodRange(startDate: string, endDate: string): Promise<ApodData[]> {
		const response = await backendApi.get<ApiResponse<ApodData[]>>('/apod', {
			params: { start_date: startDate, end_date: endDate },
		});
		if (!response.data.success) {
			throw new Error(response.data.error || 'Failed to fetch APOD range');
		}
		return response.data.data;
	}

	// Mars Rover Photos
	static async getMarsRoverPhotos(
		rover: 'curiosity' | 'opportunity' | 'spirit',
		sol?: number,
		earthDate?: string,
		camera?: string,
		page: number = 1
	): Promise<{ photos: MarsRoverPhoto[] }> {
		const params: any = { page };

		if (sol) params.sol = sol;
		if (earthDate) params.earth_date = earthDate;
		if (camera) params.camera = camera;

		const response = await backendApi.get<ApiResponse<{ photos: MarsRoverPhoto[] }>>(
			`/mars-rovers/${rover}/photos`,
			{ params }
		);
		if (!response.data.success) {
			throw new Error(response.data.error || 'Failed to fetch Mars rover photos');
		}
		return response.data.data;
	}

	static async getLatestMarsRoverPhotos(
		rover: 'curiosity' | 'opportunity' | 'spirit'
	): Promise<{ photos: MarsRoverPhoto[] }> {
		const response = await backendApi.get<ApiResponse<{ latest_photos: MarsRoverPhoto[] }>>(
			`/mars-rovers/${rover}/latest-photos`
		);
		if (!response.data.success) {
			throw new Error(response.data.error || 'Failed to fetch latest Mars rover photos');
		}
		// Transform the response to match the expected format
		return { photos: response.data.data.latest_photos || [] };
	}

	// Near Earth Objects
	static async getNearEarthObjects(
		startDate: string,
		endDate: string
	): Promise<{ near_earth_objects: Record<string, NeoData[]> }> {
		const response = await backendApi.get<ApiResponse<{ near_earth_objects: Record<string, NeoData[]> }>>('/neo', {
			params: { start_date: startDate, end_date: endDate },
		});
		if (!response.data.success) {
			throw new Error(response.data.error || 'Failed to fetch NEO data');
		}
		return response.data.data;
	}

	static async getNeoById(asteroidId: string): Promise<NeoData> {
		const response = await backendApi.get<ApiResponse<NeoData>>(`/neo/${asteroidId}`);
		if (!response.data.success) {
			throw new Error(response.data.error || 'Failed to fetch NEO details');
		}
		return response.data.data;
	}

	// NASA Image and Video Library
	static async searchImages(
		query: string,
		mediaType?: 'image' | 'video' | 'audio',
		page: number = 1
	): Promise<{ collection: { items: NasaImage[] } }> {
		const params: any = { q: query, page };
		if (mediaType) params.media_type = mediaType;

		const response = await backendApi.get<ApiResponse<{ collection: { items: NasaImage[] } }>>('/images', {
			params,
		});
		if (!response.data.success) {
			throw new Error(response.data.error || 'Failed to search images');
		}
		return response.data.data;
	}

	// ISS Location
	static async getISSPosition(): Promise<ISSPosition> {
		// Check cache first
		const now = Date.now();
		if (issPositionCache.data && now - issPositionCache.timestamp < issPositionCache.ttl) {
			return issPositionCache.data;
		}

		const response = await backendApi.get<ApiResponse<ISSPosition>>('/iss/position');
		if (!response.data.success) {
			throw new Error(response.data.error || 'Failed to fetch ISS position');
		}

		// Update cache
		issPositionCache.data = response.data.data;
		issPositionCache.timestamp = now;

		return response.data.data;
	}

	static async getISSPassTimes(
		latitude: number,
		longitude: number,
		altitude?: number
	): Promise<{
		message: string;
		request: { latitude: number; longitude: number; altitude: number; passes: number; datetime: number };
		response: Array<{ duration: number; risetime: number }>;
	}> {
		const params: any = { lat: latitude, lon: longitude };
		if (altitude) params.alt = altitude;

		const response = await backendApi.get<ApiResponse<any>>('/iss/pass-times', { params });
		if (!response.data.success) {
			throw new Error(response.data.error || 'Failed to fetch ISS pass times');
		}
		return response.data.data;
	}

	// Launch data
	static async getUpcomingLaunches(): Promise<Launch[]> {
		const response = await backendApi.get<ApiResponse<Launch[]>>('/launches/upcoming');
		if (!response.data.success) {
			throw new Error(response.data.error || 'Failed to fetch upcoming launches');
		}
		return response.data.data;
	}

	static async getLatestLaunch(): Promise<Launch> {
		const response = await backendApi.get<ApiResponse<Launch>>('/launches/latest');
		if (!response.data.success) {
			throw new Error(response.data.error || 'Failed to fetch latest launch');
		}
		return response.data.data;
	}

	static async getPastLaunches(limit: number = 10): Promise<Launch[]> {
		const response = await backendApi.get<ApiResponse<Launch[]>>('/launches/past', {
			params: { limit },
		});
		if (!response.data.success) {
			throw new Error(response.data.error || 'Failed to fetch past launches');
		}
		return response.data.data;
	}

	// Astronauts
	static async getAstronauts(): Promise<{ results: Astronaut[] }> {
		const response = await backendApi.get<ApiResponse<{ results: Astronaut[] }>>('/astronauts');
		if (!response.data.success) {
			throw new Error(response.data.error || 'Failed to fetch astronauts');
		}
		return response.data.data;
	}

	// Space News
	static async getSpaceNews(limit: number = 10): Promise<{ results: SpaceNews[] }> {
		const response = await backendApi.get<ApiResponse<{ results: SpaceNews[] }>>('/news', {
			params: { limit },
		});
		if (!response.data.success) {
			throw new Error(response.data.error || 'Failed to fetch space news');
		}
		return response.data.data;
	}

	// Earth Imagery
	static async getEarthImagery(
		lat: number,
		lon: number,
		date?: string,
		dim?: number
	): Promise<{ url: string; date: string }> {
		const params: any = { lat, lon };
		if (date) params.date = date;
		if (dim) params.dim = dim;

		const response = await backendApi.get<ApiResponse<{ url: string; date: string }>>('/earth/imagery', { params });
		if (!response.data.success) {
			throw new Error(response.data.error || 'Failed to fetch Earth imagery');
		}
		return response.data.data;
	}
}
