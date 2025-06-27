// Mock axios before importing the service
const mockNasaApi = {
    get: jest.fn(),
    interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
    },
};

const mockSpaceApi = {
    get: jest.fn(),
};

jest.mock('axios', () => ({
    create: jest.fn((config) => {
        // Return different instances based on config
        if (config && config.baseURL && config.baseURL.includes('nasa.gov')) {
            return mockNasaApi;
        }
        return mockSpaceApi;
    }),
    get: jest.fn(),
}));

const axios = require('axios');
const { getApod, getISSPosition } = require('../services/nasaService');

describe('NASA Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getApod', () => {
        it('should fetch APOD data successfully', async () => {
            const mockData = {
                data: {
                    title: 'Test APOD',
                    explanation: 'Test explanation',
                    url: 'https://example.com/image.jpg',
                    date: '2025-06-27',
                    media_type: 'image',
                },
            };

            mockNasaApi.get.mockResolvedValueOnce(mockData);

            const result = await getApod();

            expect(result).toEqual(mockData.data);
            expect(mockNasaApi.get).toHaveBeenCalledWith('/planetary/apod', { params: {} });
        });

        it('should fetch APOD data for specific date', async () => {
            const testDate = '2025-01-01';
            const mockData = {
                data: {
                    title: 'Historical APOD',
                    explanation: 'Historical explanation',
                    url: 'https://example.com/historical.jpg',
                    date: testDate,
                    media_type: 'image',
                },
            };

            mockNasaApi.get.mockResolvedValueOnce(mockData);

            const result = await getApod(testDate);

            expect(result).toEqual(mockData.data);
            expect(mockNasaApi.get).toHaveBeenCalledWith('/planetary/apod', { params: { date: testDate } });
        });

        it('should handle NASA API errors', async () => {
            const error = new Error('NASA API Error');
            error.response = {
                status: 403,
                data: {
                    error: {
                        code: 'API_KEY_INVALID',
                        message: 'Invalid API key',
                    },
                },
            };

            mockNasaApi.get.mockRejectedValueOnce(error);

            await expect(getApod()).rejects.toThrow('Failed to fetch APOD: NASA API Error');
        });
    });

    describe('getISSPosition', () => {
        it('should fetch ISS position successfully', async () => {
            const mockData = {
                data: {
                    latitude: 12.345,
                    longitude: 67.89,
                    timestamp: 1640995200,
                    altitude: 400,
                    velocity: 27600,
                    visibility: 'daylight',
                    units: 'kilometers'
                },
            };

            mockSpaceApi.get.mockResolvedValueOnce(mockData);

            const result = await getISSPosition();

            expect(result).toEqual({
                message: "success",
                timestamp: 1640995200,
                iss_position: {
                    latitude: "12.345",
                    longitude: "67.89"
                },
                altitude: 400,
                velocity: 27600,
                visibility: 'daylight',
                units: 'kilometers'
            });
            expect(mockSpaceApi.get).toHaveBeenCalledWith('https://api.wheretheiss.at/v1/satellites/25544');
        });

        it('should handle ISS API errors and fallback', async () => {
            const primaryError = new Error('Primary ISS API Error');
            const fallbackData = {
                data: {
                    iss_position: {
                        latitude: '12.345',
                        longitude: '67.890',
                    },
                    timestamp: 1640995200,
                    message: 'success',
                },
            };

            // First call fails, second call (fallback) succeeds
            mockSpaceApi.get
                .mockRejectedValueOnce(primaryError)
                .mockResolvedValueOnce(fallbackData);

            const result = await getISSPosition();

            expect(result).toEqual(fallbackData.data);
            expect(mockSpaceApi.get).toHaveBeenCalledTimes(2);
            expect(mockSpaceApi.get).toHaveBeenNthCalledWith(1, 'https://api.wheretheiss.at/v1/satellites/25544');
            expect(mockSpaceApi.get).toHaveBeenNthCalledWith(2, 'http://api.open-notify.org/iss-now.json');
        });

        it('should handle both ISS API failures', async () => {
            const primaryError = new Error('Primary ISS API Error');
            const fallbackError = new Error('Fallback ISS API Error');

            mockSpaceApi.get
                .mockRejectedValueOnce(primaryError)
                .mockRejectedValueOnce(fallbackError);

            await expect(getISSPosition()).rejects.toThrow('Failed to fetch ISS position: Primary ISS API Error');
        });
    });
});
