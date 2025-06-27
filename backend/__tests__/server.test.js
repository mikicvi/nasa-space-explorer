const request = require('supertest');

// Mock the NASA service before importing the server
jest.mock('../services/nasaService', () => ({
    getApod: jest.fn(),
    getISSPosition: jest.fn(),
    getMarsRoverPhotos: jest.fn(),
}));

const { getApod, getISSPosition, getMarsRoverPhotos } = require('../services/nasaService');
const app = require('../server');

describe('NASA Explorer Backend', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Setup mock responses
        getApod.mockResolvedValue({
            title: 'Test APOD',
            explanation: 'Test explanation',
            url: 'https://example.com/image.jpg',
            date: '2025-06-27',
            media_type: 'image',
        });

        getISSPosition.mockResolvedValue({
            iss_position: {
                latitude: '12.345',
                longitude: '67.890',
            },
            timestamp: 1640995200,
            message: 'success',
        });

        // Setup mock error for Mars rover with invalid rover
        getMarsRoverPhotos.mockImplementation((rover) => {
            if (rover === 'invalid') {
                throw new Error('Invalid rover specified');
            }
            return Promise.resolve([
                {
                    id: 123,
                    sol: 1000,
                    camera: { name: 'NAVCAM' },
                    img_src: 'https://example.com/mars.jpg',
                    earth_date: '2025-01-01',
                },
            ]);
        });
    });

    describe('Health Check', () => {
        it('should return health status', async () => {
            const response = await request(app).get('/health').expect(200);

            expect(response.body).toHaveProperty('status', 'OK');
            expect(response.body).toHaveProperty('timestamp');
            expect(response.body).toHaveProperty('uptime');
            expect(response.body).toHaveProperty('environment');
        });
    });

    describe('NASA API Routes', () => {
        describe('GET /api/nasa/apod', () => {
            it('should return APOD data', async () => {
                const response = await request(app).get('/api/nasa/apod').expect(200);

                expect(response.body).toHaveProperty('success', true);
                expect(response.body).toHaveProperty('data');
                expect(response.body.data).toHaveProperty('title');
                expect(response.body.data).toHaveProperty('explanation');
                expect(response.body.data).toHaveProperty('url');
            }, 15000);

            it('should handle date parameter', async () => {
                const testDate = '2025-01-01';
                getApod.mockResolvedValueOnce({
                    title: 'Historical APOD',
                    explanation: 'Historical explanation',
                    url: 'https://example.com/historical.jpg',
                    date: testDate,
                    media_type: 'image',
                });

                const response = await request(app).get(`/api/nasa/apod?date=${testDate}`).expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data.date).toBe(testDate);
            }, 15000);
        });

        describe('GET /api/nasa/iss/position', () => {
            it('should return ISS position data', async () => {
                const response = await request(app).get('/api/nasa/iss/position').expect(200);

                expect(response.body).toHaveProperty('success', true);
                expect(response.body).toHaveProperty('data');

                const issData = response.body.data;
                expect(issData).toHaveProperty('iss_position');
                expect(issData.iss_position).toHaveProperty('latitude');
                expect(issData.iss_position).toHaveProperty('longitude');
                expect(issData).toHaveProperty('timestamp');

                // Validate coordinate ranges
                expect(parseFloat(issData.iss_position.latitude)).toBeGreaterThanOrEqual(-90);
                expect(parseFloat(issData.iss_position.latitude)).toBeLessThanOrEqual(90);
                expect(parseFloat(issData.iss_position.longitude)).toBeGreaterThanOrEqual(-180);
                expect(parseFloat(issData.iss_position.longitude)).toBeLessThanOrEqual(180);
            }, 10000);
        });

        describe('GET /api/nasa/mars-rovers/photos', () => {
            it('should return Mars rover photos', async () => {
                const response = await request(app).get('/api/nasa/mars-rovers/curiosity/photos?sol=1000').expect(200);

                expect(response.body).toHaveProperty('success', true);
                expect(response.body).toHaveProperty('data');
                expect(Array.isArray(response.body.data)).toBe(true);
            }, 15000);

            it('should handle invalid rover parameter', async () => {
                const response = await request(app).get('/api/nasa/mars-rovers/invalid/photos?sol=1000').expect(500);

                expect(response.body).toHaveProperty('success', false);
                expect(response.body).toHaveProperty('error');
            });
        });
    });

    describe('Error Handling', () => {
        it('should return 404 for unknown routes', async () => {
            const response = await request(app).get('/api/unknown-route').expect(404);

            expect(response.body).toHaveProperty('error', 'Not found - /api/unknown-route');
        });

        it('should handle CORS properly', async () => {
            const response = await request(app).get('/health').set('Origin', 'http://localhost:3000').expect(200);

            expect(response.headers).toHaveProperty('access-control-allow-origin');
        });
    });
});
