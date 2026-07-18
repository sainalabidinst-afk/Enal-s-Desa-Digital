import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const [
      totalCitizens,
      totalLetters,
      totalComplaints,
      pendingLetters,
      pendingComplaints,
    ] = await this.prisma.$transaction([
      this.prisma.citizen.count({ where: { deletedAt: null } }),
      this.prisma.letter.count(),
      this.prisma.complaint.count({ where: { deletedAt: null } }),
      this.prisma.letter.count({ where: { status: 'PENDING' } }),
      this.prisma.complaint.count({ where: { status: 'PENDING', deletedAt: null } }),
    ]);

    return {
      success: true,
      data: {
        totalCitizens,
        totalLetters,
        totalComplaints,
        pendingLetters,
        pendingComplaints,
      },
    };
  }

  async getStats() {
    const citizenStats = await this.prisma.citizen.groupBy({
      by: ['gender'],
      where: { deletedAt: null },
      _count: { id: true },
    });

    const letterStats = await this.prisma.letter.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    const complaintStats = await this.prisma.complaint.groupBy({
      by: ['status'],
      where: { deletedAt: null },
      _count: { id: true },
    });

    return {
      success: true,
      data: {
        citizens: citizenStats,
        letters: letterStats,
        complaints: complaintStats,
      },
    };
  }
}
