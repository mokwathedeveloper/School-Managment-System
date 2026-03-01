import prisma from '../db/prisma';

export const LibraryService = {
  async getCatalog(schoolId: string) {
    return prisma.book.findMany({
      where: { school_id: schoolId },
      include: {
        _count: { select: { copies: true } }
      },
      orderBy: { title: 'asc' }
    });
  },

  async createBook(schoolId: string, data: any) {
    return prisma.book.create({
      data: {
        ...data,
        school_id: schoolId,
        copies: {
          create: [{ barcode: `BC-${Date.now()}` }] // Create first copy automatically
        }
      }
    });
  },

  async getActiveBorrows(schoolId: string) {
    return prisma.borrowRecord.findMany({
      where: { 
        status: 'BORROWED',
        copy: { book: { school_id: schoolId } }
      },
      include: {
        student: { include: { user: true } },
        copy: { include: { book: true } }
      },
      orderBy: { due_date: 'asc' }
    });
  },

  async createBorrow(schoolId: string, data: any) {
    // Find available copy
    const copy = await prisma.bookCopy.findFirst({
      where: { 
        barcode: data.barcode, 
        status: 'AVAILABLE',
        book: { school_id: schoolId }
      }
    });

    if (!copy) throw new Error('Copy not available or not found');

    return prisma.$transaction(async (tx) => {
      await tx.bookCopy.update({
        where: { id: copy.id },
        data: { status: 'BORROWED' }
      });

      return tx.borrowRecord.create({
        data: {
          student_id: data.student_id,
          copy_id: copy.id,
          due_date: new Date(data.due_date),
          status: 'BORROWED'
        }
      });
    });
  },

  async returnBook(schoolId: string, copyId: string) {
    // Security check: ensure book belongs to school
    const copy = await prisma.bookCopy.findFirst({
      where: { id: copyId, book: { school_id: schoolId } }
    });
    if (!copy) throw new Error('Book copy not found');

    return prisma.$transaction(async (tx) => {
      await tx.borrowRecord.updateMany({
        where: { copy_id: copyId, status: 'BORROWED' },
        data: { 
          status: 'RETURNED',
          return_date: new Date()
        }
      });

      return tx.bookCopy.update({
        where: { id: copyId },
        data: { status: 'AVAILABLE' }
      });
    });
  }
};
