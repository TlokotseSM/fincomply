import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuditLogService } from '../../audit/audit-log.service';

@Injectable()
export class AuditLoggerMiddleware implements NestMiddleware {
  constructor(private auditLogService: AuditLogService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const originalJson = res.json.bind(res);
    const { method, originalUrl, body } = req;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ipAddress = req.ip || 'Unknown';

    res.json = (responseBody) => {
      const statusCode = res.statusCode;

      // Only log sensitive operations (POST, PUT, DELETE)
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
        const user = (req as any).user;

        // Don't log passwords
        const sanitizedBody = { ...body };
        if (sanitizedBody.password) delete sanitizedBody.password;

        this.auditLogService.log({
          userId: user?.id,
          action: `${method}_REQUEST`,
          entity: originalUrl.split('/')[1] || 'unknown',
          status: statusCode < 400 ? 'success' : statusCode < 500 ? 'failed' : 'failed',
          details: { method, statusCode },
          ipAddress,
          userAgent,
          method,
          endpoint: originalUrl,
        });
      }

      return originalJson(responseBody);
    };

    next();
  }
}
