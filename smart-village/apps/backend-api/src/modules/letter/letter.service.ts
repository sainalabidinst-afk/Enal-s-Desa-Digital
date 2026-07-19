import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

export enum LetterStatus {
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SIGNED = 'SIGNED',
  CANCELLED = 'CANCELLED',
}

@Injectable()
export class LetterService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { citizenId: string; letterTypeId: string; subject: string; content?: string }, userId: string) {
    const letterType = await this.prisma.letterType.findFirst({
      where: { id: data.letterTypeId, deletedAt: null },
    });

    if (!letterType) {
      throw new BadRequestException('Invalid letter type');
    }

    const citizen = await this.prisma.citizen.findFirst({
      where: { id: data.citizenId, deletedAt: null },
    });

    if (!citizen) {
      throw new BadRequestException('Citizen not found');
    }

    const letterNumber = await this.generateLetterNumber();

    const letter = await this.prisma.letter.create({
      data: {
        ...data,
        letterNumber,
        submittedBy: userId,
        status: LetterStatus.PENDING,
        villageId: citizen.villageId || undefined,
      },
    });

    return {
      success: true,
      message: 'Letter created successfully',
      data: letter,
    };
  }

  async findAll(params: { page?: number; limit?: number; search?: string; status?: string; citizenId?: string }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (params.search) {
      where.OR = [
        { letterNumber: { contains: params.search, mode: 'insensitive' } },
        { subject: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.status) {
      where.status = params.status;
    }

    if (params.citizenId) {
      where.citizenId = params.citizenId;
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.letter.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          citizen: { select: { name: true, nik: true } },
          letterType: { select: { name: true, code: true } },
          submitter: { select: { name: true } },
        },
      }),
      this.prisma.letter.count({ where }),
    ]);

    return {
      success: true,
      message: 'Letters fetched successfully',
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
    const letter = await this.prisma.letter.findFirst({
      where: { id, deletedAt: null },
      include: {
        citizen: true,
        letterType: true,
        submitter: { select: { name: true } },
        approver: { select: { name: true } },
      },
    });

    if (!letter) {
      throw new NotFoundException('Letter not found');
    }

    return {
      success: true,
      data: letter,
    };
  }

  async updateStatus(id: string, status: LetterStatus, userId: string) {
    const letter = await this.prisma.letter.findFirst({ where: { id, deletedAt: null } });

    if (!letter) {
      throw new NotFoundException('Letter not found');
    }

    const updated = await this.prisma.letter.update({
      where: { id },
      data: { status, approvedBy: status === LetterStatus.APPROVED ? userId : undefined, signedAt: status === LetterStatus.SIGNED ? new Date() : undefined },
    });

    return {
      success: true,
      message: `Letter status updated to ${status}`,
      data: updated,
    };
  }

  async update(id: string, data: { subject?: string; content?: string }, userId: string) {
    const letter = await this.prisma.letter.findFirst({ where: { id, deletedAt: null } });

    if (!letter) {
      throw new NotFoundException('Letter not found');
    }

    const updated = await this.prisma.letter.update({
      where: { id },
      data,
    });

    return {
      success: true,
      message: 'Letter updated successfully',
      data: updated,
    };
  }

  async remove(id: string) {
    const letter = await this.prisma.letter.findFirst({ where: { id, deletedAt: null } });

    if (!letter) {
      throw new NotFoundException('Letter not found');
    }

    await this.prisma.letter.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return {
      success: true,
      message: 'Letter deleted successfully',
    };
  }

  async getLetterTypes() {
    const letterTypes = await this.prisma.letterType.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });

    return {
      success: true,
      data: letterTypes,
    };
  }

  private async generateLetterNumber(): Promise<string> {
    const currentYear = new Date().getFullYear();
    const count = await this.prisma.letter.count({ where: { deletedAt: null } });
    const sequence = String(count + 1).padStart(4, '0');
    return `${sequence}/${currentYear}`;
  }
}