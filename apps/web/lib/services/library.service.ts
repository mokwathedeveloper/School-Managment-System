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
