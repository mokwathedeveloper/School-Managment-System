import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Invoice, Payment, PaymentStatus, PaymentMethod } from '@prisma/client';
import { MessagingService } from '../messaging/messaging.service';
import axios from 'axios';

@Injectable()
export class FinanceService {
  private readonly logger = new Logger(FinanceService.name);

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private messaging: MessagingService
  ) {}

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
    return this.prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({
        data: {
          school_id: data.school_id,
          student_id: data.student_id,
          title: data.title,
          amount: data.amount,
          due_date: data.due_date,
          items: data.items,
          status: 'UNPAID',
        },
      });

      // Create Ledger Entry (Debit student account)
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
  }

  async getInvoicesByStudent(student_id: string) {
    return this.prisma.invoice.findMany({
      where: { student_id },
      orderBy: { created_at: 'desc' },
    });
  }

  async findAll(school_id: string) {
    return this.prisma.invoice.findMany({
      where: { school_id },
      include: {
        student: {
          include: { user: true }
        }
      },
      orderBy: { created_at: 'desc' },
    });
  }

  // --------------------------------------------------------
  // EXPENSES
  // --------------------------------------------------------

  async recordExpense(schoolId: string, staffUserId: string, data: any) {
    const staff = await this.prisma.staff.findUnique({ where: { user_id: staffUserId } });

    return this.prisma.expense.create({
      data: {
        ...data,
        amount: Number(data.amount),
        date: new Date(data.date),
        school_id: schoolId,
        recorded_by_id: staff?.id
      }
    });
  }

  async getExpenses(schoolId: string) {
    return this.prisma.expense.findMany({
      where: { school_id: schoolId },
      include: {
        recorded_by: { include: { user: true } }
      },
      orderBy: { date: 'desc' }
    });
  }

  // --------------------------------------------------------
  // FEE STRUCTURES
  // --------------------------------------------------------

  async createFeeStructure(schoolId: string, data: {
    grade_id: string;
    term_id: string;
    items: { name: string; amount: number; is_optional?: boolean }[];
  }) {
    const total_amount = data.items.reduce((sum, item) => sum + item.amount, 0);

    return this.prisma.feeStructure.create({
      data: {
        school_id: schoolId,
        grade_id: data.grade_id,
        term_id: data.term_id,
        total_amount,
        items: {
          create: data.items,
        },
      },
      include: {
        items: true,
      },
    });
  }

  async getFeeStructures(schoolId: string) {
    return this.prisma.feeStructure.findMany({
      where: { school_id: schoolId },
      include: {
        grade: true,
        term: true,
        items: true,
      },
    });
  }

  /**
   * Bulk generate invoices for all students in a specific Grade and Term
   */
  async generateBulkInvoices(schoolId: string, gradeId: string, termId: string) {
    const feeStructure = await this.prisma.feeStructure.findUnique({
      where: { grade_id_term_id: { grade_id: gradeId, term_id: termId } },
      include: { items: true, term: true },
    });

    if (!feeStructure) {
      throw new NotFoundException('Fee structure not found for this grade and term');
    }

    const students = await this.prisma.student.findMany({
      where: { 
        school_id: schoolId,
        class: { grade_id: gradeId }
      },
    });

    const results = {
      created: 0,
      skipped: 0,
    };

    for (const student of students) {
      // Check if invoice already exists
      const existing = await this.prisma.invoice.findFirst({
        where: {
          student_id: student.id,
          title: `Fee: ${feeStructure.term.name}`,
        },
      });

      if (existing) {
        results.skipped++;
        continue;
      }

      await this.createInvoice({
        school_id: schoolId,
        student_id: student.id,
        title: `Fee: ${feeStructure.term.name}`,
        amount: Number(feeStructure.total_amount),
        due_date: feeStructure.term.end_date, // Default due date to term end
        items: feeStructure.items,
      });
      results.created++;
    }

    return results;
  }

  // --------------------------------------------------------
  // M-PESA INTEGRATION (DARAJA API)
  // --------------------------------------------------------

  private async getMpesaToken() {
    const consumerKey = this.config.get('MPESA_CONSUMER_KEY');
    const consumerSecret = this.config.get('MPESA_CONSUMER_SECRET');
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    try {
      const response = await axios.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        { headers: { Authorization: `Basic ${auth}` } }
      );
      return response.data.access_token;
    } catch (error) {
      this.logger.error('Failed to get M-Pesa token', error.response?.data || error.message);
      throw new BadRequestException('M-Pesa authentication failed');
    }
  }

  async initiateStkPush(invoice_id: string, phoneNumber: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoice_id },
      include: { school: true },
    });

    if (!invoice) throw new NotFoundException('Invoice not found');
    if (invoice.status === 'PAID') throw new BadRequestException('Invoice already paid');

    const token = await this.getMpesaToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(
      `${this.config.get('MPESA_SHORTCODE')}${this.config.get('MPESA_PASSKEY')}${timestamp}`
    ).toString('base64');

    const callbackUrl = this.config.get('MPESA_CALLBACK_URL');
    
    // Create a pending payment record
    const payment = await this.prisma.payment.create({
      data: {
        school_id: invoice.school_id,
        invoice_id: invoice.id,
        amount: invoice.amount,
        method: PaymentMethod.MPESA,
        status: PaymentStatus.PENDING,
        phone_number: phoneNumber,
      },
    });

    try {
      const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/query', // Use proper endpoint in production
        {
          BusinessShortCode: this.config.get('MPESA_SHORTCODE'),
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: Math.round(Number(invoice.amount)),
          PartyA: phoneNumber,
          PartyB: this.config.get('MPESA_SHORTCODE'),
          PhoneNumber: phoneNumber,
          CallBackURL: `${callbackUrl}/${payment.id}`,
          AccountReference: invoice.title.substring(0, 12),
          TransactionDesc: `Fee payment for ${invoice.id}`,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return {
        merchant_request_id: response.data.MerchantRequestID,
        checkout_request_id: response.data.CheckoutRequestID,
        payment_id: payment.id,
      };
    } catch (error) {
      this.logger.error('STK Push failed', error.response?.data || error.message);
      throw new BadRequestException('M-Pesa STK Push failed');
    }
  }

  async handleMpesaCallback(paymentId: string, callbackData: any) {
    const body = callbackData.Body.stkCallback;
    
    // 1. Check if transaction was successful
    if (body.ResultCode !== 0) {
      await this.prisma.payment.update({
        where: { id: paymentId },
        data: { status: PaymentStatus.FAILED },
      });
      return { success: false, message: body.ResultDesc };
    }

    // 2. Extract metadata
    const metadata = body.CallbackMetadata.Item;
    const receipt = metadata.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value;
    const amount = metadata.find((i: any) => i.Name === 'Amount')?.Value;
    const phoneNumber = metadata.find((i: any) => i.Name === 'PhoneNumber')?.Value;

    // 3. Process with Idempotency & Transaction
    return this.prisma.$transaction(async (tx) => {
      // Check if this receipt has already been processed (Idempotency)
      const existingPayment = await tx.payment.findUnique({
        where: { mpesa_receipt: receipt }
      });

      if (existingPayment && existingPayment.status === PaymentStatus.COMPLETED) {
        this.logger.warn(`Duplicate M-Pesa callback received for receipt: ${receipt}`);
        return { success: true, message: 'Already processed' };
      }

      const payment = await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.COMPLETED,
          mpesa_receipt: receipt,
          amount: amount ? Number(amount) : undefined,
          phone_number: phoneNumber ? phoneNumber.toString() : undefined,
        },
      });

      // Update Invoice Status
      if (payment.invoice_id) {
        const invoice = await tx.invoice.findUnique({
          where: { id: payment.invoice_id },
          include: { payments: true }
        });

        if (invoice) {
          const totalPaid = invoice.payments
            .filter(p => p.status === PaymentStatus.COMPLETED)
            .reduce((sum, p) => sum + Number(p.amount), 0) + Number(amount);

          await tx.invoice.update({
            where: { id: invoice.id },
            data: {
              status: totalPaid >= Number(invoice.amount) ? 'PAID' : 'PARTIAL'
            }
          });
        }
      }

      // Credit Ledger (Finalize reconciliation)
      await tx.ledgerEntry.create({
        data: {
          school_id: payment.school_id,
          description: `M-Pesa Payment Reconciliation: ${receipt}`,
          amount: payment.amount,
          type: 'CREDIT',
          category: 'PAYMENT',
          reference_id: payment.id,
        },
      });

      // Trigger Notification
      this.messaging.notifyPaymentCompletion(paymentId);

      return { success: true };
    });
  }
}
