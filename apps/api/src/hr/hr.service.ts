import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HRService {
  constructor(private prisma: PrismaService) {}

  async getStaffDirectory(schoolId: string) {
    return this.prisma.staff.findMany({
      where: { school_id: schoolId },
      include: {
        user: true,
        _count: {
          select: { classes_managed: true }
        }
      },
      orderBy: { joining_date: 'desc' }
    });
  }

  async getStaffDetail(schoolId: string, id: string) {
    const staff = await this.prisma.staff.findFirst({
      where: { id, school_id: schoolId },
      include: {
        user: true,
        payroll_records: { orderBy: { year: 'desc' }, take: 12 },
        leaves: { orderBy: { start_date: 'desc' }, take: 10 }
      }
    });
    if (!staff) throw new NotFoundException('Staff member not found');
    return staff;
  }

  async processPayroll(schoolId: string, month: number, year: number) {
    const staffMembers = await this.prisma.staff.findMany({
      where: { school_id: schoolId, base_salary: { not: null } }
    });

    const results = { processed: 0, skipped: 0 };

    for (const staff of staffMembers) {
      // Check if already processed
      const existing = await this.prisma.payrollRecord.findUnique({
        where: { staff_id_month_year: { staff_id: staff.id, month, year } }
      });

      if (existing) {
        results.skipped++;
        continue;
      }

      const baseSalary = Number(staff.base_salary);
      // Logic for deductions (e.g. tax, insurance) would go here
      const netPay = baseSalary; 

      await this.prisma.payrollRecord.create({
        data: {
          school_id: schoolId,
          staff_id: staff.id,
          month,
          year,
          base_pay: baseSalary,
          net_pay: netPay,
          status: 'DRAFT'
        }
      });
      results.processed++;
    }

    return results;
  }

  async submitLeaveRequest(staffId: string, data: { type: string, start_date: Date, end_date: Date, reason?: string }) {
    return this.prisma.leaveRequest.create({
      data: {
        staff_id: staffId,
        ...data,
        status: 'PENDING'
      }
    });
  }
}
