
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Create a school
  const school = await prisma.school.create({
    data: {
      name: 'Greenwood Academy',
      slug: 'greenwood',
      email: 'info@greenwood.com',
      phone: '+254700000000',
    }
  });
  console.log('School created:', school.name);

  // 2. Update the admin user to link to this school
  const user = await prisma.user.update({
    where: { email: 'admin@school.com' },
    data: {
      school_id: school.id
    }
  });
  console.log('User updated and linked to school:', user.email);

  // 3. Create a term and academic year for stats to work
  const ay = await prisma.academicYear.create({
    data: {
      school_id: school.id,
      name: '2024',
      start_date: new Date('2024-01-01'),
      end_date: new Date('2024-12-31'),
      is_active: true
    }
  });

  const term = await prisma.term.create({
    data: {
      school_id: school.id,
      academic_year_id: ay.id,
      name: 'Term 1',
      start_date: new Date('2024-01-01'),
      end_date: new Date('2024-04-30'),
      is_active: true
    }
  });

  // 4. Create a grade level
  const grade = await prisma.gradeLevel.create({
    data: {
      school_id: school.id,
      name: 'Grade 1',
      level: 1
    }
  });

  // 5. Create a class
  await prisma.class.create({
    data: {
      school_id: school.id,
      grade_id: grade.id,
      name: 'East',
      term_id: term.id
    }
  });

  console.log('Basic school structure created.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
