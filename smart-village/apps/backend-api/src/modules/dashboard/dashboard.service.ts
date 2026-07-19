import { Injectable } from '@nestjs/common';
import { prisma } from '../../core/prisma/prisma.service';

@Injectable()
export class DashboardService {
  async getOverview() {
    const [totalCitizens, totalLetters, totalComplaints, pendingLetters, pendingComplaints, totalAssets] =
      await prisma.$transaction([
        prisma.citizen.count({ where: { deletedAt: null } }),
        prisma.letter.count({ where: { deletedAt: null } }),
        prisma.complaint.count({ where: { deletedAt: null } }),
        prisma.letter.count({ where: { status: 'PENDING', deletedAt: null } }),
        prisma.complaint.count({ where: { status: 'PENDING', deletedAt: null } }),
        prisma.asset.count({ where: { deletedAt: null } }),
      ]);

    return {
      success: true,
      data: {
        totalCitizens,
        totalLetters,
        totalComplaints,
        pendingLetters,
        pendingComplaints,
        totalAssets,
      },
    };
  }

  async getStats() {
    const citizenStats = await prisma.citizen.groupBy({
      by: ['gender'],
      where: { deletedAt: null },
      _count: { id: true },
    });

    const letterStats = await prisma.letter.groupBy({
      by: ['status'],
      where: { deletedAt: null },
      _count: { id: true },
    });

    const complaintStats = await prisma.complaint.groupBy({
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