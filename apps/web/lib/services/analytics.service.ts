import prisma from '../db/prisma';

export const AnalyticsService = {
  async getDashboardStats(schoolId: string) {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const [
      studentCount, 
      staffCount,
      invoices, 
      expenses,
      results,
      attendance,
      books,
      borrows
    ] = await Promise.all([
      prisma.student.count({ where: { school_id: schoolId } }),
      prisma.staff.count({ where: { school_id: schoolId } }),
      prisma.invoice.findMany({ 
        where: { school_id: schoolId, created_at: { gte: sixMonthsAgo } },
        select: { amount: true, status: true, created_at: true }
      }),
      prisma.expense.findMany({
        where: { school_id: schoolId, date: { gte: sixMonthsAgo } },
        select: { amount: true, date: true }
      }),
      prisma.result.findMany({ 
        where: { student: { school_id: schoolId } },
        include: { exam: { include: { subject: true } } }
      }),
      prisma.attendance.findMany({
        where: { school_id: schoolId, date: { gte: sixMonthsAgo } },
        select: { status: true, date: true }
      }),
      prisma.book.count({ where: { school_id: schoolId } }),
      prisma.borrowRecord.count({ 
        where: { copy: { book: { school_id: schoolId } }, status: 'BORROWED' } 
      })
    ]);

    // Financial Metrics
    const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const paidInvoices = invoices.filter(inv => inv.status === 'PAID');
    const collectionRate = invoices.length > 0 ? (paidInvoices.length / invoices.length) * 100 : 0;

    // Monthly Financial Trends
    const monthlyFinancials = Array(6).fill(0).map((_, i) => {
        const d = new Date();
        d.setMonth(now.getMonth() - (5 - i));
        return {
            month: d.toLocaleString('default', { month: 'short' }),
            revenue: 0,
            expenses: 0
        };
    });

    invoices.forEach(inv => {
        const monthIdx = 5 - (now.getMonth() - inv.created_at.getMonth() + (now.getFullYear() - inv.created_at.getFullYear()) * 12);
        if (monthIdx >= 0 && monthIdx < 6) {
            monthlyFinancials[monthIdx].revenue += Number(inv.amount);
        }
    });

    expenses.forEach(exp => {
        const monthIdx = 5 - (now.getMonth() - exp.date.getMonth() + (now.getFullYear() - exp.date.getFullYear()) * 12);
        if (monthIdx >= 0 && monthIdx < 6) {
            monthlyFinancials[monthIdx].expenses += Number(exp.amount);
        }
    });

    // Enrollment Trend
    const recentStudents = await prisma.student.findMany({
      where: { 
        school_id: schoolId,
        created_at: { gte: sixMonthsAgo }
      },
      select: { created_at: true }
    });

    const monthlyEnrollment = Array(6).fill(0);
    recentStudents.forEach(s => {
      const monthIdx = 5 - (now.getMonth() - s.created_at.getMonth() + (now.getFullYear() - s.created_at.getFullYear()) * 12);
      if (monthIdx >= 0 && monthIdx < 6) monthlyEnrollment[monthIdx]++;
    });

    let cumulative = studentCount - recentStudents.length;
    const enrollmentTrend = monthlyEnrollment.map(count => {
      cumulative += count;
      return cumulative;
    });

    // Academic Performance (Grade Distribution)
    const gradeMap: Record<string, number> = { 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 };
    results.forEach(r => {
        const g = r.grade?.[0] || 'F';
        if (gradeMap[g] !== undefined) gradeMap[g]++;
        else gradeMap['F']++;
    });

    const distribution = Object.entries(gradeMap).map(([name, value]) => ({ name, value })).filter(d => d.value > 0);

    // Subject Performance
    const subjectStats: Record<string, { total: number, count: number }> = {};
    results.forEach(r => {
        const sName = r.exam.subject.name;
        if (!subjectStats[sName]) subjectStats[sName] = { total: 0, count: 0 };
        subjectStats[sName].total += (r.marks_obtained / r.exam.max_marks) * 100;
        subjectStats[sName].count++;
    });

    const topSubjects = Object.entries(subjectStats)
        .map(([name, stats]) => ({ name, average: Math.round(stats.total / stats.count) }))
        .sort((a, b) => b.average - a.average)
        .slice(0, 5);

    // Attendance Rate
    const attendanceRate = attendance.length > 0 
        ? (attendance.filter(a => a.status === 'PRESENT').length / attendance.length) * 100 
        : 0;

    return {
      overview: {
        totalStudents: studentCount,
        totalStaff: staffCount,
        staffStudentRatio: studentCount > 0 ? (staffCount / studentCount).toFixed(2) : 0,
        attendanceRate: Math.round(attendanceRate),
        libraryAssets: books,
        activeBorrows: borrows
      },
      enrollment: {
        total: studentCount,
        trend: enrollmentTrend,
        months: monthlyFinancials.map(f => f.month)
      },
      finance: {
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
        collectionRate: Math.round(collectionRate),
        monthlyTrends: monthlyFinancials
      },
      academics: {
        distribution,
        topSubjects
      }
    };
  }
};
