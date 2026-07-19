import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isActive: true,
        role: { select: { name: true, slug: true } },
        village: { select: { name: true } },
        createdAt: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isActive: true,
        isVerified: true,
        role: { select: { name: true, slug: true } },
        village: { select: { name: true } },
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(data: { name: string; email?: string; phone?: string; password: string; roleId: string; villageId?: string }) {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        roleId: data.roleId,
        villageId: data.villageId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: { select: { name: true, slug: true } },
      },
    });
  }

  async update(id: string, data: { name?: string; email?: string; phone?: string; roleId?: string; isActive?: boolean }) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isActive: true,
        role: { select: { name: true, slug: true } },
      },
    });
  }

  async remove(id: string) {
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { success: true, message: 'User deleted' };
  }
}