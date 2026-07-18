import { Module, Global } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { SmartConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { EventBus } from './events/event-bus/event-bus.service';
import { QueueService } from './queue/queue.service';
import { SearchModule } from './search/search.module';
import { FeaturesService } from './features/features.service';
import { HealthController } from './health/health.controller';
import { AuditInterceptor } from './audit/audit.interceptor';
import { StorageService } from './storage/storage.service';
import { NotificationService } from './notification/notification.service';
import { WorkflowService } from './workflow/workflow.service';

@Global()
@Module({
  imports: [
    SmartConfigModule,
    PrismaModule,
    SearchModule,
    ThrottlerModule.forRootAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            name: 'login',
            ttl: 60000,
            limit: config.get<number>('RATE_LIMIT_LOGIN', 10),
          },
          {
            name: 'api',
            ttl: 60000,
            limit: config.get<number>('RATE_LIMIT_API', 100),
          },
          {
            name: 'import',
            ttl: 60000,
            limit: config.get<number>('RATE_LIMIT_IMPORT', 5),
          },
          {
            name: 'upload',
            ttl: 60000,
            limit: config.get<number>('RATE_LIMIT_UPLOAD', 20),
          },
        ],
      }),
    }),
  ],
  controllers: [HealthController],
  providers: [
    // Core Services
    EventBus,
    QueueService,
    FeaturesService,
    StorageService,
    NotificationService,
    WorkflowService,

    // Global Guards
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },

    // Global Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
  exports: [
    EventBus,
    QueueService,
    FeaturesService,
    StorageService,
    NotificationService,
    WorkflowService,
    PrismaModule,
    SearchModule,
  ],
})
export class CoreModule {}