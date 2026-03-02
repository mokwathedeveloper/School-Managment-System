import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { GoogleService } from '@/lib/services/google.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (code) {
      // Handle OAuth callback
      await GoogleService.handleCallback(session.schoolId, code);
      return NextResponse.redirect(new URL('/dashboard/settings?integration=google&status=success', req.url));
    }

    // Return Auth URL
    const url = await GoogleService.getAuthUrl(session.schoolId);
    return NextResponse.json({ url });
  } catch (error) {
    return handleApiError(error);
  }
}
