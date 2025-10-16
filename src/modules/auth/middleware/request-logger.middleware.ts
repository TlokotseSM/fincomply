import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('RequestLogger');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, headers } = req;
    const userAgent = headers['user-agent'] || 'Unknown';
    const ipAddress = req.ip || 'Unknown';
    const startTime = Date.now();

    // Log request start
    this.logger.debug(
      `[${method}] ${originalUrl} - IP: ${ipAddress} - User-Agent: ${userAgent}`,
    );

    // Override res.json to capture response
    const originalJson = res.json.bind(res);
    res.json = function (body) {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;

      // Log successful requests
      if (statusCode < 400) {
        this.logger.debug(
          `[${method}] ${originalUrl} - Status: ${statusCode} - Duration: ${duration}ms`,
        );
      } else if (statusCode < 500) {
        this.logger.warn(
          `[${method}] ${originalUrl} - Status: ${statusCode} - Duration: ${duration}ms`,
        );
      } else {
        this.logger.error(
          `[${method}] ${originalUrl} - Status: ${statusCode} - Duration: ${duration}ms`,
        );
      }

      return originalJson(body);
    };

    next();
  }
}