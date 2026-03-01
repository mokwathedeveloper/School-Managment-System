
import prisma from '../db/prisma';
import { AdmissionStatus } from '@prisma/client';

export const AdmissionsService = {
  async findAll(schoolId: string, status?: string) {
    return prisma.admissionApplication.findMany({
      where: { 
        school_id: schoolId,
        ...(status && { status: status as AdmissionStatus })
      },
      include: {
        applied_grade: true
      },
      orderBy: { created_at: 'desc' }
    });
  },

  async updateStatus(schoolId: string, id: string, status: string) {
    return prisma.admissionApplication.update({
      where: { id, school_id: schoolId },
      data: { status: status as AdmissionStatus }
    });
  }
};
