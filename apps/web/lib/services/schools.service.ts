import prisma from '../db/prisma';
import { School, Prisma } from '@prisma/client';

export const SchoolsService = {
  async create(data: Prisma.SchoolCreateInput): Promise<School> {
    return prisma.school.create({
      data,
    });
  },

  async findAll(): Promise<School[]> {
    return prisma.school.findMany();
  },

  async findOne(id: string): Promise<School | null> {
    return prisma.school.findUnique({
      where: { id },
    });
  },

  async findBySlug(slug: string): Promise<School | null> {
    return prisma.school.findUnique({
      where: { slug },
    });
  },

  async update(id: string, data: Prisma.SchoolUpdateInput): Promise<School> {
    return prisma.school.update({
      where: { id },
      data,
    });
  },

  async remove(id: string): Promise<School> {
    return prisma.school.delete({
      where: { id },
    });
  }
};
