import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create a School
  const school = await prisma.school.upsert({
    where: { slug: 'nairobi-academy' },
    update: {},
    create: {
      name: 'Nairobi International Academy',
      slug: 'nairobi-academy',
      email: 'admin@nairobiacademy.com',
      address: '123 Karen Road, Nairobi',
      phone: '+254700000000',
      mpesa_paybill: '123456',
    },
  });

  console.log(`🏫 Created School: ${school.name}`);

  // 2. Create Academic Year & Term
  const year2024 = await prisma.academicYear.create({
    data: {
      school_id: school.id,
      name: '2024',
      start_date: new Date('2024-01-01'),
      end_date: new Date('2024-12-31'),
      is_active: true,
    },
  });

  const term1 = await prisma.term.create({
    data: {
      school_id: school.id,
      academic_year_id: year2024.id,
      name: 'Term 1 2024',
      start_date: new Date('2024-01-01'),
      end_date: new Date('2024-04-30'),
      is_active: true,
    },
  });

  console.log(`📅 Created Academic Year ${year2024.name} and ${term1.name}`);

  // 3. Create Grade Level & Class
  const grade1Level = await prisma.gradeLevel.create({
    data: {
      school_id: school.id,
      name: 'Grade 1',
      level: 1,
    },
  });

  const class1East = await prisma.class.create({
    data: {
      school_id: school.id,
      grade_id: grade1Level.id,
      name: 'East',
      term_id: term1.id,
    },
  });

  console.log(`📚 Created Grade: ${grade1Level.name} and Stream: ${class1East.name}`);

  // 4. Create Admin User
  const passwordHash = await argon2.hash('password123');
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@school.com' },
    update: {},
    create: {
      email: 'admin@school.com',
      password: passwordHash,
      first_name: 'Super',
      last_name: 'Admin',
      role: 'SCHOOL_ADMIN',
      school_id: school.id,
    },
  });

  console.log(`👤 Created Admin: ${adminUser.email}`);

  // 5. Create Parent & Student
  const parentUser = await prisma.user.create({
    data: {
      email: 'parent@test.com',
      password: passwordHash,
      first_name: 'John',
      last_name: 'Doe',
      role: 'PARENT',
      school_id: school.id,
    },
  });

  const parentProfile = await prisma.parent.create({
    data: {
      user_id: parentUser.id,
      school_id: school.id,
    },
  });

  const studentUser = await prisma.user.create({
    data: {
      email: 'student@test.com',
      password: passwordHash,
      first_name: 'Jane',
      last_name: 'Doe',
      role: 'STUDENT',
      school_id: school.id,
    },
  });

  const studentProfile = await prisma.student.create({
    data: {
      user_id: studentUser.id,
      school_id: school.id,
      admission_no: 'ADM-2024-001',
      class_id: class1East.id,
      parent_id: parentProfile.id,
    },
  });

  console.log(`👨‍👩‍👧 Created Family: Parent ${parentUser.first_name} & Student ${studentUser.first_name}`);

  // 6. Create Fee Structure & Invoices
  const feeStructure = await prisma.feeStructure.create({
    data: {
      school_id: school.id,
      grade_id: grade1Level.id,
      term_id: term1.id,
      total_amount: 50000,
      items: {
        create: [
          { name: 'Tuition Fee', amount: 40000 },
          { name: 'Lunch', amount: 5000 },
          { name: 'Activity Fee', amount: 5000 },
        ]
      }
    }
  });

  const invoice = await prisma.invoice.create({
    data: {
      school_id: school.id,
      student_id: studentProfile.id,
      title: `Fee: ${term1.name}`,
      amount: 50000,
      due_date: term1.end_date,
      status: 'UNPAID',
      items: JSON.stringify([
        { name: 'Tuition Fee', amount: 40000 },
        { name: 'Lunch', amount: 5000 },
        { name: 'Activity Fee', amount: 5000 },
      ]),
    },
  });

  console.log(`💰 Created Fee Structure and Invoice for ${studentUser.first_name}`);

  console.log('✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
