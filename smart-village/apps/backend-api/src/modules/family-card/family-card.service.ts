import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { prisma } from '../../core/prisma/prisma.service';

@Injectable()
export class FamilyCardService {
  async findAll(params?: { villageId?: string; search?: string; page?: number; limit?: number }) {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (params?.villageId) where.villageId = params.villageId;
    if (params?.search) {
      where.OR = [
        { headName: { contains: params.search, mode: 'insensitive' } },
        { nkk: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await prisma.$transaction([
      prisma.familyCard.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.familyCard.count({ where }),
    ]);

    return {
      success: true,
      message: 'Family cards fetched successfully',
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const familyCard = await prisma.familyCard.findFirst({
      where: { id, deletedAt: null },
    });

    if (!familyCard) throw new NotFoundException('Family card not found');

    return { success: true, data: familyCard };
  }

  async findByNKK(nkk: string) {
    const familyCard = await prisma.familyCard.findFirst({
      where: { nkk, deletedAt: null },
    });

    if (!familyCard) throw new NotFoundException('Family card not found');

    return { success: true, data: familyCard };
  }

  async create(data: { nkk: string; headName: string; address: string; rt: string; rw: string; villageId: string; hamlet?: string }) {
    const existing = await prisma.familyCard.findFirst({ where: { nkk: data.nkk, deletedAt: null } });
    if (existing) throw new ConflictException('NKK already exists');

    const familyCard = await prisma.familyCard.create({ data });

    return { success: true, message: 'Family card created', data: familyCard };
  }

  async update(id: string, data: { headName?: string; address?: string; rt?: string; rw?: string; hamlet?: string }) {
    const familyCard = await prisma.familyCard.findFirst({ where: { id, deletedAt: null } });
    if (!familyCard) throw new NotFoundException('Family card not found');

    const updated = await prisma.familyCard.update({ where: { id }, data });

    return { success: true, message: 'Family card updated', data: updated };
  }

  async remove(id: string) {
    const familyCard = await prisma.familyCard.findFirst({ where: { id, deletedAt: null } });
    if (!familyCard) throw new NotFoundException('Family card not found');

    await prisma.familyCard.update({ where: { id }, data: { deletedAt: new Date() } });

    return { success: true, message: 'Family card deleted' };
  }
}