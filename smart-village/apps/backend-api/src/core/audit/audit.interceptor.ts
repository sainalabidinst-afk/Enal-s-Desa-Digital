import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';
import { prisma } from '../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;
    const user = (request as any).user;

    if (method === 'GET') {
      return next.handle();
    }

    return next.handle().pipe(
      tap({
        next: async () => {
          const resource = this.extractResource(url);
          const action = this.mapMethodToAction(method);

          if (user && resource) {
            this.createAuditLog({
              userId: user.id,
              action,
              resource,
              resourceId: this.extractResourceId(url),
              details: JSON.stringify({ description: `${action} ${resource}` }),
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
    details?: string;
  }) {
    await prisma.auditLog.create({ data: { ...data, userId: data.userId ?? undefined } });
  }

  private extractResource(url: string): string {
    const match = url.match(/\/api\/v1\/([a-z-]+)/);
    return match ? match[1] : 'unknown';
  }

  private extractResourceId(url: string): string | undefined {
    const parts = url.split('/');
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