import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  async getMedicalRecord(studentId: string) {
    const record = await this.prisma.medicalRecord.findUnique({
      where: { student_id: studentId },
      include: {
        visits: {
          orderBy: { visit_date: 'desc' },
          include: { attended_by: { include: { user: true } } }
        }
      }
    });
    return record;
  }

  async updateMedicalRecord(studentId: string, data: any) {
    return this.prisma.medicalRecord.upsert({
      where: { student_id: studentId },
      update: data,
      create: {
        student_id: studentId,
        ...data
      }
    });
  }

  async recordVisit(schoolId: string, staffUserId: string, data: {
    student_id: string;
    symptoms: string;
    diagnosis?: string;
    treatment?: string;
    notes?: string;
  }) {
    // Ensure medical record exists
    let record = await this.prisma.medicalRecord.findUnique({ where: { student_id: data.student_id } });
    
    if (!record) {
      record = await this.prisma.medicalRecord.create({
        data: { student_id: data.student_id }
      });
    }

    const staff = await this.prisma.staff.findUnique({ where: { user_id: staffUserId } });

    return this.prisma.clinicVisit.create({
      data: {
        school_id: schoolId,
        medical_record_id: record.id,
        symptoms: data.symptoms,
        diagnosis: data.diagnosis,
        treatment: data.treatment,
        notes: data.notes,
        attended_by_id: staff?.id
      }
    });
  }

  async getSchoolVisits(schoolId: string) {
    return this.prisma.clinicVisit.findMany({
      where: { school_id: schoolId },
      include: {
        medical_record: {
          include: { student: { include: { user: true } } }
        },
        attended_by: {
          include: { user: true }
        }
      },
      orderBy: { visit_date: 'desc' }
    });
  }
}
