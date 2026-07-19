import { Module, Global } from '@nestjs/common';
import { SmartConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthController } from './health/health.controller';

@Global()
@Module({
  imports: [
    SmartConfigModule,
    PrismaModule,
  ],
  controllers: [HealthController],
  providers: [],
  exports: [PrismaModule],
})
export class CoreModule {}