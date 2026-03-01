import prisma from '../db/prisma';

export const HostelsService = {
  async findAll(schoolId: string) {
    return prisma.hostel.findMany({
      where: { school_id: schoolId },
      include: {
        _count: { select: { rooms: true } }
      },
      orderBy: { name: 'asc' }
    });
  },

  async getRooms(schoolId: string, hostelId: string) {
    return prisma.dormRoom.findMany({
      where: { 
        hostel_id: hostelId,
        hostel: { school_id: schoolId }
      },
      include: {
        students: {
          include: { user: true }
        },
        _count: { select: { students: true } }
      },
      orderBy: { room_number: 'asc' }
    });
  },

  async create(schoolId: string, data: any) {
    return prisma.hostel.create({
      data: { ...data, school_id: schoolId }
    });
  },

  async createRoom(schoolId: string, hostelId: string, data: any) {
    // Security check
    const hostel = await prisma.hostel.findFirst({
      where: { id: hostelId, school_id: schoolId }
    });
    if (!hostel) throw new Error('Hostel not found');

    return prisma.dormRoom.create({
      data: { ...data, hostel_id: hostelId }
    });
  }
};
