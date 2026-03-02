import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { MessagingService } from '@/lib/services/messaging.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';
import prisma from '@/lib/db/prisma';

const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Content is required'),
  targetRole: z.string().min(1, 'Target role is required'),
});

export async function GET(req: NextRequest) {
    try {
        const session = await getSession(req);
        if (!session) throw new ApiError('Unauthorized', 401);

        const announcements = await prisma.announcement.findMany({
            where: { school_id: session.schoolId },
            orderBy: { created_at: 'desc' },
            take: 20
        });

        return NextResponse.json(announcements);
    } catch (error) { 
        return handleApiError(error); 
    }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);
    
    // RBAC: Only Admin/Staff can send announcements
    if (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN' && session.role !== 'STAFF') {
        throw new ApiError('Forbidden: Only staff can send announcements', 403);
    }

    const body = await req.json();
    const validated = announcementSchema.safeParse(body);
    
    if (!validated.success) {
      throw new ApiError('Invalid input: ' + validated.error.message, 400);
    }

    const result = await MessagingService.broadcastAnnouncement(session.schoolId, validated.data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) { 
    return handleApiError(error); 
  }
}
