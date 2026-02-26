import prisma from '../db/prisma';
import { User, Prisma } from '@prisma/client';

export const UsersService = {
  async findOne(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
      include: {
        school: true,
      }
    });
  },

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data,
    });
  }
};
