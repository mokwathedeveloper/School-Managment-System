import { NextRequest } from 'next/server';
import { AuthService } from '../services/auth.service';

export async function getSession(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  const payload = await AuthService.verifyToken(token);

  if (!payload) {
    return null;
  }

  return {
    userId: payload.sub as string,
    email: payload.email as string,
    role: payload.role as string,
    schoolId: payload.school_id as string,
  };
}
