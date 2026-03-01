import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { handleApiError, ApiError } from '@/lib/server/api-utils';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const school = await prisma.school.findUnique({
      where: { slug: params.slug },
      include: {
        grade_levels: {
          orderBy: { level: 'asc' },
          select: { id: true, name: true }
        }
      }
    });

    if (!school) {
      throw new ApiError('School not found', 404);
    }

    // Public info only
    return NextResponse.json({
      id: school.id,
      name: school.name,
      slug: school.slug,
      logo: school.logo,
      grades: school.grade_levels
    });
  } catch (error) {
    return handleApiError(error);
  }
}
