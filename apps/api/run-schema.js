require('dotenv').config({ path: '../../.env' });
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function runSQL() {
  const prisma = new PrismaClient();
  const sql = fs.readFileSync('schema.sql', 'utf8');
  const statements = sql.split(';').filter(s => s.trim());
  
  try {
    console.log(`🔄 Executing ${statements.length} SQL statements...`);
    for (const statement of statements) {
      await prisma.$executeRawUnsafe(statement);
    }
    console.log('✅ Database schema created!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

runSQL();
