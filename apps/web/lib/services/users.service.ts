import prisma from '../db/prisma';
import { User, Prisma } from '@prisma/client';
import * as argon2 from 'argon2';

export const UsersService = {
  async findOne(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
      include: {
        school: true,
      }
    });
  },

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: { school: true }
    });
  },

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data,
    });
  },

  async update(id: string, data: any): Promise<User> {
    const updateData: any = { ...data };
    
    if (data.password) {
      updateData.password = await argon2.hash(data.password);
      updateData.password_changed = true;
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
    });
  }
};
