import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  // --------------------------------------------------------
  // GRADING SYSTEMS
  // --------------------------------------------------------

  async createGradingSystem(schoolId: string, data: { name: string, grades: { grade: string, min_score: number, max_score: number, remarks?: string }[] }) {
    return this.prisma.gradingSystem.create({
      data: {
        school_id: schoolId,
        name: data.name,
        grades: {
          create: data.grades
        }
      },
      include: { grades: true }
    });
  }

  async getGradingSystems(schoolId: string) {
    return this.prisma.gradingSystem.findMany({
      where: { school_id: schoolId },
      include: { grades: true }
    });
  }

  // --------------------------------------------------------
  // EXAMS
  // --------------------------------------------------------

  async createExam(schoolId: string, data: {
    name: string;
    date: Date;
    term_id: string;
    subject_id: string;
    grading_system_id?: string;
    max_marks: number;
  }) {
    return this.prisma.exam.create({
      data: {
        ...data,
        school_id: schoolId,
      }
    });
  }

  async findAll(schoolId: string) {
    return this.prisma.exam.findMany({
      where: { school_id: schoolId },
      include: {
        subject: true,
        term: true,
        grading_system: true,
        _count: { select: { results: true } }
      },
      orderBy: { date: 'desc' }
    });
  }

  // --------------------------------------------------------
  // RESULTS & GRADING LOGIC
  // --------------------------------------------------------

  async enterResults(schoolId: string, examId: string, records: { student_id: string, marks: number, remarks?: string }[]) {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
      include: { grading_system: { include: { grades: true } } }
    });

    if (!exam) throw new NotFoundException('Exam not found');

    const resultPromises = records.map(async (record) => {
      let grade = null;
      
      // Auto-calculate grade if rubric exists
      if (exam.grading_system) {
        // Calculate percentage if max_marks > 0
        const percentage = (record.marks / exam.max_marks) * 100;
        const boundary = exam.grading_system.grades.find(
          g => percentage >= g.min_score && percentage <= g.max_score
        );
        grade = boundary?.grade || null;
      }

      return this.prisma.result.upsert({
        where: {
          exam_id_student_id: {
            exam_id: examId,
            student_id: record.student_id
          }
        },
        update: {
          marks_obtained: record.marks,
          grade: grade,
          remarks: record.remarks
        },
        create: {
          exam_id: examId,
          student_id: record.student_id,
          marks_obtained: record.marks,
          grade: grade,
          remarks: record.remarks
        }
      });
    });

    return Promise.all(resultPromises);
  }

  async getExamResults(examId: string) {
    return this.prisma.result.findMany({
      where: { exam_id: examId },
      include: {
        student: {
          include: { user: true }
        }
      },
      orderBy: { marks_obtained: 'desc' }
    });
  }
}
