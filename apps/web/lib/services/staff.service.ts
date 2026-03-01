
import prisma from '../db/prisma';
import { Staff, Prisma } from '@prisma/client';

export const StaffService = {
  async findAll(schoolId: string) {
    return prisma.staff.findMany({
      where: { school_id: schoolId },
      include: {
        user: true,
      },
      orderBy: { created_at: 'desc' }
    });
  },

  async findOne(schoolId: string, id: string) {
    return prisma.staff.findFirst({
      where: { id, school_id: schoolId },
      include: {
        user: true,
        classes_managed: true,
        subjects_taught: true,
      }
    });
  },

  async processPayroll(schoolId: string, month: number, year: number) {
    const staffMembers = await this.findAll(schoolId);
    let processed = 0;

    for (const staff of staffMembers) {
      if (!staff.base_salary) continue;

      const existing = await prisma.payrollRecord.findUnique({
        where: {
          staff_id_month_year: {
            staff_id: staff.id,
            month,
            year
          }
        }
      });

      if (!existing) {
        await prisma.payrollRecord.create({
          data: {
            school_id: schoolId,
            staff_id: staff.id,
            month,
            year,
            base_pay: staff.base_salary,
            net_pay: staff.base_salary,
            status: 'DRAFT'
          }
        });
        processed++;
      }
    }

    return { processed };
  }
};
