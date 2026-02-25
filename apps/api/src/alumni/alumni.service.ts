import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlumniService {
  constructor(private prisma: PrismaService) {}

  async createAlumnus(schoolId: string, data: any) {
    return this.prisma.alumnus.create({
      data: { ...data, school_id: schoolId }
    });
  }

  async getAlumni(schoolId: string) {
    return this.prisma.alumnus.findMany({
      where: { school_id: schoolId },
      orderBy: { graduation_year: 'desc' }
    });
  }

  async updateAlumnus(id: string, data: any) {
    return this.prisma.alumnus.update({
      where: { id },
      data
    });
  }
}
