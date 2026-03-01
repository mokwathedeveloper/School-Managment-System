
import prisma from '../db/prisma';

export const AnalyticsService = {
  async getDashboardStats(schoolId: string) {
    const [studentCount, invoices, results] = await Promise.all([
      prisma.student.count({ where: { school_id: schoolId } }),
      prisma.invoice.findMany({ where: { school_id: schoolId } }),
      prisma.result.findMany({ 
        where: { student: { school_id: schoolId } },
        include: { exam: true }
      })
    ]);

    const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
    const paidInvoices = invoices.filter(inv => inv.status === 'PAID').length;
    const collectionRate = invoices.length > 0 ? (paidInvoices / invoices.length) * 100 : 0;

    // Mock trend data for now, in real app would query by month
    const enrollmentTrend = [studentCount - 20, studentCount - 15, studentCount - 10, studentCount - 5, studentCount - 2, studentCount];

    // Grade distribution
    const distribution = [
      { name: 'A', value: results.filter(r => r.grade?.startsWith('A')).length },
      { name: 'B', value: results.filter(r => r.grade?.startsWith('B')).length },
      { name: 'C', value: results.filter(r => r.grade?.startsWith('C')).length },
      { name: 'D', value: results.filter(r => r.grade?.startsWith('D')).length },
      { name: 'F', value: results.filter(r => r.grade?.startsWith('F')).length },
    ].filter(d => d.value > 0);

    if (distribution.length === 0) {
        distribution.push({ name: 'No Data', value: 1 });
    }

    return {
      enrollment: {
        total: studentCount,
        trend: enrollmentTrend
      },
      finance: {
        revenue: totalRevenue,
        collectionRate
      },
      academics: {
        distribution
      }
    };
  }
};
