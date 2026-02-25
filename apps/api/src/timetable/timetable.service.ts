import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TimetableService {
  constructor(private prisma: PrismaService) {}

  async createRoom(schoolId: string, data: { name: string; capacity?: number }) {
    return this.prisma.room.create({
      data: { ...data, school_id: schoolId }
    });
  }

  async getRooms(schoolId: string) {
    return this.prisma.room.findMany({ where: { school_id: schoolId } });
  }

  async createSlot(schoolId: string, data: {
    class_id: string;
    subject_id: string;
    teacher_id?: string;
    room_id?: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
  }) {
    // 1. Check for Clashes (Room, Teacher, or Class at same time)
    const clash = await this.prisma.timetableSlot.findFirst({
      where: {
        school_id: schoolId,
        day_of_week: data.day_of_week,
        OR: [
          { room_id: data.room_id, start_time: data.start_time },
          { teacher_id: data.teacher_id, start_time: data.start_time },
          { class_id: data.class_id, start_time: data.start_time }
        ]
      }
    });

    if (clash) {
      throw new BadRequestException('Scheduling conflict detected: Room, Teacher, or Class is already booked for this slot.');
    }

    return this.prisma.timetableSlot.create({
      data: { ...data, school_id: schoolId }
    });
  }

  async getClassTimetable(classId: string) {
    return this.prisma.timetableSlot.findMany({
      where: { class_id: classId },
      include: {
        subject: true,
        teacher: { include: { user: true } },
        room: true
      },
      orderBy: [
        { day_of_week: 'asc' },
        { start_time: 'asc' }
      ]
    });
  }
}
