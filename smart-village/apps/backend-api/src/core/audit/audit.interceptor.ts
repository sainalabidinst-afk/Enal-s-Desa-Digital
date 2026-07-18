import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, ip, headers } = request;
    const user = (request as any).user;
    const startTime = Date.now();

    // Skip audit for GET requests (read-only)
    if (method === 'GET') {
      return next.handle();
    }

    return next.handle().pipe(
      tap({
        next: async () => {
          const duration = Date.now() - startTime;
          const resource = this.extractResource(url);
          const action = this.mapMethodToAction(method);

          // Log to audit trail (async, non-blocking)
          if (user && resource) {
            this.createAuditLog({
              userId: user.id,
              action,
              resource,
              resourceId: this.extractResourceId(url),
              description: `${action} ${resource}`,
              ipAddress: ip,
              userAgent: headers['user-agent'] || undefined,
              villageId: user.villageId || undefined,
            }).catch((err) => this.logger.error(`Audit log failed: ${err.message}`));
          }
        },
        error: async (error) => {
          this.logger.error(`Request failed: ${method} ${url} - ${error.message}`);
        },
      }),
    );
  }

  private async createAuditLog(data: {
    userId: string;
    action: string;
    resource: string;
    resourceId?: string;
    description?: string;
    ipAddress?: string;
    userAgent?: string;
    villageId?: string;
  }) {
    await this.prisma.auditLog.create({ data });
  }

  private extractResource(url: string): string {
    const match = url.match(/\/api\/v1\/([a-z-]+)/);
    return match ? match[1] : 'unknown';
  }

  private extractResourceId(url: string): string | undefined {
    const parts = url.split('/');
    // Find UUID v7 pattern (36 chars with hyphens)
    for (const part of parts) {
      if (part.length === 36 && part.includes('-')) {
        return part;
      }
    }
    return undefined;
  }

  private mapMethodToAction(method: string): string {
    const map: Record<string, string> = {
      POST: 'CREATE',
      PATCH: 'UPDATE',
      PUT: 'UPDATE',
      DELETE: 'DELETE',
    };
    return map[method] || method;
  }
}