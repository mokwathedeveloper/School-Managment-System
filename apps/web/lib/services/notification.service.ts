import prisma from '../db/prisma';
import { pusher } from '../server/pusher';
import { NotificationType } from '@prisma/client';

export const NotificationService = {
  async send({
    schoolId,
    userId,
    title,
    message,
    type = 'SYSTEM',
    link,
  }: {
    schoolId: string;
    userId: string;
    title: string;
    message: string;
    type?: NotificationType;
    link?: string;
  }) {
    // 1. Save to database for persistence
    const notification = await prisma.notification.create({
      data: {
        school_id: schoolId,
        user_id: userId,
        title,
        message,
        type,
        link,
      },
    });

    // 2. Trigger real-time event via Pusher
    // Channel name is user-specific for privacy
    try {
        await pusher.trigger(`user-${userId}`, 'notification:new', notification);
    } catch (error) {
        console.error('Pusher trigger failed:', error);
        // We don't throw here as the database record is already created
    }

    return notification;
  },

  async getByUser(userId: string, schoolId?: string) {
    return prisma.notification.findMany({
      where: { 
        user_id: userId,
        ...(schoolId ? { school_id: schoolId } : {})
      },
      orderBy: { created_at: 'desc' },
      take: 20,
    });
  },

  async markAsRead(id: string, userId: string) {
    return prisma.notification.update({
      where: { id, user_id: userId },
      data: { is_read: true },
    });
  },

  async markAllAsRead(userId: string, schoolId?: string) {
    return prisma.notification.updateMany({
      where: { 
        user_id: userId, 
        ...(schoolId ? { school_id: schoolId } : {}),
        is_read: false 
      },
      data: { is_read: true },
    });
  }
};
