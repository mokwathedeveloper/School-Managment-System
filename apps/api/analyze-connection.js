require('dotenv').config({ path: '../../.env' });

console.log('🔍 Current Connection String Analysis\n');

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.log('❌ DATABASE_URL not found');
  process.exit(1);
}

// Parse the connection string
const urlPattern = /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
const match = dbUrl.match(urlPattern);

if (match) {
  const [, username, password, host, port, database] = match;
  
  console.log('📊 Parsed Connection Details:');
  console.log('  Username:', username);
  console.log('  Password:', password.substring(0, 3) + '***');
  console.log('  Host:', host);
  console.log('  Port:', port);
  console.log('  Database:', database.split('?')[0]);
  console.log('');
  
  console.log('⚠️  Issue Detected:');
  console.log('  The username format "postgres.PROJECT_REF" is incorrect for pooler.');
  console.log('  It should be just "postgres" for the pooled connection.');
  console.log('');
  console.log('✅ Suggested Fix:');
  console.log('  Go to Supabase Dashboard → Database Settings');
  console.log('  Copy the Transaction mode connection string');
  console.log('  It should look like:');
  console.log('  postgresql://postgres:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres');
  console.log('');
  console.log('📝 Or run: ./fix-connection.sh');
} else {
  console.log('❌ Could not parse connection string');
}
