import { Injectable, NestMiddleware, TooManyRequestsException } from '@nestjs/common';
import rateLimit from 'express-rate-limit';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
  });

  use(req: any, res: any, next: () => void) {
    this.limiter(req, res, next);
  }
}

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