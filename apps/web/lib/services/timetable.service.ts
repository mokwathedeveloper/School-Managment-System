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
    const { class_id, day_of_week, start_time, end_time, teacher_id, room_id } = data;

    // 1. Check for Class conflict (Class already has a lesson)
    const classConflict = await prisma.timetableSlot.findFirst({
      where: {
        school_id: schoolId,
        class_id,
        day_of_week,
        OR: [
          {
            AND: [
              { start_time: { lte: start_time } },
              { end_time: { gt: start_time } }
            ]
          },
          {
            AND: [
              { start_time: { lt: end_time } },
              { end_time: { gte: end_time } }
            ]
          }
        ]
      }
    });

    if (classConflict) {
      throw new Error('This class already has a scheduled lesson during this time.');
    }

    // 2. Check for teacher conflict
    if (teacher_id) {
      const teacherConflict = await prisma.timetableSlot.findFirst({
        where: {
          school_id: schoolId,
          teacher_id,
          day_of_week,
          OR: [
            {
              AND: [
                { start_time: { lte: start_time } },
                { end_time: { gt: start_time } }
              ]
            },
            {
              AND: [
                { start_time: { lt: end_time } },
                { end_time: { gte: end_time } }
              ]
            }
          ]
        }
      });

      if (teacherConflict) {
        throw new Error('Teacher is already scheduled for another class during this time.');
      }
    }

    // 3. Check for room conflict
    if (room_id) {
      const roomConflict = await prisma.timetableSlot.findFirst({
        where: {
          school_id: schoolId,
          room_id,
          day_of_week,
          OR: [
            {
              AND: [
                { start_time: { lte: start_time } },
                { end_time: { gt: start_time } }
              ]
            },
            {
              AND: [
                { start_time: { lt: end_time } },
                { end_time: { gte: end_time } }
              ]
            }
          ]
        }
      });

      if (roomConflict) {
        throw new Error('Room is already occupied during this time.');
      }
    }

    return prisma.timetableSlot.create({
      data: {
        ...data,
        school_id: schoolId
      }
    });
  },

  async getRooms(schoolId: string) {
    return prisma.room.findMany({
      where: { school_id: schoolId },
      orderBy: { name: 'asc' }
    });
  },

  async createRoom(schoolId: string, data: { name: string; capacity?: number }) {
    return prisma.room.create({
      data: {
        ...data,
        school_id: schoolId
      }
    });
  }
};
