import prisma from '../db/prisma';

export const ParentsService = {
  async getChildren(userId: string) {
    const parent = await prisma.parent.findUnique({
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

    return parent?.students || [];
  },

  async getParentProfile(userId: string) {
    return prisma.parent.findUnique({
      where: { user_id: userId },
      include: { user: true, school: true }
    });
  }
};
