import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { School, Prisma } from '@prisma/client';

@Injectable()
export class SchoolsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.SchoolCreateInput): Promise<School> {
    return this.prisma.school.create({
      data,
    });
  }

  async findAll(): Promise<School[]> {
    return this.prisma.school.findMany();
  }

  async findOne(id: string): Promise<School> {
    const school = await this.prisma.school.findUnique({
      where: { id },
    });
    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
    return school;
  }

  async findBySlug(slug: string): Promise<School> {
    const school = await this.prisma.school.findUnique({
      where: { slug },
    });
    if (!school) {
      throw new NotFoundException(`School with slug ${slug} not found`);
    }
    return school;
  }

  async update(id: string, data: Prisma.SchoolUpdateInput): Promise<School> {
    return this.prisma.school.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<School> {
    return this.prisma.school.delete({
      where: { id },
    });
  }
}
