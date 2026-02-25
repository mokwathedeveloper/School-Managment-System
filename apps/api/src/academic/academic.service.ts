import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AcademicService {
  constructor(private prisma: PrismaService) {}

  async getStudentReport(studentId: string, termId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: true,
        class: { include: { grade: true } },
        school: true,
      },
    });

    if (!student) throw new NotFoundException('Student not found');

    // 1. Get all results for the term
    const results = await this.prisma.result.findMany({
      where: {
        student_id: studentId,
        exam: { term_id: termId },
      },
      include: {
        exam: {
          include: { subject: true },
        },
      },
    });

    // 2. Aggregate by subject
    const subjectGrades = results.reduce((acc, curr) => {
      const subjectName = curr.exam.subject.name;
      if (!acc[subjectName]) {
        acc[subjectName] = {
          subject: subjectName,
          exams: [],
          totalMarks: 0,
          maxPossible: 0,
        };
      }
      acc[subjectName].exams.push({
        examName: curr.exam.name,
        marks: curr.marks_obtained,
        max: curr.exam.max_marks,
        grade: curr.grade,
      });
      acc[subjectName].totalMarks += curr.marks_obtained;
      acc[subjectName].maxPossible += curr.exam.max_marks;
      return acc;
    }, {});

    // 3. Get Attendance Summary for the term
    const term = await this.prisma.term.findUnique({ where: { id: termId } });
    const attendanceRecords = await this.prisma.attendance.findMany({
      where: {
        student_id: studentId,
        date: { gte: term.start_date, lte: term.end_date },
      },
    });

    const attendanceSummary = attendanceRecords.reduce(
      (acc, curr) => {
        acc[curr.status]++;
        acc.total++;
        return acc;
      },
      { PRESENT: 0, ABSENT: 0, LATE: 0, EXCUSED: 0, total: 0 }
    );

    // 4. Get Finance Status (Balance)
    const invoices = await this.prisma.invoice.findMany({
      where: { student_id: studentId, school_id: student.school_id },
      include: { payments: true }
    });

    const totalInvoiced = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
    const totalPaid = invoices.reduce((sum, inv) => 
      sum + inv.payments.filter(p => p.status === 'COMPLETED').reduce((ps, p) => ps + Number(p.amount), 0), 0
    );

    return {
      studentInfo: {
        name: `${student.user.first_name} ${student.user.last_name}`,
        admissionNo: student.admission_no,
        class: `${student.class?.grade.name} ${student.class?.name}`,
      },
      termName: term.name,
      academics: Object.values(subjectGrades),
      attendance: attendanceSummary,
      finance: {
        totalInvoiced,
        totalPaid,
        balance: totalInvoiced - totalPaid,
      },
    };
  }
}
