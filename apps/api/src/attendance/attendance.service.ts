import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AttendanceStatus } from '@prisma/client';
import { MessagingService } from '../messaging/messaging.service';

@Injectable()
export class AttendanceService {
  constructor(
    private prisma: PrismaService,
    private messaging: MessagingService
  ) {}

  async markAttendance(data: {
    school_id: string;
    class_id: string;
    date: Date;
    records: { student_id: string; status: AttendanceStatus; remarks?: string }[];
  }) {
    const { school_id, class_id, date, records } = data;

    // Use a transaction to ensure all records are saved
    const results = await this.prisma.$transaction(
      records.map((record) =>
        this.prisma.attendance.upsert({
          where: {
            student_id_date: {
              student_id: record.student_id,
              date: new Date(date.setHours(0, 0, 0, 0)),
            },
          },
          update: {
            status: record.status,
            remarks: record.remarks,
          },
          create: {
            school_id,
            class_id,
            student_id: record.student_id,
            date: new Date(date.setHours(0, 0, 0, 0)),
            status: record.status,
            remarks: record.remarks,
          },
        })
      )
    );

    // Trigger Notifications for ABSENT students
    for (const record of records) {
      if (record.status === AttendanceStatus.ABSENT) {
        this.messaging.notifyParentOfAbsence(record.student_id, date.toDateString());
      }
    }

    return results;
  }

  async getClassAttendance(class_id: string, date: Date) {
    return this.prisma.attendance.findMany({
      where: {
        class_id,
        date: new Date(date.setHours(0, 0, 0, 0)),
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async getStudentAttendanceSummary(student_id: string, startDate: Date, endDate: Date) {
    const records = await this.prisma.attendance.findMany({
      where: {
        student_id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const summary = records.reduce(
      (acc, curr) => {
        acc[curr.status]++;
        acc.total++;
        return acc;
      },
      { PRESENT: 0, ABSENT: 0, LATE: 0, EXCUSED: 0, total: 0 }
    );

    return summary;
  }
}
