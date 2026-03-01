import prisma from '../db/prisma';

export const TimetableService = {
  async getByClass(schoolId: string, classId: string) {
    return prisma.timetableSlot.findMany({
      where: { 
        school_id: schoolId,
        class_id: classId
      },
      include: {
        subject: true,
        teacher: {
          include: { user: true }
        },
        room: true
      },
      orderBy: [
        { day_of_week: 'asc' },
        { start_time: 'asc' }
      ]
    });
  },

  async createSlot(schoolId: string, data: any) {
    return prisma.timetableSlot.create({
      data: {
        ...data,
        school_id: schoolId
      }
    });
  }
};
