import prisma from '../db/prisma';

export const ExamsService = {
  async findAll(schoolId: string) {
    return prisma.exam.findMany({
      where: { school_id: schoolId },
      include: {
        subject: true,
        term: true,
        _count: { select: { results: true } }
      },
      orderBy: { date: 'desc' }
    });
  },

  async findOne(schoolId: string, id: string) {
    return prisma.exam.findFirst({
      where: { id, school_id: schoolId },
      include: {
        subject: true,
        term: true,
        results: { include: { student: { include: { user: true } } } }
      }
    });
  }
};
