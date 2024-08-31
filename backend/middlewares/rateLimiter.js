const rateLimit = require('express-rate-limit');

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    handler: (req, res) => {
      const resetTime = Math.ceil(req.rateLimit.resetTime / 1000);
      res.setHeader('Retry-After', resetTime);
      res.status(429).json({
        message,
        limit: req.rateLimit.limit,
        remaining: req.rateLimit.remaining,
        reset: resetTime,
      });
    },
    standardHeaders: false,
    legacyHeaders: false,
  });

// Rate Limiting for Authentication Routes
const authLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutes
  10, // 10 requests per 15 minutes
  'Too many authentication attempts, please try again later.'
);

// General API Rate Limiter
const generalApiLimiter = createLimiter(
  60 * 1000, // 1 minute
  100, // 100 requests per minute
  'Too many API requests, please try again later.'
);

module.exports = { authLimiter, generalApiLimiter };
