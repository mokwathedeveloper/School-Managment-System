import prisma from '../db/prisma';

export const LmsService = {
  // Assignments
  async getAssignmentsByClass(schoolId: string, classId: string) {
    return prisma.assignment.findMany({
      where: { school_id: schoolId, class_id: classId },
      include: {
        subject: true,
        class: true,
      },
      orderBy: { created_at: 'desc' }
    });
  },

  async createAssignment(schoolId: string, data: {
    class_id: string;
    subject_id: string;
    title: string;
    description?: string;
    due_date: Date;
  }) {
    return prisma.assignment.create({
      data: {
        ...data,
        school_id: schoolId
      },
      include: {
        subject: true,
        class: true,
      }
    });
  },

  // Resources
  async getResources(schoolId: string) {
    return prisma.resource.findMany({
      where: { school_id: schoolId },
      include: {
        subject: true,
      },
      orderBy: { created_at: 'desc' }
    });
  },

  async createResource(schoolId: string, data: {
    title: string;
    file_url?: string;
    category?: string;
    subject_id?: string;
  }) {
    return prisma.resource.create({
      data: {
        ...data,
        school_id: schoolId
      },
      include: {
        subject: true,
      }
    });
  }
};
