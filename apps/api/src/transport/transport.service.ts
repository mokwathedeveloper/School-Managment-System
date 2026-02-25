import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransportService {
  constructor(private prisma: PrismaService) {}

  // --------------------------------------------------------
  // ROUTES
  // --------------------------------------------------------

  async createRoute(schoolId: string, data: { name: string; cost: number; stops?: string }) {
    return this.prisma.transportRoute.create({
      data: {
        school_id: schoolId,
        name: data.name,
        cost: data.cost,
        stops: data.stops,
      },
    });
  }

  async getRoutes(schoolId: string) {
    return this.prisma.transportRoute.findMany({
      where: { school_id: schoolId },
      include: {
        _count: {
          select: { students: true, vehicles: true }
        }
      }
    });
  }

  // --------------------------------------------------------
  // VEHICLES
  // --------------------------------------------------------

  async addVehicle(schoolId: string, data: { reg_number: string; capacity: number; driver_id?: string; route_id?: string }) {
    return this.prisma.vehicle.create({
      data: {
        school_id: schoolId,
        ...data
      }
    });
  }

  async getVehicles(schoolId: string) {
    return this.prisma.vehicle.findMany({
      where: { school_id: schoolId },
      include: {
        driver: { include: { user: true } },
        route: true
      }
    });
  }

  // --------------------------------------------------------
  // ALLOCATION
  // --------------------------------------------------------

  async assignStudentToRoute(studentId: string, routeId: string) {
    return this.prisma.student.update({
      where: { id: studentId },
      data: { transport_route_id: routeId }
    });
  }
}
