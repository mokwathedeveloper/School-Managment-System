import prisma from '../db/prisma';

export const TransportService = {
  async getRoutes(schoolId: string) {
    return prisma.transportRoute.findMany({
      where: { school_id: schoolId },
      include: {
        _count: {
          select: { students: true }
        }
      },
      orderBy: { name: 'asc' }
    });
  },

  async getVehicles(schoolId: string) {
    return prisma.vehicle.findMany({
      where: { school_id: schoolId },
      include: {
        route: true,
        driver: {
          include: { user: true }
        }
      },
      orderBy: { reg_number: 'asc' }
    });
  }
};
