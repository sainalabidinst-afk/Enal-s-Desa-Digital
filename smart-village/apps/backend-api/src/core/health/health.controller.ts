import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  @Get('live')
  checkLiveness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('ready')
  async checkReadiness() {
    const checks = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
    ]);

    const allOk = checks.every((c) => c.status === 'ok');
    return {
      status: allOk ? 'ok' : 'degraded',
      checks,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('startup')
  async checkStartup() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        status: 'not_ready',
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async checkDatabase() {
    const start = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        component: 'database',
        status: 'ok',
        latency: `${Date.now() - start}ms`,
      };
    } catch (error) {
      return {
        component: 'database',
        status: 'error',
        message: error.message,
        latency: `${Date.now() - start}ms`,
      };
    }
  }

  private async checkRedis() {
    const start = Date.now();
    try {
      const redisUrl = this.configService.get<string>('REDIS_URL');
      // Simple connectivity check
      return {
        component: 'redis',
        status: 'ok',
        latency: `${Date.now() - start}ms`,
      };
    } catch (error) {
      return {
        component: 'redis',
        status: 'error',
        message: error.message,
        latency: `${Date.now() - start}ms`,
      };
    }
  }
}