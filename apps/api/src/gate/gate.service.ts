import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GateService {
  constructor(private prisma: PrismaService) {}

  async registerVisitor(schoolId: string, data: { full_name: string, id_number?: string, phone?: string, email?: string }) {
    return this.prisma.visitor.create({
      data: { ...data, school_id: schoolId }
    });
  }

  async checkIn(schoolId: string, visitorId: string, data: { purpose: string, whom_to_see?: string }) {
    // Check if already in campus
    const active = await this.prisma.visitRecord.findFirst({
      where: { visitor_id: visitorId, status: 'IN_CAMPUS' }
    });

    if (active) throw new BadRequestException('Visitor is already checked in.');

    return this.prisma.visitRecord.create({
      data: {
        visitor_id: visitorId,
        purpose: data.purpose,
        whom_to_see: data.whom_to_see,
        status: 'IN_CAMPUS'
      }
    });
  }

  async checkOut(visitId: string) {
    return this.prisma.visitRecord.update({
      where: { id: visitId },
      data: {
        check_out: new Date(),
        status: 'CHECKED_OUT'
      }
    });
  }

  async getActiveVisitors(schoolId: string) {
    return this.prisma.visitRecord.findMany({
      where: { 
        status: 'IN_CAMPUS',
        visitor: { school_id: schoolId }
      },
      include: { visitor: true },
      orderBy: { check_in: 'desc' }
    });
  }

  async getVisitors(schoolId: string) {
    return this.prisma.visitor.findMany({
      where: { school_id: schoolId },
      orderBy: { created_at: 'desc' }
    });
  }
}
