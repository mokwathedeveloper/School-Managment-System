import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Student, Prisma, Role } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';

@Injectable()
export class StudentsService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService
  ) {}

  async create(schoolId: string, data: {
    email: string;
    first_name: string;
    last_name: string;
    admission_no: string;
    dob?: Date;
    gender?: string;
    class_id?: string;
    parent_id?: string;
  }) {
    // 1. Create User account first
    const defaultPassword = this.config.get<string>('DEFAULT_STUDENT_PASSWORD', 'password123');
    const passwordHash = await argon2.hash(defaultPassword); 
    
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: passwordHash,
          first_name: data.first_name,
          last_name: data.last_name,
          role: Role.STUDENT,
          school_id: schoolId,
        },
      });

      // 2. Create Student profile
      return tx.student.create({
        data: {
          user_id: user.id,
          school_id: schoolId,
          admission_no: data.admission_no,
          dob: data.dob,
          gender: data.gender,
          class_id: data.class_id,
          parent_id: data.parent_id,
        },
        include: {
            user: true,
            class: true,
            parent: {
                include: {
                    user: true
                }
            }
        }
      });
    });
  }

  async bulkImport(schoolId: string, students: any[]) {
    const defaultPassword = this.config.get<string>('DEFAULT_STUDENT_PASSWORD', 'password123');
    const passwordHash = await argon2.hash(defaultPassword);
    const results = { imported: 0, errors: [] };

    for (const data of students) {
      try {
        await this.prisma.$transaction(async (tx) => {
          const user = await tx.user.create({
            data: {
              email: data.email,
              password: passwordHash,
              first_name: data.first_name,
              last_name: data.last_name,
              role: Role.STUDENT,
              school_id: schoolId,
            },
          });

          await tx.student.create({
            data: {
              user_id: user.id,
              school_id: schoolId,
              admission_no: data.admission_no,
              dob: data.dob ? new Date(data.dob) : null,
              gender: data.gender,
              class_id: data.class_id,
            },
          });
        });
        results.imported++;
      } catch (error) {
        results.errors.push({ admission_no: data.admission_no, error: error.message });
      }
    }

    return results;
  }

  async findAll(schoolId: string, query: { search?: string; classId?: string; skip?: number; take?: number }) {
    const { search, classId, skip = 0, take = 10 } = query;
    
    const where: Prisma.StudentWhereInput = {
      school_id: schoolId,
      ...(classId && { class_id: classId }),
      ...(search && {
        OR: [
          { admission_no: { contains: search, mode: 'insensitive' } },
          { user: { first_name: { contains: search, mode: 'insensitive' } } },
          { user: { last_name: { contains: search, mode: 'insensitive' } } },
        ]
      })
    };

    const [items, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        skip,
        take,
        include: {
          user: true,
          class: true,
        },
        orderBy: { created_at: 'desc' }
      }),
      this.prisma.student.count({ where })
    ]);

    return { items, total };
  }

  async findOne(schoolId: string, id: string) {
    const student = await this.prisma.student.findFirst({
      where: { id, school_id: schoolId },
      include: {
        user: true,
        class: true,
        parent: {
            include: { user: true }
        }
      }
    });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }
}
