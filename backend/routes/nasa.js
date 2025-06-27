const express = require('express');
const router = express.Router();
const {
    getApod,
    getApodRange,
    getMarsRoverPhotos,
    getLatestMarsRoverPhotos,
    getNearEarthObjects,
    getNeoById,
    searchImages,
    getISSPosition,
    getISSPassTimes,
    getUpcomingLaunches,
    getLatestLaunch,
    getPastLaunches,
    getAstronauts,
    getSpaceNews,
    getEarthImagery
} = require('../services/nasaService');

// Simple cache for ISS position to reduce API calls
const issPositionCache = {
    data: null,
    timestamp: 0,
    ttl: 30000 // 30 seconds cache
};

// APOD (Astronomy Picture of the Day) routes
router.get('/apod', async (req, res, next) => {
    try {
        const { date, start_date, end_date } = req.query;

        let data;
        if (start_date && end_date) {
            data = await getApodRange(start_date, end_date);
        } else {
            data = await getApod(date);
        }

        res.json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
});

// Mars Rover Photos routes
router.get('/mars-rovers/:rover/photos', async (req, res, next) => {
    try {
        const { rover } = req.params;
        const { sol, earth_date, camera, page = 1 } = req.query;

        const data = await getMarsRoverPhotos(rover, sol, earth_date, camera, page);

        res.json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
});

router.get('/mars-rovers/:rover/latest-photos', async (req, res, next) => {
    try {
        const { rover } = req.params;
        const data = await getLatestMarsRoverPhotos(rover);

        res.json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
});

// Near Earth Objects routes
router.get('/neo', async (req, res, next) => {
    try {
        const { start_date, end_date } = req.query;

        if (!start_date || !end_date) {
            return res.status(400).json({
                success: false,
                error: 'start_date and end_date parameters are required'
            });
        }

        const data = await getNearEarthObjects(start_date, end_date);

        res.json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
});

router.get('/neo/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await getNeoById(id);

        res.json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
});

// NASA Image Library routes
router.get('/images', async (req, res, next) => {
    try {
        const { q, media_type, page = 1 } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                error: 'Query parameter "q" is required'
            });
        }

        const data = await searchImages(q, media_type, page);

        res.json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
});

// ISS routes
router.get('/iss/position', async (req, res, next) => {
    try {
        // Check cache first
        const now = Date.now();
        if (issPositionCache.data && (now - issPositionCache.timestamp) < issPositionCache.ttl) {
            return res.json({
                success: true,
                data: issPositionCache.data
            });
        }

        const data = await getISSPosition();

        // Update cache
        issPositionCache.data = data;
        issPositionCache.timestamp = now;

        res.json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
});

router.get('/iss/pass-times', async (req, res, next) => {
    try {
        const { lat, lon, alt } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({
                success: false,
                error: 'Latitude (lat) and longitude (lon) parameters are required'
            });
        }

        const data = await getISSPassTimes(parseFloat(lat), parseFloat(lon), alt ? parseFloat(alt) : undefined);

        res.json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
});

// Launch routes
router.get('/launches/upcoming', async (req, res, next) => {
    try {
        const data = await getUpcomingLaunches();

        res.json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
});

router.get('/launches/latest', async (req, res, next) => {
    try {
        const data = await getLatestLaunch();

        res.json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
});

router.get('/launches/past', async (req, res, next) => {
    try {
        const { limit = 10 } = req.query;
        const data = await getPastLaunches(parseInt(limit));

        res.json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
});

// Astronauts routes
router.get('/astronauts', async (req, res, next) => {
    try {
        const data = await getAstronauts();

        res.json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
});

// Space News routes
router.get('/news', async (req, res, next) => {
    try {
        const { limit = 10 } = req.query;
        const data = await getSpaceNews(parseInt(limit));

        res.json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
});

// Earth Imagery routes
router.get('/earth/imagery', async (req, res, next) => {
    try {
        const { lat, lon, date, dim } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({
                success: false,
                error: 'Latitude (lat) and longitude (lon) parameters are required'
            });
        }

        const data = await getEarthImagery(parseFloat(lat), parseFloat(lon), date, dim ? parseFloat(dim) : undefined);

        res.json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
