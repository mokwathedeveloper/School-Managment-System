import { google } from 'googleapis';
import prisma from '../db/prisma';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const GoogleService = {
  async getAuthUrl(schoolId: string) {
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/classroom.courses.readonly',
        'https://www.googleapis.com/auth/classroom.coursework.students',
        'https://www.googleapis.com/auth/classroom.announcements'
      ],
      state: schoolId,
      prompt: 'consent'
    });
  },

  async handleCallback(schoolId: string, code: string) {
    const { tokens } = await oauth2Client.getToken(code);
    
    // Store tokens in database
    return prisma.integration.upsert({
      where: { school_id_provider: { school_id: schoolId, provider: 'GOOGLE' } },
      update: {
        access_token: tokens.access_token!,
        refresh_token: tokens.refresh_token,
        expires_at: tokens.expiry_date ? new Date(tokens.expiry_date) : null
      },
      create: {
        school_id: schoolId,
        provider: 'GOOGLE',
        access_token: tokens.access_token!,
        refresh_token: tokens.refresh_token,
        expires_at: tokens.expiry_date ? new Date(tokens.expiry_date) : null
      }
    });
  },

  async syncClassroomCourses(schoolId: string) {
    const integration = await prisma.integration.findUnique({
      where: { school_id_provider: { school_id: schoolId, provider: 'GOOGLE' } }
    });

    if (!integration) throw new Error('Google Classroom not connected');

    oauth2Client.setCredentials({
      access_token: integration.access_token,
      refresh_token: integration.refresh_token!,
    });

    const classroom = google.classroom({ version: 'v1', auth: oauth2Client });
    const res = await classroom.courses.list();
    return res.data.courses;
  }
};
