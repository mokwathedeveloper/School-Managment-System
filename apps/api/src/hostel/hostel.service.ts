import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HostelService {
  constructor(private prisma: PrismaService) {}

  // --------------------------------------------------------
  // HOSTELS
  // --------------------------------------------------------

  async createHostel(schoolId: string, data: { name: string; type: string; description?: string }) {
    return this.prisma.hostel.create({
      data: { ...data, school_id: schoolId }
    });
  }

  async getHostels(schoolId: string) {
    return this.prisma.hostel.findMany({
      where: { school_id: schoolId },
      include: {
        _count: {
          select: { rooms: true }
        }
      }
    });
  }

  // --------------------------------------------------------
  // ROOMS
  // --------------------------------------------------------

  async createRoom(hostelId: string, data: { room_number: string; capacity: number }) {
    return this.prisma.dormRoom.create({
      data: { ...data, hostel_id: hostelId }
    });
  }

  async getHostelRooms(hostelId: string) {
    return this.prisma.dormRoom.findMany({
      where: { hostel_id: hostelId },
      include: {
        students: { include: { user: true } },
        _count: { select: { students: true } }
      }
    });
  }

  // --------------------------------------------------------
  // ALLOCATION
  // --------------------------------------------------------

  async assignStudentToRoom(studentId: string, roomId: string) {
    const room = await this.prisma.dormRoom.findUnique({
      where: { id: roomId },
      include: { _count: { select: { students: true } } }
    });

    if (!room) throw new NotFoundException('Room not found');
    if (room._count.students >= room.capacity) throw new BadRequestException('Room is already at full capacity');

    return this.prisma.student.update({
      where: { id: studentId },
      data: { dorm_room_id: roomId }
    });
  }
}
