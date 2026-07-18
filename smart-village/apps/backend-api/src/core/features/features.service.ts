import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeaturesService {
  private readonly logger = new Logger(FeaturesService.name);
  private cache = new Map<string, boolean>();

  constructor(private readonly prisma: PrismaService) {}

  async isEnabled(code: string, villageId?: string): Promise<boolean> {
    // Check cache first
    const cacheKey = `${code}:${villageId || 'global'}`;
    const cached = this.cache.get(cacheKey);
    if (cached !== undefined) return cached;

    // Check village-specific flag first
    if (villageId) {
      const villageFlag = await this.prisma.featureFlag.findUnique({
        where: { code },
      });
      if (villageFlag && villageFlag.villageId === villageId) {
        this.cache.set(cacheKey, villageFlag.isEnabled);
        return villageFlag.isEnabled;
      }
    }

    // Check global flag
    const globalFlag = await this.prisma.featureFlag.findFirst({
      where: { code, villageId: null },
    });

    const isEnabled = globalFlag?.isEnabled ?? false;
    this.cache.set(cacheKey, isEnabled);
    return isEnabled;
  }

  async enable(code: string, villageId?: string): Promise<void> {
    await this.upsertFlag(code, true, villageId);
    this.invalidateCache(code, villageId);
  }

  async disable(code: string, villageId?: string): Promise<void> {
    await this.upsertFlag(code, false, villageId);
    this.invalidateCache(code, villageId);
  }

  private async upsertFlag(code: string, isEnabled: boolean, villageId?: string): Promise<void> {
    await this.prisma.featureFlag.upsert({
      where: { code },
      update: { isEnabled, villageId: villageId || null },
      create: {
        code,
        name: code,
        isEnabled,
        villageId: villageId || null,
      },
    });
  }

  private invalidateCache(code: string, villageId?: string): void {
    this.cache.delete(`${code}:${villageId || 'global'}`);
    this.cache.delete(`${code}:global`);
  }

  async getAll(villageId?: string): Promise<any[]> {
    const flags = await this.prisma.featureFlag.findMany({
      where: {
        OR: [
          { villageId: null },
          ...(villageId ? [{ villageId }] : []),
        ],
      },
    });
    return flags;
  }
}