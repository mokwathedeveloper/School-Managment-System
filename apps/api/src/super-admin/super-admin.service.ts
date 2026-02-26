import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {  } from '@prisma/client';

@Injectable()
export class SuperAdminService {
  constructor(private prisma: PrismaService) {}

  async getPlatformStats() {
    const [schoolCount, totalStudents, totalUsers] = await Promise.all([
      this.prisma.school.count(),
      this.prisma.student.count(),
      this.prisma.user.count(),
    ]);

    return {
      schoolCount,
      totalStudents,
      totalUsers,
    };
  }

  async getAllSchools() {
    return this.prisma.school.findMany({
      include: {
        _count: {
          select: { students: true, users: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async createSchool(data: { name: string; slug: string; adminEmail: string; adminFirstName: string; adminLastName: string }) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Create the School
      const school = await tx.school.create({
        data: {
          name: data.name,
          slug: data.slug,
        }
      });

      // 2. Create the first School Admin
      // Note: In production, trigger a password reset email
      const passwordHash = "$argon2id$v=19$m=65536,t=3,p=4$6Y..." // Use a real hash or temp pass
      
      await tx.user.create({
        data: {
          email: data.adminEmail,
          password: passwordHash,
          first_name: data.adminFirstName,
          last_name: data.adminLastName,
          role: "SCHOOL_ADMIN",
          school_id: school.id
        }
      });

      return school;
    });
  }
}
