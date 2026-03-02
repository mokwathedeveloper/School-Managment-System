import axios from 'axios';
import prisma from '../db/prisma';

export const ZoomService = {
  async getAccessToken(schoolId: string) {
    const integration = await prisma.integration.findUnique({
      where: { school_id_provider: { school_id: schoolId, provider: 'ZOOM' } }
    });

    if (!integration) throw new Error('Zoom not connected');

    // Check if expired
    if (integration.expires_at && new Date() < integration.expires_at) {
      return integration.access_token;
    }

    // Refresh token logic
    const auth = Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64');
    
    const res = await axios.post('https://zoom.us/oauth/token', null, {
      params: {
        grant_type: 'refresh_token',
        refresh_token: integration.refresh_token
      },
      headers: {
        Authorization: `Basic ${auth}`
      }
    });

    const { access_token, refresh_token, expires_in } = res.data;
    const expires_at = new Date(Date.now() + expires_in * 1000);

    await prisma.integration.update({
      where: { id: integration.id },
      data: { access_token, refresh_token, expires_at }
    });

    return access_token;
  },

  async createMeeting(schoolId: string, data: {
    topic: string;
    start_time: Date;
    duration: number;
  }) {
    const token = await this.getAccessToken(schoolId);

    const res = await axios.post('https://api.zoom.us/v2/users/me/meetings', {
      topic: data.topic,
      type: 2, // Scheduled meeting
      start_time: data.start_time.toISOString(),
      duration: data.duration,
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: true,
        auto_recording: 'cloud'
      }
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.data;
  }
};
