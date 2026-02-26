import prisma from '../db/prisma';

export const GradeLevelsService = {
  async findAll(schoolId: string) {
    return prisma.gradeLevel.findMany({
      where: { school_id: schoolId },
      orderBy: { level: 'asc' },
      include: {
        classes: true,
        _count: { select: { classes: true } }
      }
    });
  },

  async findOne(schoolId: string, id: string) {
    return prisma.gradeLevel.findFirst({
      where: { id, school_id: schoolId },
      include: {
        classes: true
      }
    });
  }
};
