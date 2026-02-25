import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdmissionStatus } from '@prisma/client';

@Injectable()
export class AdmissionsService {
  constructor(private prisma: PrismaService) {}

  async createApplication(schoolId: string, data: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    applied_grade_id: string;
  }) {
    return this.prisma.admissionApplication.create({
      data: {
        ...data,
        school_id: schoolId,
        status: AdmissionStatus.PENDING,
      }
    });
  }

  async getApplications(schoolId: string, status?: AdmissionStatus) {
    return this.prisma.admissionApplication.findMany({
      where: {
        school_id: schoolId,
        ...(status && { status })
      },
      include: {
        applied_grade: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async updateStatus(applicationId: string, status: AdmissionStatus, notes?: string) {
    return this.prisma.admissionApplication.update({
      where: { id: applicationId },
      data: { status, notes }
    });
  }
}
