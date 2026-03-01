import prisma from '../db/prisma';
import { Invoice, Payment, PaymentMethod, PaymentStatus } from '@prisma/client';
import axios from 'axios';

export const FinanceService = {
  // --------------------------------------------------------
  // INVOICES
  // --------------------------------------------------------

  async createInvoice(data: {
    school_id: string;
    student_id: string;
    title: string;
    amount: number;
    due_date: Date;
    items?: any;
  }) {
    return prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({
        data: {
          school_id: data.school_id,
          student_id: data.student_id,
          title: data.title,
          amount: data.amount,
          due_date: data.due_date,
          items: data.items || null,
          status: 'UNPAID',
        },
      });

      await tx.ledgerEntry.create({
        data: {
          school_id: data.school_id,
          description: `Invoice: ${data.title}`,
          amount: data.amount,
          type: 'DEBIT',
          category: 'TUITION',
          reference_id: invoice.id,
        },
      });

      return invoice;
    });
  },

  async getInvoicesByStudent(schoolId: string, student_id: string) {
    return prisma.invoice.findMany({
      where: { student_id, school_id: schoolId },
      orderBy: { created_at: 'desc' },
    });
  },

  async findAll(school_id: string) {
    return prisma.invoice.findMany({
      where: { school_id },
      include: {
        student: {
          include: { user: true }
        }
      },
      orderBy: { created_at: 'desc' },
    });
  },

  // --------------------------------------------------------
  // EXPENSES
  // --------------------------------------------------------

  async recordExpense(schoolId: string, staffUserId: string, data: any) {
    const staff = await prisma.staff.findUnique({ where: { user_id: staffUserId } });

    return prisma.expense.create({
      data: {
        ...data,
        amount: Number(data.amount),
        date: new Date(data.date),
        school_id: schoolId,
        recorded_by_id: staff?.id
      }
    });
  },

  async getExpenses(schoolId: string) {
    return prisma.expense.findMany({
      where: { school_id: schoolId },
      include: {
        recorded_by: { include: { user: true } }
      },
      orderBy: { date: 'desc' }
    });
  },

  // --------------------------------------------------------
  // M-PESA INTEGRATION
  // --------------------------------------------------------

  async getMpesaToken() {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    try {
      const response = await axios.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        { headers: { Authorization: `Basic ${auth}` } }
      );
      return response.data.access_token;
    } catch (error: any) {
      console.error('Failed to get M-Pesa token', error.response?.data || error.message);
      throw new Error('M-Pesa authentication failed');
    }
  }
};
