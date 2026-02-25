require('dotenv').config({ path: '../../.env' });
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('🔍 Environment check:');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Found' : '❌ Not found');
  console.log('DIRECT_URL:', process.env.DIRECT_URL ? '✅ Found' : '❌ Not found');
  console.log('');

  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    console.log('🔄 Testing Supabase connection...');
    await prisma.$connect();
    console.log('✅ Successfully connected to Supabase!');
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT current_database(), current_user, version()`;
    console.log('📊 Database info:', result);
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
