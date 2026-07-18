import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { LetterStatus } from '@prisma/client';
import { CreateLetterDto } from './dto/create-letter.dto';
import { UpdateLetterDto } from './dto/update-letter.dto';
import { QueryLetterDto } from './dto/query-letter.dto';

@Injectable()
export class LetterService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLetterDto: CreateLetterDto, userId: string) {
    const letterType = await this.prisma.letterType.findFirst({
      where: { id: createLetterDto.letterTypeId, deletedAt: null },
    });

    if (!letterType) {
      throw new BadRequestException('Invalid letter type');
    }

    const citizen = await this.prisma.citizen.findFirst({
      where: { id: createLetterDto.citizenId, deletedAt: null },
    });

    if (!citizen) {
      throw new BadRequestException('Citizen not found');
    }

    const letterNumber = this.generateLetterNumber(letterType.code);

    const letter = await this.prisma.letter.create({
      data: {
        ...createLetterDto,
        letterNumber,
        submittedBy: userId,
        status: LetterStatus.PENDING,
      },
    });

    await this.prisma.letterHistory.create({
      data: {
        letterId: letter.id,
        action: 'CREATE',
        status: LetterStatus.PENDING,
        notes: 'Letter created',
        userId,
        userName: 'System',
        userRole: 'SYSTEM',
      },
    });

    return {
      success: true,
      message: 'Letter created successfully',
      data: letter,
    };
  }

  async findAll(query: QueryLetterDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.search) {
      where.OR = [
        { letterNumber: { contains: query.search, mode: 'insensitive' } },
        { subject: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.citizenId) {
      where.citizenId = query.citizenId;
    }

    if (query.letterTypeId) {
      where.letterTypeId = query.letterTypeId;
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.letter.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
      where: { id },
    });

    if (!letter) {
      throw new NotFoundException('Letter not found');
    }

    const history = await this.prisma.letterHistory.findMany({
      where: { letterId: id },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: { ...letter, history },
    };
  }

  async update(id: string, updateLetterDto: UpdateLetterDto, userId: string) {
    const letter = await this.prisma.letter.findFirst({ where: { id } });

    if (!letter) {
      throw new NotFoundException('Letter not found');
    }

    const oldStatus = letter.status;

    const updated = await this.prisma.letter.update({
      where: { id },
      data: updateLetterDto,
    });

    if (updateLetterDto.status && updateLetterDto.status !== oldStatus) {
      await this.prisma.letterHistory.create({
        data: {
          letterId: id,
          action: 'STATUS_CHANGE',
          status: updateLetterDto.status,
          notes: `Status changed from ${oldStatus} to ${updateLetterDto.status}`,
          userId,
          userName: 'User',
          userRole: 'USER',
        },
      });
    }

    return {
      success: true,
      message: 'Letter updated successfully',
      data: updated,
    };
  }

  async getLetterTypes() {
    const letterTypes = await this.prisma.letterType.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    return {
      success: true,
      data: letterTypes,
    };
  }

  private generateLetterNumber(typeCode: string): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${typeCode}/${year}/${month}/${random}`;
  }
}
