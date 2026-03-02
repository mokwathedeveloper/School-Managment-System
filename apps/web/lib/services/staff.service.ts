
import prisma from '../db/prisma';
import { Staff, Prisma } from '@prisma/client';
import * as argon2 from 'argon2';

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

  async create(schoolId: string, data: any) {
    const passwordHash = await argon2.hash('staff123'); // Default staff password

    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: passwordHash,
          first_name: data.first_name,
          last_name: data.last_name,
          role: 'TEACHER', // Default role for HR directory entry
          school_id: schoolId,
        },
      });

      return tx.staff.create({
        data: {
          user_id: user.id,
          school_id: schoolId,
          designation: data.designation,
          department: data.department,
          base_salary: data.base_salary,
          id_number: data.id_number
        },
        include: { user: true }
      });
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
