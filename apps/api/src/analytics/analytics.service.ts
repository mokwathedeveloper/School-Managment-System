import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getExecutiveDashboard(schoolId: string) {
    // 1. Enrollment Trends (Last 6 Months)
    // Note: In a real app, use a proper time-series query. We will mock data structure for now.
    const enrollment = await this.prisma.student.count({ where: { school_id: schoolId } });

    // 2. Academic Performance (Average Grade Distribution)
    const results = await this.prisma.result.findMany({
      where: { exam: { school_id: schoolId } },
      select: { grade: true }
    });

    const gradeDistribution = results.reduce((acc, curr) => {
      const grade = curr.grade || 'Unmarked';
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {});

    // 3. Financial Health (Revenue vs Outstanding)
    const invoices = await this.prisma.invoice.findMany({
      where: { school_id: schoolId },
      include: { payments: true }
    });

    let totalRevenue = 0;
    let totalOutstanding = 0;

    invoices.forEach(inv => {
      const paid = inv.payments.filter(p => p.status === 'COMPLETED').reduce((sum, p) => sum + Number(p.amount), 0);
      totalRevenue += paid;
      totalOutstanding += (Number(inv.amount) - paid);
    });

    return {
      enrollment: {
        total: enrollment,
        trend: [650, 680, 720, 750, 780, enrollment] // Mock trend for visualization
      },
      academics: {
        distribution: Object.entries(gradeDistribution).map(([grade, count]) => ({ name: grade, value: count }))
      },
      finance: {
        revenue: totalRevenue,
        outstanding: totalOutstanding,
        collectionRate: invoices.length ? (totalRevenue / (totalRevenue + totalOutstanding)) * 100 : 0
      }
    };
  }
}
