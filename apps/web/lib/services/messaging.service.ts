import prisma from '../db/prisma';

export const MessagingService = {
  async sendSMS(to: string, message: string) {
    console.log(`[SMS] Sending to ${to}: ${message}`);
    return { success: true, provider: 'MOCK_SMS' };
  },

  async notifyAbsence(studentId: string, date: Date) {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { user: true, parent: { include: { user: true } } }
    });

    if (student?.parent?.user?.phone) {
      const message = `Dear Parent, ${student.user.first_name} was marked ABSENT today (${date.toLocaleDateString()}). Please contact the school for any clarification.`;
      await this.sendSMS(student.parent.user.phone, message);
    }
  },

  async broadcastAnnouncement(schoolId: string, data: {
    title: string;
    message: string;
    targetRole: string;
    gradeId?: string;
  }) {
    // In a real app, this would query users/parents and send SMS/Email via providers
    console.log(`[BROADCAST] ${data.title} to ${data.targetRole}: ${data.message}`);
    
    // Simulate finding targets
    const count = data.targetRole === 'PARENT' ? 150 : 25;
    
    return { sent: count };
  }
};
