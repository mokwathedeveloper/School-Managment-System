import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { GoogleService } from '@/lib/services/google.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session);

    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (code) {
      // Handle OAuth callback
      await GoogleService.handleCallback(tenantId, code);
      return NextResponse.redirect(new URL('/dashboard/settings?integration=google&status=success', req.url));
    }

    // Return Auth URL
    const url = await GoogleService.getAuthUrl(tenantId);
    return NextResponse.json({ url });
  } catch (error) {
    return handleApiError(error);
  }
}
