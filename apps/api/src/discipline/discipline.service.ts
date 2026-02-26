import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DisciplineService {
  constructor(private prisma: PrismaService) {}

  async createRecord(schoolId: string, data: {
    student_id: string;
    title: string;
    description?: string;
    severity: string;
    action_taken?: string;
    incident_date: Date;
    reported_by_id?: string;
  }) {
    return this.prisma.disciplineRecord.create({
      data: {
        ...data,
        school_id: schoolId,
      },
    });
  }

  async getStudentRecords(studentId: string) {
    return this.prisma.disciplineRecord.findMany({
      where: { student_id: studentId },
      include: { reported_by: { include: { user: true } } },
      orderBy: { incident_date: 'desc' },
    });
  }

  async getSchoolRecords(schoolId: string) {
    return this.prisma.disciplineRecord.findMany({
      where: { school_id: schoolId },
      include: {
        student: { include: { user: true } },
        reported_by: { include: { user: true } },
      },
      orderBy: { incident_date: 'desc' },
    });
  }
}
