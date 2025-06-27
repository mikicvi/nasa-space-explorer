const notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
        statusCode = 503;
        message = 'External service unavailable';
    }

    // NASA API specific errors
    if (err.response?.status === 429) {
        statusCode = 429;
        message = 'Rate limit exceeded. Please try again later.';
    }

    if (err.response?.status === 403) {
        statusCode = 403;
        message = 'NASA API access forbidden. Please check your API key.';
    }

    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = {
    notFound,
    errorHandler
};
