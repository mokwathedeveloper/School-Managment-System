import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdmissionsService {
  constructor(private prisma: PrismaService) {}

  async apply(data: any) {
    return this.prisma.admissionApplication.create({
      data: {
        ...data,
        status: 'PENDING',
      },
    });
  }

  async findAll(schoolId: string) {
    return this.prisma.admissionApplication.findMany({
      where: { school_id: schoolId },
      include: { applied_grade: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async updateStatus(applicationId: string, status: string, notes?: string) {
    return this.prisma.admissionApplication.update({
      where: { id: applicationId },
      data: { status, notes },
    });
  }
}
