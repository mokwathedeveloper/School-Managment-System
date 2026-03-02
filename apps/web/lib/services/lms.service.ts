import prisma from '../db/prisma';
import { NotificationService } from './notification.service';

export const LmsService = {
  // Assignments
  async getAssignmentsByClass(schoolId: string, classId: string) {
    return prisma.assignment.findMany({
      where: { school_id: schoolId, class_id: classId },
      include: {
        subject: true,
        class: true,
        _count: {
          select: { submissions: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });
  },

  async findAssignment(schoolId: string, id: string) {
    return prisma.assignment.findFirst({
      where: { id, school_id: schoolId },
      include: {
        subject: true,
        class: true,
        submissions: {
          include: {
            student: { include: { user: true } }
          }
        }
      }
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

  // Submissions
  async submitAssignment(studentId: string, assignmentId: string, data: {
    content?: string;
    file_url?: string;
  }) {
    // Check if assignment exists
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId }
    });

    if (!assignment) throw new Error('Assignment not found');

    const now = new Date();
    const status = now > assignment.due_date ? 'LATE' : 'SUBMITTED';

    return prisma.submission.upsert({
      where: {
        assignment_id_student_id: {
          assignment_id: assignmentId,
          student_id: studentId
        }
      },
      update: {
        content: data.content,
        file_url: data.file_url,
        status: status,
        submitted_at: now
      },
      create: {
        assignment_id: assignmentId,
        student_id: studentId,
        content: data.content,
        file_url: data.file_url,
        status: status,
        submitted_at: now
      }
    });
  },

  async getSubmissions(assignmentId: string) {
    return prisma.submission.findMany({
      where: { assignment_id: assignmentId },
      include: {
        student: { include: { user: true } },
        graded_by: { include: { user: true } }
      },
      orderBy: { submitted_at: 'desc' }
    });
  },

  async gradeSubmission(submissionId: string, gradedByStaffId: string, data: {
    grade: number;
    feedback?: string;
  }) {
    const submission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        grade: data.grade,
        feedback: data.feedback,
        graded_by_id: gradedByStaffId,
        status: 'GRADED'
      },
      include: {
        assignment: { select: { title: true, school_id: true } },
        student: { select: { user_id: true } }
      }
    });

    // Notify student
    await NotificationService.send({
      schoolId: submission.assignment.school_id,
      userId: submission.student.user_id,
      title: 'Assignment Graded',
      message: `Your submission for "${submission.assignment.title}" has been graded. Grade: ${data.grade}%`,
      type: 'ACADEMIC',
      link: `/dashboard/lms/assignments/${submission.assignment_id}`
    });

    return submission;
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
