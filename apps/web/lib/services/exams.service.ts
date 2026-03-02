import prisma from '../db/prisma';

export const ExamsService = {
  async create(schoolId: string, data: any) {
    return prisma.exam.create({
      data: {
        school_id: schoolId,
        term_id: data.term_id,
        subject_id: data.subject_id,
        grading_system_id: data.grading_system_id,
        name: data.name,
        date: new Date(data.date),
        max_marks: data.max_marks || 100
      }
    });
  },

  async findAll(schoolId: string) {
    return prisma.exam.findMany({
      where: { school_id: schoolId },
      include: {
        subject: true,
        term: true,
        _count: { select: { results: true } }
      },
      orderBy: { date: 'desc' }
    });
  },

  async findOne(schoolId: string, id: string) {
    return prisma.exam.findFirst({
      where: { id, school_id: schoolId },
      include: {
        subject: true,
        term: true,
        results: { include: { student: { include: { user: true } } } }
      }
    });
  },

  async saveResults(schoolId: string, examId: string, records: { student_id: string, marks: number, remarks?: string }[]) {
    const exam = await prisma.exam.findFirst({
      where: { id: examId, school_id: schoolId }
    });
    if (!exam) throw new Error('Exam not found');

    const results = [];
    for (const record of records) {
      // Auto-grading logic (can be made dynamic based on GradingSystem later)
      let grade = 'E';
      const percentage = (record.marks / exam.max_marks) * 100;
      
      if (percentage >= 80) grade = 'A';
      else if (percentage >= 70) grade = 'B';
      else if (percentage >= 60) grade = 'C';
      else if (percentage >= 50) grade = 'D';

      const result = await prisma.result.upsert({
        where: {
          exam_id_student_id: {
            exam_id: examId,
            student_id: record.student_id
          }
        },
        update: {
          marks_obtained: record.marks,
          grade,
          remarks: record.remarks
        },
        create: {
          exam_id: examId,
          student_id: record.student_id,
          marks_obtained: record.marks,
          grade,
          remarks: record.remarks
        }
      });
      results.push(result);
    }
    return results;
  }
};
