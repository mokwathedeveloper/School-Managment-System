import prisma from '../db/prisma';

export const GradeLevelsService = {
  async findAll(schoolId: string) {
    return prisma.gradeLevel.findMany({
      where: { school_id: schoolId },
      orderBy: { level: 'asc' },
      include: {
        classes: {
          include: {
            _count: { select: { students: true } }
          }
        },
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
  },

  async create(schoolId: string, data: {
    name: string;
    level: number;
  }) {
    return prisma.gradeLevel.create({
      data: {
        ...data,
        school_id: schoolId
      }
    });
  }
};
