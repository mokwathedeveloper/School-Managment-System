import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LibraryService {
  constructor(private prisma: PrismaService) {}

  // --------------------------------------------------------
  // CATALOG
  // --------------------------------------------------------

  async getCatalog(schoolId: string) {
    return this.prisma.book.findMany({
      where: { school_id: schoolId },
      include: {
        _count: {
          select: { copies: true }
        },
        copies: true
      }
    });
  }

  async createBook(schoolId: string, data: any) {
    const { copiesCount, ...bookData } = data;
    return this.prisma.book.create({
      data: {
        ...bookData,
        school_id: schoolId,
        copies: {
          create: Array.from({ length: copiesCount || 1 }).map((_, i) => ({
            barcode: `${bookData.isbn || 'BOOK'}-${Date.now()}-${i}`,
            status: 'AVAILABLE'
          }))
        }
      },
      include: { copies: true }
    });
  }

  // --------------------------------------------------------
  // BORROWING
  // --------------------------------------------------------

  async borrowBook(schoolId: string, data: { copyId: string, studentId: string, dueDate: Date }) {
    const copy = await this.prisma.bookCopy.findUnique({
      where: { id: data.copyId },
      include: { book: true }
    });

    if (!copy || copy.book.school_id !== schoolId) throw new NotFoundException('Book copy not found');
    if (copy.status !== 'AVAILABLE') throw new BadRequestException('Book is currently unavailable');

    return this.prisma.$transaction(async (tx) => {
      // 1. Create Borrow Record
      const record = await tx.borrowRecord.create({
        data: {
          copy_id: data.copyId,
          student_id: data.studentId,
          due_date: data.dueDate,
          status: 'BORROWED'
        }
      });

      // 2. Update Copy Status
      await tx.bookCopy.update({
        where: { id: data.copyId },
        data: { status: 'BORROWED' }
      });

      return record;
    });
  }

  async returnBook(schoolId: string, copyId: string) {
    const record = await this.prisma.borrowRecord.findFirst({
      where: { copy_id: copyId, status: 'BORROWED' }
    });

    if (!record) throw new NotFoundException('Active borrow record not found');

    return this.prisma.$transaction(async (tx) => {
      await tx.borrowRecord.update({
        where: { id: record.id },
        data: {
          return_date: new Date(),
          status: 'RETURNED'
        }
      });

      await tx.bookCopy.update({
        where: { id: copyId },
        data: { status: 'AVAILABLE' }
      });

      return { success: true };
    });
  }

  async getActiveBorrows(schoolId: string) {
    return this.prisma.borrowRecord.findMany({
      where: {
        status: 'BORROWED',
        copy: { book: { school_id: schoolId } }
      },
      include: {
        copy: { include: { book: true } },
        student: { include: { user: true } }
      },
      orderBy: { due_date: 'asc' }
    });
  }
}
