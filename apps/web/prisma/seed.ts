import { PrismaClient, Role } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  const passwordHash = await argon2.hash('password123');

  // 1. Create Platform Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'super@schoolos.com' },
    update: {},
    create: {
      email: 'super@schoolos.com',
      first_name: 'System',
      last_name: 'Administrator',
      password: passwordHash,
      role: Role.SUPER_ADMIN,
      password_changed: true,
    },
  });
  console.log('✅ Super Admin created:', superAdmin.email);

  // 2. Create School
  const school = await prisma.school.upsert({
    where: { slug: 'schoolos-academy' },
    update: {},
    create: {
      name: 'SchoolOS Academy',
      slug: 'schoolos-academy',
      email: 'admin@schoolos.com',
      phone: '+254700000000',
      address: '123 Education Lane, Silicon Valley',
      website: 'www.schoolos.com',
    },
  });
  console.log('🏫 School created:', school.name);

  // 3. Create School Admin
  const schoolAdmin = await prisma.user.upsert({
    where: { email: 'admin@schoolos.com' },
    update: {},
    create: {
      email: 'admin@schoolos.com',
      first_name: 'Principal',
      last_name: 'Skinner',
      password: passwordHash,
      role: Role.SCHOOL_ADMIN,
      school_id: school.id,
      password_changed: true,
    },
  });
  console.log('✅ School Admin created:', schoolAdmin.email);

  // 4. Create Academic Year and Terms
  const currentYear = new Date().getFullYear();
  let academicYear = await prisma.academicYear.findFirst({
    where: { school_id: school.id, name: `${currentYear}/${currentYear + 1}` }
  });

  if (!academicYear) {
    academicYear = await prisma.academicYear.create({
        data: {
          school_id: school.id,
          name: `${currentYear}/${currentYear + 1}`,
          start_date: new Date(currentYear, 8, 1),
          end_date: new Date(currentYear + 1, 6, 31),
          is_active: true,
          terms: {
            create: [
              { school_id: school.id, name: 'Term 1', start_date: new Date(currentYear, 8, 1), end_date: new Date(currentYear, 11, 20) },
              { school_id: school.id, name: 'Term 2', start_date: new Date(currentYear + 1, 0, 5), end_date: new Date(currentYear + 1, 3, 10) },
              { school_id: school.id, name: 'Term 3', start_date: new Date(currentYear + 1, 4, 1), end_date: new Date(currentYear + 1, 6, 31) },
            ]
          }
        }
      });
      console.log('📅 Academic Year & Terms generated');
  }

  // 5. Create Grade Levels and Classes
  const grades = [
    { name: 'Grade 10', level: 10 },
    { name: 'Grade 11', level: 11 },
  ];

  for (const g of grades) {
    let grade = await prisma.gradeLevel.findFirst({ where: { school_id: school.id, name: g.name } });
    if (!grade) {
        grade = await prisma.gradeLevel.create({ data: { school_id: school.id, ...g } });
        await prisma.class.create({ data: { school_id: school.id, grade_id: grade.id, name: `${g.level}-A` } });
    }
  }
  console.log('🎓 Classes generated');

  // 6. Create Roles: Teacher, Nurse, Librarian, Security, Driver, Subordinate, Accountant
  const rolesToCreate = [
    { email: 'teacher@schoolos.com', role: Role.TEACHER, first: 'Sarah', last: 'Connor', designation: 'Mathematics Teacher' },
    { email: 'nurse@schoolos.com', role: Role.NURSE, first: 'Florence', last: 'Nightingale', designation: 'School Nurse' },
    { email: 'librarian@schoolos.com', role: Role.LIBRARIAN, first: 'Dewey', last: 'Decimal', designation: 'Head Librarian' },
    { email: 'security@schoolos.com', role: Role.SECURITY, first: 'John', last: 'McClane', designation: 'Chief Security Officer' },
    { email: 'driver@schoolos.com', role: Role.DRIVER, first: 'Frank', last: 'Martin', designation: 'Transport Fleet Manager' },
    { email: 'staff@schoolos.com', role: Role.SUBORDINATE, first: 'Bob', last: 'Builder', designation: 'Maintenance Lead' },
    { email: 'accountant@schoolos.com', role: Role.ACCOUNTANT, first: 'Oscar', last: 'Martinez', designation: 'Chief Accountant' },
  ];

  for (const r of rolesToCreate) {
    const existingUser = await prisma.user.findUnique({ where: { email: r.email } });
    if (!existingUser) {
        const user = await prisma.user.create({
            data: {
              email: r.email,
              password: passwordHash,
              first_name: r.first,
              last_name: r.last,
              role: r.role,
              school_id: school.id,
              password_changed: true,
            }
          });
      
          await prisma.staff.create({
            data: {
              user_id: user.id,
              school_id: school.id,
              designation: r.designation,
              department: 'Operations',
              base_salary: 50000,
              id_number: `EMP-${Math.floor(Math.random() * 10000)}`
            }
          });
          console.log(`👤 Role generated: ${r.role} (${r.email})`);
    }
  }

  // 7. Create Parent & Student
  const studentEmail = 'student@schoolos.com';
  const existingStudent = await prisma.user.findUnique({ where: { email: studentEmail } });
  
  if (!existingStudent) {
    const parentUser = await prisma.user.create({
        data: {
          email: 'parent@schoolos.com',
          password: passwordHash,
          first_name: 'Ned',
          last_name: 'Stark',
          role: Role.PARENT,
          school_id: school.id,
          password_changed: true,
        }
      });
    
      const parent = await prisma.parent.create({
        data: {
          user_id: parentUser.id,
          school_id: school.id,
        }
      });
    
      const studentUser = await prisma.user.create({
        data: {
          email: studentEmail,
          password: passwordHash,
          first_name: 'Arya',
          last_name: 'Stark',
          role: Role.STUDENT,
          school_id: school.id,
          password_changed: true,
        }
      });
    
      const class11A = await prisma.class.findFirst({ where: { name: '11-A', school_id: school.id } });

      await prisma.student.create({
        data: {
          user_id: studentUser.id,
          school_id: school.id,
          parent_id: parent.id,
          class_id: class11A?.id,
          admission_no: 'ADM-2024-001',
          gender: 'FEMALE',
          dob: new Date('2008-05-15')
        }
      });
      console.log(`👨‍🎓 Student & Parent generated (student@schoolos.com / parent@schoolos.com)`);
  }

  console.log('✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
