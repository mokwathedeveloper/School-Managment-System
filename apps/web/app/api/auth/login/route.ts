import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';
import { handleApiError, ApiError } from '@/lib/server/api-utils';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = loginSchema.safeParse(body);

    if (!validated.success) { throw validated.error; }

    const { email, password } = validated.data;
    const user = await AuthService.validateUser(email, password);

    if (!user) {
      throw new ApiError('Invalid credentials', 401);
    }

    const result = await AuthService.login(user);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
