import prisma from '../db/prisma';
import { NotificationService } from './notification.service';
import { TemplateService } from './template.service';
import { MessagingService } from './messaging.service';
import { Invoice, Payment, PaymentMethod, PaymentStatus, Prisma } from '@prisma/client';
import axios from 'axios';

export const FinanceService = {
  // --------------------------------------------------------
  // DASHBOARD & SUMMARY
  // --------------------------------------------------------

  async findAll(schoolId: string) {
    return prisma.invoice.findMany({
      where: { school_id: schoolId },
      include: {
        student: { include: { user: true } }
      },
      orderBy: { created_at: 'desc' }
    });
  },

  // --------------------------------------------------------
  // INVOICES & PAYMENTS
  // --------------------------------------------------------

  async getInvoices(schoolId: string) {
    return this.findAll(schoolId);
  },

  async createInvoice(schoolId: string, data: {
    student_id: string;
    title: string;
    amount: number;
    due_date: Date;
    items?: { name: string; amount: number }[];
  }) {
    return prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({
        data: {
          school_id: schoolId,
          student_id: data.student_id,
          title: data.title,
          amount: data.amount,
          due_date: data.due_date,
          status: 'PENDING'
        }
      });

      await tx.ledgerEntry.create({
        data: {
          school_id: schoolId,
          description: `Invoice: ${data.title}`,
          amount: data.amount,
          type: 'DEBIT',
          category: 'TUITION',
          reference_id: invoice.id,
        },
      });

      // Notify parent/student
      const student = await tx.student.findUnique({
        where: { id: data.student_id },
        include: { user: true, parent: { include: { user: true } } }
      });

      if (student) {
        const { body } = TemplateService.render('FEE_INVOICE', {
            name: student.user.first_name,
            amount: data.amount,
            student_name: `${student.user.first_name} ${student.user.last_name}`,
            invoice_id: invoice.id,
            due_date: data.due_date.toLocaleDateString()
        });

        await NotificationService.send({
          schoolId: schoolId,
          userId: student.user_id,
          title: 'New Invoice Generated',
          message: body,
          type: 'FINANCE',
          link: '/dashboard/finance/invoices'
        });

        if (student.parent) {
          await NotificationService.send({
            schoolId: schoolId,
            userId: student.parent.user_id,
            title: 'New Fee Invoice',
            message: body,
            type: 'FINANCE',
            link: '/dashboard/finance/invoices'
          });

          if (student.parent.user.phone) {
            await MessagingService.sendSMS(student.parent.user.phone, body);
          }
        }
      }

      return invoice;
    });
  },

  async recordPayment(schoolId: string, data: {
    invoice_id: string;
    amount: number;
    method: PaymentMethod;
    reference?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({
        where: { id: data.invoice_id },
        include: { student: { include: { user: true, parent: { include: { user: true } } } } }
      });

      if (!invoice) throw new Error('Invoice not found');

      const payment = await tx.payment.create({
        data: {
          school_id: schoolId,
          invoice_id: data.invoice_id,
          amount: data.amount,
          method: data.method,
          reference: data.reference,
          status: 'COMPLETED'
        }
      });

      const totalPaid = await tx.payment.aggregate({
        where: { invoice_id: data.invoice_id, status: 'COMPLETED' },
        _sum: { amount: true }
      });

      if (Number(totalPaid._sum.amount) >= Number(invoice.amount)) {
        await tx.invoice.update({
          where: { id: data.invoice_id },
          data: { status: 'PAID' }
        });
      }

      await tx.ledgerEntry.create({
        data: {
          school_id: schoolId,
          description: `Payment for: ${invoice.title}`,
          amount: data.amount,
          type: 'CREDIT',
          category: 'TUITION',
          reference_id: payment.id,
        },
      });

      await NotificationService.send({
        schoolId,
        userId: invoice.student.user_id,
        title: 'Payment Received',
        message: `Your payment of ${data.amount} for invoice "${invoice.title}" has been confirmed.`,
        type: 'FINANCE'
      });

      if (invoice.student.parent) {
        await NotificationService.send({
          schoolId,
          userId: invoice.student.parent.user_id,
          title: 'Payment Confirmed',
          message: `Fee payment of ${data.amount} for ${invoice.student.admission_no} has been successfully recorded.`,
          type: 'FINANCE'
        });
      }

      return payment;
    });
  },

  // --------------------------------------------------------
  // EXPENSES
  // --------------------------------------------------------

  async getExpenses(schoolId: string) {
    return prisma.expense.findMany({
      where: { school_id: schoolId },
      orderBy: { date: 'desc' }
    });
  },

  async recordExpense(schoolId: string, userId: string, data: any) {
    const staff = await prisma.staff.findUnique({ where: { user_id: userId } });
    
    return prisma.$transaction(async (tx) => {
      const expense = await tx.expense.create({
        data: {
          school_id: schoolId,
          recorded_by_id: staff?.id,
          title: data.title,
          amount: data.amount,
          category: data.category,
          date: new Date(data.date),
          notes: data.notes
        }
      });

      await tx.ledgerEntry.create({
        data: {
          school_id: schoolId,
          description: `Expense: ${data.title}`,
          amount: data.amount,
          type: 'CREDIT',
          category: 'OPERATIONAL',
          reference_id: expense.id,
        }
      });

      return expense;
    });
  },

  // --------------------------------------------------------
  // FEE STRUCTURES & BULK INVOICING
  // --------------------------------------------------------

  async getFeeStructures(schoolId: string) {
    return prisma.feeStructure.findMany({
      where: { school_id: schoolId },
      include: {
        grade: true,
        term: true,
        items: true
      }
    });
  },

  async createFeeStructure(schoolId: string, data: any) {
    const totalAmount = data.items.reduce((sum: number, item: any) => sum + Number(item.amount), 0);
    return prisma.feeStructure.create({
      data: {
        school_id: schoolId,
        grade_id: data.grade_id,
        term_id: data.term_id,
        total_amount: totalAmount,
        items: {
          create: data.items
        }
      }
    });
  },

  async generateBulkInvoices(schoolId: string, gradeId: string, termId: string) {
    const [feeStructure, students, term] = await Promise.all([
      prisma.feeStructure.findFirst({
        where: { school_id: schoolId, grade_id: gradeId, term_id: termId },
        include: { items: true }
      }),
      prisma.student.findMany({
        where: { school_id: schoolId, class: { grade_id: gradeId } }
      }),
      prisma.term.findUnique({ where: { id: termId } })
    ]);

    if (!feeStructure) throw new Error('No fee structure found for this grade and term');
    
    const totalAmount = feeStructure.items.reduce((sum, item) => sum + Number(item.amount), 0);
    const dueDate = term?.end_date || new Date();

    const results = [];
    for (const student of students) {
      const invoice = await this.createInvoice(schoolId, {
        student_id: student.id,
        title: `${feeStructure.items[0]?.name || 'Term Fees'} - ${term?.name}`,
        amount: totalAmount,
        due_date: dueDate
      });
      results.push(invoice);
    }

    return { processed: results.length };
  },

  async getTerms(schoolId: string) {
    return prisma.term.findMany({
      where: { academic_year: { school_id: schoolId } },
      orderBy: { start_date: 'desc' }
    });
  },

  // --------------------------------------------------------
  // M-PESA GATEWAY (KENYA)
  // --------------------------------------------------------

  async initiateStkPush(schoolId: string, data: { phone: string; amount: number; invoiceId: string }) {
    console.log(`[MPESA GATEWAY] Initiating STK Push for ${data.phone} - Amount: ${data.amount}`);
    return { success: true, MerchantRequestID: `REQ-${Date.now()}`, CheckoutRequestID: `CHK-${Date.now()}` };
  },

  async handleMpesaCallback(checkoutRequestID: string, resultCode: number, data: any) {
    if (resultCode === 0) {
      const payment = await prisma.payment.findFirst({
        where: { reference: checkoutRequestID }
      });

      if (payment && payment.invoice_id) {
        await this.recordPayment(payment.school_id, {
          invoice_id: payment.invoice_id,
          amount: Number(payment.amount),
          method: 'MPESA',
          reference: `MP-${checkoutRequestID}`
        });
      }
    }
  }
};
