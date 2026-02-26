import prisma from '../db/prisma';

export const ClassesService = {
  async findAll(schoolId: string) {
    return prisma.class.findMany({
      where: { school_id: schoolId },
      include: {
        grade: true,
        form_teacher: { include: { user: true } },
        _count: { select: { students: true } }
      },
    });
  },

  async findOne(schoolId: string, id: string) {
    return prisma.class.findFirst({
      where: { id, school_id: schoolId },
      include: {
        grade: true,
        form_teacher: { include: { user: true } },
        students: { include: { user: true } },
        subjects: true
      }
    });
  }
};
