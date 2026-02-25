import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LMSService {
  constructor(private prisma: PrismaService) {}

  // --------------------------------------------------------
  // ASSIGNMENTS
  // --------------------------------------------------------

  async createAssignment(schoolId: string, data: {
    class_id: string;
    subject_id: string;
    title: string;
    description?: string;
    due_date: Date;
  }) {
    return this.prisma.assignment.create({
      data: { ...data, school_id: schoolId }
    });
  }

  async getClassAssignments(classId: string) {
    return this.prisma.assignment.findMany({
      where: { class_id: classId },
      include: { subject: true },
      orderBy: { due_date: 'asc' }
    });
  }

  // --------------------------------------------------------
  // RESOURCES (Notes, E-books)
  // --------------------------------------------------------

  async uploadResource(schoolId: string, data: {
    title: string;
    file_url: string;
    category: string;
    subject_id?: string;
  }) {
    return this.prisma.resource.create({
      data: { ...data, school_id: schoolId }
    });
  }

  async getResources(schoolId: string, subjectId?: string) {
    return this.prisma.resource.findMany({
      where: { 
        school_id: schoolId,
        ...(subjectId && { subject_id: subjectId })
      },
      include: { subject: true },
      orderBy: { created_at: 'desc' }
    });
  }
}
