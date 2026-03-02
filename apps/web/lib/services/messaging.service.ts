import prisma from '../db/prisma';
import { NotificationService } from './notification.service';
import { TemplateService } from './template.service';

export const MessagingService = {
  async sendSMS(to: string, message: string) {
    // Integration point for AWS SNS, Twilio, or Africa's Talking
    console.log(`[SMS DISPATCH] To: ${to} | Body: ${message}`);
    return { success: true, timestamp: new Date().toISOString() };
  },

  async sendEmail(to: string, subject: string, body: string) {
    // Integration point for Resend, SendGrid, or AWS SES
    console.log(`[EMAIL DISPATCH] To: ${to} | Subject: ${subject} | Body: ${body}`);
    return { success: true, timestamp: new Date().toISOString() };
  },

  async notifyAbsence(studentId: string, date: Date) {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { user: true, parent: { include: { user: true } } }
    });

    if (student?.parent?.user?.phone || student?.parent?.user?.email) {
      const { subject, body } = TemplateService.render('ABSENCE_ALERT', {
        student_name: `${student.user.first_name} ${student.user.last_name}`,
        date: date.toLocaleDateString()
      });

      if (student.parent.user.phone) {
        await this.sendSMS(student.parent.user.phone, body);
      }
      if (student.parent.user.email) {
        await this.sendEmail(student.parent.user.email, subject, body);
      }
    }
  },

  async broadcastAnnouncement(schoolId: string, data: {
    title: string;
    message: string;
    targetRole: string; // "STUDENT", "PARENT", "STAFF", "ALL"
  }) {
    // 1. Save to database
    const announcement = await prisma.announcement.create({
      data: {
        school_id: schoolId,
        title: data.title,
        content: data.message,
        target_role: data.targetRole,
      }
    });

    // 2. Identify target users for real-time notifications
    let usersToNotify: any[] = [];
    if (data.targetRole === 'ALL') {
      usersToNotify = await prisma.user.findMany({ where: { school_id: schoolId } });
    } else {
      usersToNotify = await prisma.user.findMany({ 
        where: { 
          school_id: schoolId,
          role: data.targetRole as any 
        } 
      });
    }

    // 3. Dispatch real-time notifications
    for (const user of usersToNotify) {
      await NotificationService.send({
        schoolId,
        userId: user.id,
        title: `📢 Announcement: ${data.title}`,
        message: data.message,
        type: 'SYSTEM',
        link: '/dashboard/announcements'
      });
    }

    return { sent: usersToNotify.length, announcement };
  }
};
