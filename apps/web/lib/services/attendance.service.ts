import prisma from '../db/prisma';
import { MessagingService } from './messaging.service';
import { NotificationService } from './notification.service';
import { AttendanceStatus } from '@prisma/client';

export const AttendanceService = {
  async markAttendance(data: {
    school_id: string;
    class_id: string;
    date: Date;
    records: { student_id: string; status: string; remarks?: string }[];
  }) {
    const savedRecords = [];

    for (const record of data.records) {
      // Security check: ensure student belongs to school
      const student = await prisma.student.findFirst({
        where: { id: record.student_id, school_id: data.school_id }
      });
      if (!student) continue;

      const attendance = await prisma.attendance.upsert({
        where: {
          student_id_date: {
            student_id: record.student_id,
            date: data.date,
          },
        },
        update: {
          status: record.status as AttendanceStatus,
          remarks: record.remarks,
        },
        create: {
          school_id: data.school_id,
          student_id: record.student_id,
          class_id: data.class_id,
          date: data.date,
          status: record.status as AttendanceStatus,
          remarks: record.remarks,
        },
      });

      if (record.status === 'ABSENT') {
        await MessagingService.notifyAbsence(record.student_id, data.date);
        
        await NotificationService.send({
          schoolId: data.school_id,
          userId: student.user_id,
          title: 'Absence Alert',
          message: `Absence recorded for ${data.date.toDateString()}. Please verify with the registry.`,
          type: 'ATTENDANCE'
        });
      }

      savedRecords.push(attendance);
    }

    return savedRecords;
  },

  async getAttendance(schoolId: string, classId: string, date: Date) {
    return prisma.attendance.findMany({
      where: {
        school_id: schoolId,
        class_id: classId,
        date: date,
      },
      include: {
        student: {
          include: { user: true },
        },
      },
    });
  },

  async findAll(schoolId: string) {
    return prisma.attendance.findMany({
      where: { school_id: schoolId },
      orderBy: { date: 'desc' },
      take: 500, // Reasonable limit for general stats
    });
  },

  async getReport(schoolId: string) {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const [attendance, classes, students] = await Promise.all([
      prisma.attendance.findMany({
        where: { school_id: schoolId, date: { gte: thirtyDaysAgo } },
        include: { class: true }
      }),
      prisma.class.findMany({ 
        where: { school_id: schoolId },
        include: { _count: { select: { students: true } } }
      }),
      prisma.student.findMany({
        where: { school_id: schoolId },
        include: { user: true, class: true }
      })
    ]);

    // 1. Class-wise summarized stats
    const classStats = classes.map(c => {
        const classAttendance = attendance.filter(a => a.class_id === c.id);
        const presentCount = classAttendance.filter(a => a.status === 'PRESENT').length;
        const totalPossible = classAttendance.length;
        const rate = totalPossible > 0 ? Math.round((presentCount / totalPossible) * 100) : 100;
        
        return {
            id: c.id,
            name: c.name,
            studentCount: c._count.students,
            attendanceRate: rate
        };
    });

    // 2. Low attendance alerts (below 75%)
    const studentRates = students.map(s => {
        const studentAttendance = attendance.filter(a => a.student_id === s.id);
        const presentCount = studentAttendance.filter(a => a.status === 'PRESENT').length;
        const total = studentAttendance.length;
        const rate = total > 0 ? Math.round((presentCount / total) * 100) : 100;
        
        return {
            id: s.id,
            name: `${s.user.first_name} ${s.user.last_name}`,
            admission_no: s.admission_no,
            class: s.class?.name || 'N/A',
            rate
        };
    });

    const alerts = studentRates.filter(s => s.rate < 75).sort((a, b) => a.rate - b.rate);

    // 3. Daily trends
    const trends: Record<string, { present: number, total: number }> = {};
    attendance.forEach(a => {
        const day = a.date.toISOString().split('T')[0];
        if (!trends[day]) trends[day] = { present: 0, total: 0 };
        if (a.status === 'PRESENT') trends[day].present++;
        trends[day].total++;
    });

    const dailyTrends = Object.entries(trends)
        .map(([date, stats]) => ({
            date,
            rate: Math.round((stats.present / stats.total) * 100)
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

    return {
        classStats,
        alerts,
        dailyTrends,
        overallRate: classStats.length > 0 
            ? Math.round(classStats.reduce((sum, c) => sum + c.attendanceRate, 0) / classStats.length)
            : 100
    };
  }
};
