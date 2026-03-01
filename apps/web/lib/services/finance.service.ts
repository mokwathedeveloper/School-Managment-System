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
  },

  // --------------------------------------------------------
  // FEE STRUCTURES & BULK BILLING
  // --------------------------------------------------------

  async getFeeStructures(schoolId: string) {
    return prisma.feeStructure.findMany({
      where: { school_id: schoolId },
      include: {
        grade: true,
        term: true,
        items: true
      },
      orderBy: { created_at: 'desc' }
    });
  },

  async createFeeStructure(schoolId: string, data: {
    grade_id: string;
    term_id: string;
    items: { name: string, amount: number }[];
  }) {
    const totalAmount = data.items.reduce((sum, item) => sum + item.amount, 0);

    return prisma.feeStructure.create({
      data: {
        school_id: schoolId,
        grade_id: data.grade_id,
        term_id: data.term_id,
        total_amount: totalAmount,
        items: {
          create: data.items
        }
      },
      include: {
        items: true
      }
    });
  },

  async generateBulkInvoices(schoolId: string, gradeId: string, termId: string) {
    const feeStructure = await prisma.feeStructure.findFirst({
      where: { school_id: schoolId, grade_id: gradeId, term_id: termId },
      include: { items: true, term: true }
    });

    if (!feeStructure) throw new Error('No fee structure defined for this grade and term');

    const students = await prisma.student.findMany({
      where: { school_id: schoolId, class: { grade_id: gradeId } }
    });

    let created = 0;
    let skipped = 0;

    for (const student of students) {
      // Check if invoice already exists for this student/term/title
      const title = `${feeStructure.term.name} Fees`;
      const existing = await prisma.invoice.findFirst({
        where: { student_id: student.id, title, school_id: schoolId }
      });

      if (existing) {
        skipped++;
        continue;
      }

      await this.createInvoice({
        school_id: schoolId,
        student_id: student.id,
        title,
        amount: Number(feeStructure.total_amount),
        due_date: feeStructure.term.end_date,
        items: feeStructure.items
      });
      created++;
    }

    return { created, skipped };
  },

  async getTerms(schoolId: string) {
    return prisma.term.findMany({
      where: { school_id: schoolId },
      orderBy: { start_date: 'desc' }
    });
  },

  async initiateStkPush(schoolId: string, data: { invoice_id: string, phone_number: string }) {
    const school = await prisma.school.findUnique({ where: { id: schoolId } });
    const invoice = await prisma.invoice.findUnique({ where: { id: data.invoice_id } });
    
    if (!invoice || invoice.school_id !== schoolId) throw new Error('Invoice not found');

    const token = await this.getMpesaToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');

    try {
      const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        {
          BusinessShortCode: process.env.MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: Math.round(Number(invoice.amount)),
          PartyA: data.phone_number.replace('+', ''),
          PartyB: process.env.MPESA_SHORTCODE,
          PhoneNumber: data.phone_number.replace('+', ''),
          CallBackURL: process.env.MPESA_CALLBACK_URL,
          AccountReference: invoice.id.slice(0, 12),
          TransactionDesc: `Fees Payment ${invoice.title}`
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Create a pending payment record
      await prisma.payment.create({
        data: {
          school_id: schoolId,
          invoice_id: invoice.id,
          amount: invoice.amount,
          method: 'MPESA',
          status: 'PENDING',
          reference: response.data.CheckoutRequestID,
          phone_number: data.phone_number
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('STK Push Error:', error.response?.data || error.message);
      throw new Error('Failed to initiate M-Pesa payment');
    }
  },

  async handleMpesaCallback(body: any) {
    const { Body } = body;
    const stkCallback = Body.stkCallback;
    const checkoutRequestID = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;

    if (resultCode === 0) {
      // Success
      const meta = stkCallback.CallbackMetadata.Item;
      const amount = meta.find((i: any) => i.Name === 'Amount').Value;
      const receipt = meta.find((i: any) => i.Name === 'MpesaReceiptNumber').Value;

      const payment = await prisma.payment.findFirst({
        where: { reference: checkoutRequestID }
      });

      if (payment) {
        await prisma.$transaction([
          prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'COMPLETED', mpesa_receipt: receipt }
          }),
          prisma.invoice.update({
            where: { id: payment.invoice_id! },
            data: { status: 'PAID' }
          }),
          prisma.ledgerEntry.create({
            data: {
              school_id: payment.school_id,
              description: `M-Pesa Payment Recv: ${receipt}`,
              amount: payment.amount,
              type: 'CREDIT',
              category: 'PAYMENT',
              reference_id: payment.id
            }
          })
        ]);
      }
    } else {
      // Failed or Cancelled
      await prisma.payment.updateMany({
        where: { reference: checkoutRequestID },
        data: { status: 'FAILED' }
      });
    }
  }
};
