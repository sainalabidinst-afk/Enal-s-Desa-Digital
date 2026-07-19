import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { prisma } from '../../core/prisma/prisma.service';

export enum ComplaintStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  REJECTED = 'REJECTED',
}

export enum ComplaintCategory {
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  SECURITY = 'SECURITY',
  SANITATION = 'SANITATION',
  WATER = 'WATER',
  ELECTRICITY = 'ELECTRICITY',
  HEALTH = 'HEALTH',
  EDUCATION = 'EDUCATION',
  SOCIAL = 'SOCIAL',
  ENVIRONMENT = 'ENVIRONMENT',
  TRAFFIC = 'TRAFFIC',
  PUBLIC_FACILITY = 'PUBLIC_FACILITY',
  OTHER = 'OTHER',
}

@Injectable()
export class ComplaintService {
  async create(data: { citizenId: string; category: ComplaintCategory; subject: string; description: string }, userId: string) {
    const citizen = await prisma.citizen.findFirst({
      where: { id: data.citizenId, deletedAt: null },
    });

    if (!citizen) {
      throw new BadRequestException('Citizen not found');
    }

    const trackingNumber = this.generateTrackingNumber();

    const complaint = await prisma.complaint.create({
      data: {
        ...data,
        trackingNumber,
        submittedBy: userId,
        status: ComplaintStatus.PENDING,
        villageId: citizen.villageId,
      },
    });

    return {
      success: true,
      message: 'Complaint created successfully',
      data: complaint,
    };
  }

  async findAll(params: { page?: number; limit?: number; search?: string; status?: string }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (params.search) {
      where.OR = [
        { trackingNumber: { contains: params.search, mode: 'insensitive' } },
        { subject: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.status) {
      where.status = params.status;
    }

    const [data, total] = await prisma.$transaction([
      prisma.complaint.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.complaint.count({ where }),
    ]);

    return {
      success: true,
      message: 'Complaints fetched successfully',
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
    const complaint = await prisma.complaint.findFirst({
      where: { id, deletedAt: null },
    });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    return {
      success: true,
      data: complaint,
    };
  }

  async updateStatus(id: string, status: ComplaintStatus, userId: string) {
    const complaint = await prisma.complaint.findFirst({ where: { id, deletedAt: null } });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    const updated = await prisma.complaint.update({
      where: { id },
      data: { status, resolvedAt: [ComplaintStatus.RESOLVED, ComplaintStatus.CLOSED].includes(status) ? new Date() : undefined, resolvedBy: [ComplaintStatus.RESOLVED, ComplaintStatus.CLOSED].includes(status) ? userId : undefined },
    });

    return {
      success: true,
      message: `Complaint status updated to ${status}`,
      data: updated,
    };
  }

  async remove(id: string) {
    const complaint = await prisma.complaint.findFirst({ where: { id, deletedAt: null } });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    await prisma.complaint.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return {
      success: true,
      message: 'Complaint deleted successfully',
    };
  }

  private generateTrackingNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `COMP-${year}${month}${day}-${random}`;
  }
}