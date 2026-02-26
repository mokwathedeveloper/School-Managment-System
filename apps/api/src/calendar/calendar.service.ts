import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async createEvent(schoolId: string, data: {
    title: string;
    description?: string;
    start_date: Date;
    end_date: Date;
    category?: string;
    is_all_day?: boolean;
  }) {
    return this.prisma.calendarEvent.create({
      data: {
        ...data,
        school_id: schoolId,
      },
    });
  }

  async getEvents(schoolId: string, start: Date, end: Date) {
    return this.prisma.calendarEvent.findMany({
      where: {
        school_id: schoolId,
        start_date: { gte: start },
        end_date: { lte: end },
      },
    });
  }
}
