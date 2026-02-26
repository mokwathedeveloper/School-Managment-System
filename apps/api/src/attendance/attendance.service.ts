import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MessagingService } from '../messaging/messaging.service';

@Injectable()
export class AttendanceService {
  constructor(
    private prisma: PrismaService,
    private messaging: MessagingService,
  ) {}

  async markAttendance(data: {
    school_id: string;
    class_id: string;
    date: Date;
    records: { student_id: string; status: string; remarks?: string }[];
  }) {
    const savedRecords = [];

    for (const record of data.records) {
      const attendance = await this.prisma.attendance.upsert({
        where: {
          student_id_date: {
            student_id: record.student_id,
            date: data.date,
          },
        },
        update: {
          status: record.status,
          remarks: record.remarks,
        },
        create: {
          school_id: data.school_id,
          student_id: record.student_id,
          class_id: data.class_id,
          date: data.date,
          status: record.status,
          remarks: record.remarks,
        },
      });

      // Notify parent if student is absent
      if (record.status === 'ABSENT') {
        this.messaging.notifyAbsence(record.student_id, data.date);
      }

      savedRecords.push(attendance);
    }

    return savedRecords;
  }

  async getAttendance(schoolId: string, classId: string, date: Date) {
    return this.prisma.attendance.findMany({
      where: {
        school_id: schoolId,
        class_id: classId,
        date: date,
      },
      include: {
        student: {
          include: { user: true },
        },
      },
    });
  }
}
