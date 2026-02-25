import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Class, Prisma } from '@prisma/client';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async create(schoolId: string, data: { name: string, grade_id: string, term_id?: string, form_teacher_id?: string }) {
    return this.prisma.class.create({
      data: {
        ...data,
        school_id: schoolId,
      },
    });
  }

  async findAll(schoolId: string) {
    return this.prisma.class.findMany({
      where: { school_id: schoolId },
      include: {
        grade: true,
        form_teacher: {
            include: { user: true }
        },
        _count: {
            select: { students: true }
        }
      },
      orderBy: { 
        grade: {
          level: 'asc'
        }
      }
    });
  }

  async findOne(schoolId: string, id: string) {
    const classRecord = await this.prisma.class.findFirst({
      where: { id, school_id: schoolId },
      include: {
        students: {
            include: { user: true }
        },
        form_teacher: {
            include: { user: true }
        }
      }
    });
    if (!classRecord) throw new NotFoundException('Class not found');
    return classRecord;
  }
}
