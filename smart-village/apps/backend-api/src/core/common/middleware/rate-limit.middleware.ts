import rateLimit from 'express-rate-limit';

export function createAuthRateLimit() {
  return rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: {
      success: false,
      message: 'Too many login attempts, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
  });
}