import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { prisma } from '../../core/prisma/prisma.service';
import { CreateCitizenDto } from './dto/create-citizen.dto';
import { UpdateCitizenDto } from './dto/update-citizen.dto';
import { QueryCitizenDto } from './dto/query-citizen.dto';

@Injectable()
export class CitizenService {
  async create(createCitizenDto: CreateCitizenDto) {
    const existingNIK = await prisma.citizen.findFirst({
      where: { nik: createCitizenDto.nik, deletedAt: null },
    });

    if (existingNIK) {
      throw new ConflictException('NIK already exists');
    }

    const citizen = await prisma.citizen.create({
      data: {
        ...createCitizenDto,
        dateOfBirth: new Date(createCitizenDto.dateOfBirth),
        villageId: createCitizenDto.villageId,
      },
    });

    return {
      success: true,
      message: 'Citizen created successfully',
      data: citizen,
    };
  }

  async findAll(query: QueryCitizenDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { nik: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.gender) {
      where.gender = query.gender;
    }

    if (query.villageId) {
      where.villageId = query.villageId;
    }

    if (query.rt && query.rw) {
      where.rt = query.rt;
      where.rw = query.rw;
    }

    if (query.isAlive !== undefined) {
      where.isAlive = query.isAlive;
    }

    const [data, total] = await prisma.$transaction([
      prisma.citizen.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.citizen.count({ where }),
    ]);

    return {
      success: true,
      message: 'Citizens fetched successfully',
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
    const citizen = await prisma.citizen.findFirst({
      where: { id, deletedAt: null },
    });

    if (!citizen) {
      throw new NotFoundException('Citizen not found');
    }

    return {
      success: true,
      data: citizen,
    };
  }

  async findByNIK(nik: string) {
    const citizen = await prisma.citizen.findFirst({
      where: { nik, deletedAt: null },
    });

    if (!citizen) {
      throw new NotFoundException('Citizen not found');
    }

    return {
      success: true,
      data: citizen,
    };
  }

  async update(id: string, updateCitizenDto: UpdateCitizenDto) {
    const citizen = await prisma.citizen.findFirst({
      where: { id, deletedAt: null },
    });

    if (!citizen) {
      throw new NotFoundException('Citizen not found');
    }

    if (updateCitizenDto.nik && updateCitizenDto.nik !== citizen.nik) {
      const existingNIK = await prisma.citizen.findFirst({
        where: { nik: updateCitizenDto.nik, deletedAt: null },
      });

      if (existingNIK) {
        throw new ConflictException('NIK already exists');
      }
    }

    const data: any = { ...updateCitizenDto };
    if (data.dateOfBirth) {
      data.dateOfBirth = new Date(data.dateOfBirth);
    }

    const updated = await prisma.citizen.update({
      where: { id },
      data,
    });

    return {
      success: true,
      message: 'Citizen updated successfully',
      data: updated,
    };
  }

  async remove(id: string) {
    const citizen = await prisma.citizen.findFirst({
      where: { id, deletedAt: null },
    });

    if (!citizen) {
      throw new NotFoundException('Citizen not found');
    }

    await prisma.citizen.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return {
      success: true,
      message: 'Citizen deleted successfully',
    };
  }

  async getStats() {
    const [total, male, female] = await prisma.$transaction([
      prisma.citizen.count({ where: { deletedAt: null } }),
      prisma.citizen.count({ where: { gender: 'LAKI_LAKI', isAlive: true, deletedAt: null } }),
      prisma.citizen.count({ where: { gender: 'PEREMPUAN', isAlive: true, deletedAt: null } }),
    ]);

    const productive = await prisma.citizen.count({
      where: {
        isAlive: true,
        deletedAt: null,
        dateOfBirth: {
          gte: new Date(new Date().setFullYear(new Date().getFullYear() - 64)),
          lte: new Date(new Date().setFullYear(new Date().getFullYear() - 15)),
        },
      },
    });

    return {
      success: true,
      data: { total, male, female, productive },
    };
  }
}