import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../common/interfaces/response.interface';


@Injectable()
export class TransformInterceptor implements NestInterceptor<unknown, ApiResponse> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse> {
    return next.handle().pipe(
      map(data => {
        if (data && typeof data === 'object' && 'success' in data && 'message' in data) {
          return data as ApiResponse;
        }

        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode || 200;
        let message = 'Success';

        if (statusCode >= 200 && statusCode < 300) {
          message = data?.message || 'Success';
        }

        return {
          success: true,
          message,
          data,
        } as ApiResponse;
      }),
    );
  }
}
