
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/server/auth';
import { UsersService } from '@/lib/services/users.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const user = await UsersService.findById(session.userId);
    if (!user) throw new ApiError('User not found', 404);

    // Remove sensitive data
    const { password, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) throw new ApiError('Unauthorized', 401);

    const body = await req.json();
    
    // Only allow updating certain fields
    const allowedUpdates = ['first_name', 'last_name', 'password', 'phone'];
    const updateData: any = {};
    
    allowedUpdates.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    const updatedUser = await UsersService.update(session.userId, updateData);
    
    const { password, ...safeUser } = updatedUser;
    return NextResponse.json(safeUser);
  } catch (error) {
    return handleApiError(error);
  }
}
