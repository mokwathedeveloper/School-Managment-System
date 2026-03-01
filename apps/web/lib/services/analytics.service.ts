
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

    // Real trend data based on student created_at dates for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const recentStudents = await prisma.student.findMany({
      where: { 
        school_id: schoolId,
        created_at: { gte: sixMonthsAgo }
      },
      select: { created_at: true }
    });

    const monthlyCounts = Array(6).fill(0);
    const currentMonth = new Date().getMonth();
    
    recentStudents.forEach(student => {
      const studentMonth = student.created_at.getMonth();
      // Calculate index relative to current month (0 is 5 months ago, 5 is current month)
      let monthDiff = currentMonth - studentMonth;
      if (monthDiff < 0) monthDiff += 12; // Handle year wrap-around
      
      const index = 5 - monthDiff;
      if (index >= 0 && index < 6) {
        monthlyCounts[index]++;
      }
    });

    // Convert monthly additions to cumulative trend (simplified)
    let cumulative = studentCount - recentStudents.length;
    const enrollmentTrend = monthlyCounts.map(count => {
      cumulative += count;
      return cumulative;
    });

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
