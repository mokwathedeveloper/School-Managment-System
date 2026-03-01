import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { LibraryService } from '@/lib/services/library.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { copyId: string } }
) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const result = await LibraryService.returnBook(session.schoolId, params.copyId);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
