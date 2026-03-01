import prisma from '../db/prisma';

export const AlumniService = {
  async findAll(schoolId: string) {
    return prisma.alumnus.findMany({
      where: { school_id: schoolId },
      orderBy: { graduation_year: 'desc' }
    });
  },

  async create(schoolId: string, data: any) {
    return prisma.alumnus.create({
      data: { ...data, school_id: schoolId }
    });
  }
};

export const CalendarService = {
  async getEvents(schoolId: string, start: Date, end: Date) {
    return prisma.calendarEvent.findMany({
      where: {
        school_id: schoolId,
        start_date: { gte: start },
        end_date: { lte: end }
      },
      orderBy: { start_date: 'asc' }
    });
  },

  async create(schoolId: string, data: any) {
    return prisma.calendarEvent.create({
      data: { ...data, school_id: schoolId }
    });
  }
};

export const ConductService = {
  async findAll(schoolId: string) {
    return prisma.disciplineRecord.findMany({
      where: { school_id: schoolId },
      include: {
        student: {
          include: { 
            user: true,
            class: true
          }
        },
        reported_by: {
          include: { user: true }
        }
      },
      orderBy: { incident_date: 'desc' }
    });
  },

  async create(schoolId: string, data: any) {
    return prisma.disciplineRecord.create({
      data: { ...data, school_id: schoolId }
    });
  }
};

export const HealthService = {
  async getVisits(schoolId: string) {
    return prisma.clinicVisit.findMany({
      where: { school_id: schoolId },
      include: {
        medical_record: {
          include: {
            student: {
              include: { user: true }
            }
          }
        },
        attended_by: {
          include: { user: true }
        }
      },
      orderBy: { visit_date: 'desc' }
    });
  },

  async create(schoolId: string, data: any) {
    // Check if student has medical record
    let medicalRecord = await prisma.medicalRecord.findUnique({
      where: { student_id: data.student_id }
    });

    if (!medicalRecord) {
      medicalRecord = await prisma.medicalRecord.create({
        data: { student_id: data.student_id }
      });
    }

    return prisma.clinicVisit.create({
      data: {
        school_id: schoolId,
        medical_record_id: medicalRecord.id,
        symptoms: data.symptoms,
        diagnosis: data.diagnosis,
        visit_date: new Date(data.visit_date)
      }
    });
  }
};

export const InventoryService = {
  async getAssets(schoolId: string) {
    return prisma.asset.findMany({
      where: { school_id: schoolId },
      orderBy: { name: 'asc' }
    });
  },

  async createAsset(schoolId: string, data: any) {
    return prisma.asset.create({
      data: { ...data, school_id: schoolId }
    });
  },

  async removeAsset(schoolId: string, id: string) {
    return prisma.asset.delete({
      where: { id, school_id: schoolId }
    });
  },

  async getStock(schoolId: string) {
    return prisma.stockItem.findMany({
      where: { school_id: schoolId },
      orderBy: { name: 'asc' }
    });
  },

  async createStock(schoolId: string, data: any) {
    return prisma.stockItem.create({
      data: { ...data, school_id: schoolId }
    });
  },

  async removeStock(schoolId: string, id: string) {
    return prisma.stockItem.delete({
      where: { id, school_id: schoolId }
    });
  },

  async updateStockQuantity(schoolId: string, id: string, change: number) {
    return prisma.stockItem.update({
      where: { id, school_id: schoolId },
      data: {
        quantity: { increment: change }
      }
    });
  }
};

export const SecurityService = {
  async getActiveVisits(schoolId: string) {
    return prisma.visitRecord.findMany({
      where: { 
        status: 'IN_CAMPUS',
        visitor: { school_id: schoolId }
      },
      include: {
        visitor: true
      },
      orderBy: { check_in: 'desc' }
    });
  },

  async getVisitors(schoolId: string) {
    return prisma.visitor.findMany({
      where: { school_id: schoolId },
      orderBy: { created_at: 'desc' }
    });
  },

  async createVisitor(schoolId: string, data: any) {
    const visitor = await prisma.visitor.create({
      data: {
        school_id: schoolId,
        full_name: data.full_name,
        id_number: data.id_number
      }
    });

    return prisma.visitRecord.create({
      data: {
        visitor_id: visitor.id,
        purpose: data.purpose,
        whom_to_see: data.whom_to_see,
        status: 'IN_CAMPUS'
      }
    });
  },

  async checkOut(schoolId: string, visitId: string) {
    const visit = await prisma.visitRecord.findFirst({
      where: { id: visitId, visitor: { school_id: schoolId } }
    });
    if (!visit) throw new Error('Visit record not found');

    return prisma.visitRecord.update({
      where: { id: visitId },
      data: {
        status: 'EXITED',
        check_out: new Date()
      }
    });
  }
};
