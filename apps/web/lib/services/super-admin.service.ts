import prisma from '../db/prisma';

export const SuperAdminService = {
  async getStats() {
    const [schoolCount, totalStudents, totalUsers] = await Promise.all([
      prisma.school.count(),
      prisma.student.count(),
      prisma.user.count()
    ]);

    return {
      schoolCount,
      totalStudents,
      totalUsers
    };
  },

  async getSchools() {
    return prisma.school.findMany({
      include: {
        _count: {
          select: {
            students: true,
            users: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });
  },

  async onboardSchool(data: { 
    name: string, 
    slug: string, 
    email: string,
    adminFirstName: string,
    adminLastName: string,
    adminEmail: string,
    temporalPassword: string
  }) {
    // 0. Pre-check slug uniqueness for better error message
    const existingSchool = await prisma.school.findUnique({ where: { slug: data.slug } });
    if (existingSchool) {
        throw new Error(`The URL slug "${data.slug}" is already in use. Please choose a different identifier.`);
    }

    // 0.1 Pre-check admin email uniqueness
    const adminEmail = data.adminEmail.toLowerCase();
    const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (existingUser) {
        throw new Error(`The administrator email "${adminEmail}" is already registered in the system.`);
    }

    const argon2 = await import('argon2');
    const passwordHash = await argon2.hash(data.temporalPassword);

    return prisma.$transaction(async (tx) => {
      // 1. Create the School
      const school = await tx.school.create({
        data: {
          name: data.name,
          slug: data.slug,
          email: data.email,
        }
      });

      // 2. Create the Admin User for this school
      const adminUser = await tx.user.create({
        data: {
          email: adminEmail,
          password: passwordHash,
          first_name: data.adminFirstName,
          last_name: data.adminLastName,
          role: 'SCHOOL_ADMIN',
          school_id: school.id,
        }
      });

      // 2.5 Create corresponding Staff record for the admin
      await tx.staff.create({
        data: {
          user_id: adminUser.id,
          school_id: school.id,
          designation: 'School Administrator',
          department: 'Administration',
        }
      });

      // 3. Create Default Academic Year
      const currentYear = new Date().getFullYear();
      const academicYear = await tx.academicYear.create({
        data: {
          school_id: school.id,
          name: `${currentYear}/${currentYear + 1}`,
          start_date: new Date(currentYear, 8, 1), // Sept 1st
          end_date: new Date(currentYear + 1, 6, 31), // July 31st
          is_active: true
        }
      });

      // Parallelize remaining setups to avoid transaction timeout
      const grades = [
        { name: 'Grade 1', level: 1 },
        { name: 'Grade 2', level: 2 },
        { name: 'Grade 3', level: 3 },
        { name: 'Grade 4', level: 4 },
        { name: 'Grade 5', level: 5 },
        { name: 'Grade 6', level: 6 },
        { name: 'Grade 7', level: 7 },
        { name: 'Grade 8', level: 8 },
        { name: 'Grade 9', level: 9 },
        { name: 'Grade 10', level: 10 },
        { name: 'Grade 11', level: 11 },
        { name: 'Grade 12', level: 12 },
      ];

      const subjects = [
        { name: 'Mathematics', code: 'MATH' },
        { name: 'English Language', code: 'ENG' },
        { name: 'Science', code: 'SCI' },
        { name: 'Social Studies', code: 'SOC' },
        { name: 'Physical Education', code: 'PE' },
        { name: 'Arts', code: 'ART' },
      ];

      await Promise.all([
        tx.term.createMany({
            data: [
              { school_id: school.id, academic_year_id: academicYear.id, name: 'Term 1', start_date: new Date(currentYear, 8, 1), end_date: new Date(currentYear, 11, 20), is_active: true },
              { school_id: school.id, academic_year_id: academicYear.id, name: 'Term 2', start_date: new Date(currentYear + 1, 0, 5), end_date: new Date(currentYear + 1, 3, 10) },
              { school_id: school.id, academic_year_id: academicYear.id, name: 'Term 3', start_date: new Date(currentYear + 1, 4, 1), end_date: new Date(currentYear + 1, 6, 31) },
            ]
        }),
        tx.gradeLevel.createMany({
            data: grades.map(g => ({ ...g, school_id: school.id }))
        }),
        tx.subject.createMany({
            data: subjects.map(s => ({ ...s, school_id: school.id }))
        })
      ]);

      return school;
    }, {
        timeout: 10000 // Extend timeout to 10 seconds for heavy onboarding
    });
  }
};
