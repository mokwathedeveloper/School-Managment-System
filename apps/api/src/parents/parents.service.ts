import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ParentsService {
  constructor(private prisma: PrismaService) {}

  async getChildren(userId: string) {
    const parent = await this.prisma.parent.findUnique({
      where: { user_id: userId },
      include: {
        students: {
          include: {
            user: true,
            class: {
              include: { grade: true }
            }
          }
        }
      }
    });

    if (!parent) throw new NotFoundException('Parent profile not found');
    return parent.students;
  }

  async getParentProfile(userId: string) {
    return this.prisma.parent.findUnique({
      where: { user_id: userId },
      include: { user: true, school: true }
    });
  }
}
