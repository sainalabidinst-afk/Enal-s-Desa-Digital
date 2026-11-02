import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { prisma } from '../../core/prisma/prisma.service';

export enum AssetCondition {
  BARU = 'BARU',
  BAI = 'BAI',
  RUSAK_RINGAN = 'RUSAK_RINGAN',
  RUSAK_BERAT = 'RUSAK_BERAT',
}

@Injectable()
export class AssetService {
  async create(data: { villageId: string; code: string; name: string; category: string; condition?: string }) {
    const existing = await prisma.asset.findFirst({
      where: { code: data.code, deletedAt: null },
    });

    if (existing) {
      throw new BadRequestException('Asset code already exists');
    }

    const asset = await prisma.asset.create({
      data,
    });

    return {
      success: true,
      message: 'Asset created successfully',
      data: asset,
    };
  }

  async findAll(params: { page?: number; limit?: number; search?: string; category?: string; condition?: string; villageId?: string }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (params.search) {
      where.OR = [
        { code: { contains: params.search, mode: 'insensitive' } },
        { name: { contains: params.search, mode: 'insensitive' } },
        { category: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.category) {
      where.category = params.category;
    }

    if (params.condition) {
      where.condition = params.condition;
    }

    if (params.villageId) {
      where.villageId = params.villageId;
    }

    const [data, total] = await prisma.$transaction([
      prisma.asset.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.asset.count({ where }),
    ]);

    return {
      success: true,
      message: 'Assets fetched successfully',
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const asset = await prisma.asset.findFirst({
      where: { id, deletedAt: null },
    });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    return {
      success: true,
      data: asset,
    };
  }

  async update(id: string, data: { code?: string; name?: string; category?: string; condition?: string }) {
    const asset = await prisma.asset.findFirst({ where: { id, deletedAt: null } });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    if (data.code && data.code !== asset.code) {
      const existing = await prisma.asset.findFirst({
        where: { code: data.code, deletedAt: null },
      });

      if (existing) {
        throw new BadRequestException('Asset code already exists');
      }
    }

    const updated = await prisma.asset.update({
      where: { id },
      data,
    });

    return {
      success: true,
      message: 'Asset updated successfully',
      data: updated,
    };
  }

  async remove(id: string) {
    const asset = await prisma.asset.findFirst({ where: { id, deletedAt: null } });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    await prisma.asset.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return {
      success: true,
      message: 'Asset deleted successfully',
    };
  }
}
