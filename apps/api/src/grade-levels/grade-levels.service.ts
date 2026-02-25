import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GradeLevelsService {
  constructor(private prisma: PrismaService) {}

  async create(schoolId: string, data: { name: string; level: number }) {
    return this.prisma.gradeLevel.create({
      data: {
        ...data,
        school_id: schoolId,
      },
    });
  }

  async findAll(schoolId: string) {
    return this.prisma.gradeLevel.findMany({
      where: { school_id: schoolId },
      include: {
        classes: {
          include: {
            _count: {
              select: { students: true },
            },
          },
        },
      },
      orderBy: { level: 'asc' },
    });
  }

  async findOne(schoolId: string, id: string) {
    const gradeLevel = await this.prisma.gradeLevel.findFirst({
      where: { id, school_id: schoolId },
      include: {
        classes: true,
      },
    });
    if (!gradeLevel) throw new NotFoundException('Grade Level not found');
    return gradeLevel;
  }
}
