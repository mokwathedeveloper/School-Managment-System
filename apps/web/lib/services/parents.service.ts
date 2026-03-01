import prisma from '../db/prisma';

export const ParentsService = {
  async getChildren(userId: string) {
    const parent = await prisma.parent.findUnique({
      where: { user_id: userId },
      include: {
        students: {
          include: {
            user: true,
            class: {
              include: { grade: true }
            },
            attendance: {
              take: 10,
              orderBy: { date: 'desc' }
            },
            results: {
              take: 1,
              orderBy: { created_at: 'desc' },
              include: { exam: true }
            }
          }
        }
      }
    });

    if (!parent) return [];

    return parent.students.map(student => {
      const attendanceRate = student.attendance.length > 0
        ? Math.round((student.attendance.filter(a => a.status === 'PRESENT').length / student.attendance.length) * 100)
        : 100;
      
      const lastGrade = student.results[0]?.grade || 'N/A';

      return {
        ...student,
        stats: {
          attendanceRate: `${attendanceRate}%`,
          lastGrade
        }
      };
    });
  },

  async getParentProfile(userId: string) {
    return prisma.parent.findUnique({
      where: { user_id: userId },
      include: { user: true, school: true }
    });
  }
};
