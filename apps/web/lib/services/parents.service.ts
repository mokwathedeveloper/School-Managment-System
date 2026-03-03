import prisma from '../db/prisma';
import * as argon2 from 'argon2';

export const ParentsService = {
  async findAll(schoolId: string, query?: { search?: string }) {
    return prisma.parent.findMany({
      where: {
        school_id: schoolId,
        ...(query?.search && {
          OR: [
            { user: { first_name: { contains: query.search, mode: 'insensitive' as any } } },
            { user: { last_name: { contains: query.search, mode: 'insensitive' as any } } },
            { user: { email: { contains: query.search, mode: 'insensitive' as any } } },
          ]
        })
      },
      include: {
        user: true,
        students: {
          include: { user: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });
  },

  async create(schoolId: string, data: {
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    password?: string;
  }) {
    const passwordHash = await argon2.hash(data.password || 'parent123');

    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: passwordHash,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          role: 'PARENT',
          school_id: schoolId,
          password_changed: false,
        }
      });

      return tx.parent.create({
        data: {
          user_id: user.id,
          school_id: schoolId,
        },
        include: { user: true }
      });
    });
  },

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
