import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagingService {
  private readonly logger = new Logger(MessagingService.name);

  constructor(private prisma: PrismaService) {}

  async sendSMS(to: string, message: string) {
    // In production, integrate with Africa's Talking, Twilio, etc.
    this.logger.log(`[SMS] Sending to ${to}: ${message}`);
    return { success: true, provider: 'MOCK_SMS' };
  }

  async sendEmail(to: string, subject: string, body: string) {
    // In production, integrate with SendGrid, Mailgun, etc.
    this.logger.log(`[Email] Sending to ${to}: ${subject}`);
    return { success: true, provider: 'MOCK_EMAIL' };
  }

  // Automated Triggers
  
  async notifyAbsence(studentId: string, date: Date) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: { user: true, parent: { include: { user: true } } }
    });

    if (student?.parent?.user?.phone) {
      const message = `Dear Parent, ${student.user.first_name} was marked ABSENT today (${date.toLocaleDateString()}). Please contact the school for any clarification.`;
      await this.sendSMS(student.parent.user.phone, message);
    }
  }

  async notifyPaymentCompletion(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { invoice: { include: { student: { include: { user: true, parent: { include: { user: true } } } } } } }
    });

    const parentPhone = payment?.invoice?.student?.parent?.user?.phone;
    if (parentPhone) {
      const message = `Payment Received! KES ${payment.amount} has been successfully credited to ${payment.invoice.student.user.first_name}'s account. Receipt: ${payment.mpesa_receipt}.`;
      await this.sendSMS(parentPhone, message);
    }
  }

  async sendAnnouncement(schoolId: string, data: { 
    title: string; 
    message: string; 
    targetRole?: string; 
    gradeId?: string;
  }) {
    // 1. Find target users
    const users = await this.prisma.user.findMany({
      where: {
        school_id: schoolId,
        ...(data.targetRole && { role: data.targetRole }),
        ...(data.gradeId && {
          student: {
            class: { grade_id: data.gradeId }
          }
        })
      },
      select: { phone: true, first_name: true }
    });

    const results = { sent: 0, failed: 0 };

    // 2. Dispatch messages (In production, use a Queue/BullMQ)
    for (const user of users) {
      if (user.phone) {
        const personalizedMessage = `Hello ${user.first_name}, ${data.message}`;
        await this.sendSMS(user.phone, personalizedMessage);
        results.sent++;
      } else {
        results.failed++;
      }
    }

    return results;
  }
}
