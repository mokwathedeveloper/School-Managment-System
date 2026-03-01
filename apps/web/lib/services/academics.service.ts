
import prisma from '../db/prisma';

export const AcademicsService = {
  async getStudentReport(schoolId: string, studentId: string, termId: string) {
    const [student, term, attendance, results, invoices] = await Promise.all([
      prisma.student.findFirst({
        where: { id: studentId, school_id: schoolId },
        include: { user: true, class: { include: { grade: true } } }
      }),
      prisma.term.findFirst({ where: { id: termId, school_id: schoolId } }),
      prisma.attendance.findMany({
        where: { student_id: studentId, school_id: schoolId }, // Usually filter by term dates too
      }),
      prisma.result.findMany({
        where: { student_id: studentId, student: { school_id: schoolId } },
        include: { exam: { include: { subject: true } } }
      }),
      prisma.invoice.findMany({
        where: { student_id: studentId, school_id: schoolId }
      })
    ]);

    if (!student) throw new Error('Student not found');

    // Group results by subject
    const subjectResults: any = {};
    results.forEach(r => {
      const subName = r.exam.subject.name;
      if (!subjectResults[subName]) {
        subjectResults[subName] = {
          subject: subName,
          totalMarks: 0,
          maxPossible: 0,
          exams: []
        };
      }
      subjectResults[subName].totalMarks += r.marks_obtained;
      subjectResults[subName].maxPossible += r.exam.max_marks;
      subjectResults[subName].exams.push(r);
    });

    const academics = Object.values(subjectResults);

    // Attendance stats
    const attendanceStats = {
      PRESENT: attendance.filter(a => a.status === 'PRESENT').length,
      ABSENT: attendance.filter(a => a.status === 'ABSENT').length,
      total: attendance.length || 1 // Avoid division by zero
    };

    // Finance stats
    const totalInvoiced = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
    const totalPaid = invoices.filter(inv => inv.status === 'PAID').reduce((sum, inv) => sum + Number(inv.amount), 0);

    return {
      studentInfo: {
        name: `${student.user.first_name} ${student.user.last_name}`,
        admissionNo: student.admission_no,
        class: student.class ? `${student.class.grade.name} ${student.class.name}` : 'Not Assigned'
      },
      termName: term?.name || 'Current Term',
      academics,
      attendance: attendanceStats,
      finance: {
        totalInvoiced,
        totalPaid,
        balance: totalInvoiced - totalPaid
      }
    };
  }
};
