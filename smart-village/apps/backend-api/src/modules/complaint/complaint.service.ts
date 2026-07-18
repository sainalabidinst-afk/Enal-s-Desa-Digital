import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { Complaint, ComplaintStatus } from '@prisma/client';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { QueryComplaintDto } from './dto/query-complaint.dto';

@Injectable()
export class ComplaintService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createComplaintDto: CreateComplaintDto, userId: string) {
    const trackingNumber = this.generateTrackingNumber();

    const complaint = await this.prisma.complaint.create({
      data: {
        ...createComplaintDto,
        trackingNumber,
        submittedBy: userId,
        status: ComplaintStatus.PENDING,
      },
    });

    await this.prisma.complaintTimeline.create({
      data: {
        complaintId: complaint.id,
        status: ComplaintStatus.PENDING,
        action: 'CREATE',
        notes: 'Complaint created',
        userId,
        userName: 'User',
        userRole: 'USER',
      },
    });

    return {
      success: true,
      message: 'Complaint created successfully',
      data: complaint,
    };
  }

  async findAll(query: QueryComplaintDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.search) {
      where.OR = [
        { trackingNumber: { contains: query.search, mode: 'insensitive' } },
        { subject: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.assignedTo) {
      where.assignedTo = query.assignedTo;
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.complaint.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.complaint.count({ where }),
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
    const complaint = await this.prisma.complaint.findFirst({
      where: { id },
    });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    return {
      success: true,
      data: complaint,
    };
  }

  async findByTrackingNumber(trackingNumber: string) {
    const complaint = await this.prisma.complaint.findFirst({
      where: { trackingNumber },
    });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    return {
      success: true,
      data: complaint,
    };
  }

  async update(id: string, updateComplaintDto: UpdateComplaintDto, userId: string) {
    const complaint = await this.prisma.complaint.findFirst({ where: { id } });

    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    const oldStatus = complaint.status;

    const updated = await this.prisma.complaint.update({
      where: { id },
      data: updateComplaintDto,
    });

    if (updateComplaintDto.status && updateComplaintDto.status !== oldStatus) {
      await this.prisma.complaintTimeline.create({
        data: {
          complaintId: id,
          status: updateComplaintDto.status,
          action: 'STATUS_CHANGE',
          notes: `Status changed from ${oldStatus} to ${updateComplaintDto.status}`,
          userId,
          userName: 'User',
          userRole: 'USER',
        },
      });
    }

    return {
      success: true,
      message: 'Complaint updated successfully',
      data: updated,
    };
  }

  async getTimeline(id: string) {
    const timeline = await this.prisma.complaintTimeline.findMany({
      where: { complaintId: id },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: timeline,
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
