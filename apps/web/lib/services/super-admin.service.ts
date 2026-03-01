
import prisma from '../db/prisma';

export const SuperAdminService = {
  async getStats() {
    const [schoolCount, totalStudents, totalUsers] = await Promise.all([
      prisma.school.count(),
      prisma.student.count(),
      prisma.user.count()
    ]);

    return {
      schoolCount,
      totalStudents,
      totalUsers
    };
  },

  async getSchools() {
    return prisma.school.findMany({
      include: {
        _count: {
          select: {
            students: true,
            users: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });
  },

  async onboardSchool(data: { name: string, slug: string, email: string }) {
    return prisma.school.create({
      data: {
        ...data,
      }
    });
  }
};
