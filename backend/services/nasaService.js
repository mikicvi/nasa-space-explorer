const axios = require('axios');

const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
const NASA_BASE_URL = process.env.NASA_API_BASE_URL || 'https://api.nasa.gov';

// Create axios instance for NASA API
const nasaApi = axios.create({
    baseURL: NASA_BASE_URL,
    timeout: 30000,
    params: {
        api_key: NASA_API_KEY,
    },
});

// Create axios instance for other space APIs
const spaceApi = axios.create({
    timeout: 30000,
});

// Add request interceptor for logging
nasaApi.interceptors.request.use(
    (config) => {
        console.log(`NASA API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('NASA API Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
nasaApi.interceptors.response.use(
    (response) => {
        console.log(`NASA API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('NASA API Response Error:', error.response?.status, error.response?.data || error.message);
        return Promise.reject(error);
    }
);

class NasaService {
    // APOD (Astronomy Picture of the Day)
    static async getApod(date) {
        try {
            const params = date ? { date } : {};
            const response = await nasaApi.get('/planetary/apod', { params });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch APOD: ${error.message}`);
        }
    }

    static async getApodRange(startDate, endDate) {
        try {
            const response = await nasaApi.get('/planetary/apod', {
                params: { start_date: startDate, end_date: endDate },
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch APOD range: ${error.message}`);
        }
    }

    // Mars Rover Photos
    static async getMarsRoverPhotos(rover, sol, earthDate, camera, page = 1) {
        try {
            const params = { page };

            if (sol) params.sol = sol;
            if (earthDate) params.earth_date = earthDate;
            if (camera) params.camera = camera;

            const response = await nasaApi.get(`/mars-photos/api/v1/rovers/${rover}/photos`, {
                params,
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch Mars rover photos: ${error.message}`);
        }
    }

    static async getLatestMarsRoverPhotos(rover) {
        try {
            const response = await nasaApi.get(`/mars-photos/api/v1/rovers/${rover}/latest_photos`);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch latest Mars rover photos: ${error.message}`);
        }
    }

    // Near Earth Objects
    static async getNearEarthObjects(startDate, endDate) {
        try {
            const response = await nasaApi.get('/neo/rest/v1/feed', {
                params: { start_date: startDate, end_date: endDate },
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch Near Earth Objects: ${error.message}`);
        }
    }

    static async getNeoById(asteroidId) {
        try {
            const response = await nasaApi.get(`/neo/rest/v1/neo/${asteroidId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch NEO by ID: ${error.message}`);
        }
    }

    // NASA Image and Video Library
    static async searchImages(query, mediaType, page = 1) {
        try {
            const params = { q: query, page };
            if (mediaType) params.media_type = mediaType;

            const response = await spaceApi.get('https://images-api.nasa.gov/search', { params });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to search NASA images: ${error.message}`);
        }
    }

    // ISS Location
    static async getISSPosition() {
        try {
            // Use Where the ISS at? API as primary source (more reliable)
            const response = await spaceApi.get('https://api.wheretheiss.at/v1/satellites/25544');

            // Transform the response to match the expected format
            const data = response.data;
            return {
                message: "success",
                timestamp: data.timestamp,
                iss_position: {
                    latitude: data.latitude.toString(),
                    longitude: data.longitude.toString()
                },
                // Additional data from the better API
                altitude: data.altitude,
                velocity: data.velocity,
                visibility: data.visibility,
                units: data.units
            };
        } catch (error) {
            // Fallback to Open Notify API if available
            try {
                const fallbackResponse = await spaceApi.get('http://api.open-notify.org/iss-now.json');
                return fallbackResponse.data;
            } catch (fallbackError) {
                throw new Error(`Failed to fetch ISS position: ${error.message}`);
            }
        }
    }

    static async getISSPassTimes(latitude, longitude, altitude) {
        try {
            // Note: The Open Notify API's pass times endpoint has been discontinued
            // We'll use the Where the ISS at? API to get current position and provide
            // a helpful message about the service being unavailable

            // Get current ISS position for context
            const positionResponse = await spaceApi.get('https://api.wheretheiss.at/v1/satellites/25544');

            return {
                message: "ISS pass times prediction service is currently unavailable. The original Open Notify API endpoint has been discontinued.",
                alternative: "You can track the ISS in real-time using the position data above, or visit https://spotthestation.nasa.gov/ for pass predictions.",
                current_iss_position: positionResponse.data,
                response: [] // Empty array to maintain compatibility
            };
        } catch (error) {
            throw new Error(`Failed to fetch ISS data: ${error.message}`);
        }
    }

    // SpaceX API for launches
    static async getUpcomingLaunches() {
        try {
            const response = await spaceApi.get('https://api.spacexdata.com/v4/launches/upcoming');
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch upcoming launches: ${error.message}`);
        }
    }

    static async getLatestLaunch() {
        try {
            const response = await spaceApi.get('https://api.spacexdata.com/v4/launches/latest');
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch latest launch: ${error.message}`);
        }
    }

    static async getPastLaunches(limit = 10) {
        try {
            const response = await spaceApi.get('https://api.spacexdata.com/v4/launches/past', {
                params: { limit },
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch past launches: ${error.message}`);
        }
    }

    // Astronauts
    static async getAstronauts() {
        try {
            const response = await spaceApi.get('https://ll.thespacedevs.com/2.2.0/astronaut/');
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch astronauts: ${error.message}`);
        }
    }

    // Space News
    static async getSpaceNews(limit = 10) {
        try {
            const response = await spaceApi.get('https://api.spaceflightnewsapi.net/v4/articles/', {
                params: { limit },
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch space news: ${error.message}`);
        }
    }

    // Earth Imagery
    static async getEarthImagery(lat, lon, date, dim) {
        try {
            const params = { lat, lon };
            if (date) params.date = date;
            if (dim) params.dim = dim;

            const response = await nasaApi.get('/planetary/earth/imagery', { params });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch Earth imagery: ${error.message}`);
        }
    }
}

module.exports = {
    getApod: NasaService.getApod,
    getApodRange: NasaService.getApodRange,
    getMarsRoverPhotos: NasaService.getMarsRoverPhotos,
    getLatestMarsRoverPhotos: NasaService.getLatestMarsRoverPhotos,
    getNearEarthObjects: NasaService.getNearEarthObjects,
    getNeoById: NasaService.getNeoById,
    searchImages: NasaService.searchImages,
    getISSPosition: NasaService.getISSPosition,
    getISSPassTimes: NasaService.getISSPassTimes,
    getUpcomingLaunches: NasaService.getUpcomingLaunches,
    getLatestLaunch: NasaService.getLatestLaunch,
    getPastLaunches: NasaService.getPastLaunches,
    getAstronauts: NasaService.getAstronauts,
    getSpaceNews: NasaService.getSpaceNews,
    getEarthImagery: NasaService.getEarthImagery,
};
