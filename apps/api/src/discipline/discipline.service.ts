import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IncidentSeverity } from '@prisma/client';

@Injectable()
export class DisciplineService {
  constructor(private prisma: PrismaService) {}

  async createRecord(schoolId: string, reporterUserId: string, data: {
    student_id: string;
    title: string;
    description?: string;
    severity: IncidentSeverity;
    action_taken?: string;
    incident_date: Date;
  }) {
    // Find the staff profile of the reporter
    const staff = await this.prisma.staff.findUnique({
      where: { user_id: reporterUserId }
    });

    return this.prisma.disciplineRecord.create({
      data: {
        school_id: schoolId,
        student_id: data.student_id,
        title: data.title,
        description: data.description,
        severity: data.severity,
        action_taken: data.action_taken,
        incident_date: data.incident_date,
        reported_by_id: staff?.id // Optional: link if reporter is staff
      }
    });
  }

  async getStudentRecords(studentId: string) {
    return this.prisma.disciplineRecord.findMany({
      where: { student_id: studentId },
      include: {
        reported_by: {
          include: { user: true }
        }
      },
      orderBy: { incident_date: 'desc' }
    });
  }

  async getSchoolRecords(schoolId: string) {
    return this.prisma.disciplineRecord.findMany({
      where: { school_id: schoolId },
      include: {
        student: {
          include: { user: true, class: true }
        },
        reported_by: {
          include: { user: true }
        }
      },
      orderBy: { incident_date: 'desc' }
    });
  }
}
