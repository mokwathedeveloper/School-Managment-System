import prisma from '../db/prisma';
import { Student, Prisma, Role } from '@prisma/client';
import * as argon2 from 'argon2';

export const StudentsService = {
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
    const passwordHash = await argon2.hash(process.env.DEFAULT_STUDENT_PASSWORD || 'password123'); 
    
    return prisma.$transaction(async (tx) => {
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
  },

  async findAll(schoolId: string, query: { search?: string; classId?: string; skip?: number; take?: number }) {
    const { search, classId, skip = 0, take = 10 } = query;
    
    const where: Prisma.StudentWhereInput = {
      school_id: schoolId,
      ...(classId && { class_id: classId }),
      ...(search && {
        OR: [
          { admission_no: { contains: search, mode: 'insensitive' as any } },
          { user: { first_name: { contains: search, mode: 'insensitive' as any } } },
          { user: { last_name: { contains: search, mode: 'insensitive' as any } } },
        ]
      })
    };

    const [items, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip,
        take,
        include: {
          user: true,
          class: true,
        },
        orderBy: { created_at: 'desc' }
      }),
      prisma.student.count({ where })
    ]);

    return { items, total };
  },

  async findOne(schoolId: string, id: string) {
    const student = await prisma.student.findFirst({
      where: { id, school_id: schoolId },
      include: {
        user: true,
        class: true,
        parent: {
            include: { user: true }
        }
      }
    });
    return student;
  },

  async findByAdmissionNo(schoolId: string, admissionNo: string) {
    return prisma.student.findFirst({
      where: { admission_no: admissionNo, school_id: schoolId },
      include: {
        user: true,
        class: { include: { grade: true } }
      }
    });
  },

  async bulkImport(schoolId: string, students: any[]) {
    const passwordHash = await argon2.hash('student123');
    let imported = 0;
    const errors: any[] = [];

    for (const data of students) {
      try {
        await prisma.$transaction(async (tx) => {
          const user = await tx.user.create({
            data: {
              email: data.email,
              password: passwordHash,
              first_name: data.first_name,
              last_name: data.last_name,
              role: 'STUDENT',
              school_id: schoolId,
            },
          });

          await tx.student.create({
            data: {
              user_id: user.id,
              school_id: schoolId,
              admission_no: data.admission_no,
              gender: data.gender,
              dob: data.dob ? new Date(data.dob) : null,
              class_id: data.class_id || null,
            },
          });
        });
        imported++;
      } catch (e: any) {
        errors.push({ admission_no: data.admission_no, error: e.message });
      }
    }

    return { imported, errors };
  },

  async update(schoolId: string, id: string, data: Prisma.StudentUpdateInput) {
    // Ensure student belongs to school before updating
    const student = await this.findOne(schoolId, id);
    if (!student) throw new Error('Student not found in this school');

    return prisma.student.update({
      where: { id },
      data,
      include: { user: true, class: true }
    });
  },

  async remove(schoolId: string, id: string) {
    const student = await this.findOne(schoolId, id);
    if (!student) throw new Error('Student not found in this school');

    return prisma.$transaction(async (tx) => {
      await tx.student.delete({ where: { id } });
      await tx.user.delete({ where: { id: student.user_id } });
    });
  }
};
