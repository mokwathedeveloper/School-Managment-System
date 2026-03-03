import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { enforceRole, enforceTenant, ROLE_GROUPS, ROLES } from '@/lib/authz';
import { LibraryService } from '@/lib/services/library.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { copyId: string } }
) {
  try {
    const session = await getSession(req);
    const tenantId = enforceTenant(session) as string;

    const result = await LibraryService.returnBook(tenantId, params.copyId);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
