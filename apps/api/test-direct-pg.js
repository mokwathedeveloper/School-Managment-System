const { Client } = require('pg');

async function testDirectConnection() {
  const configs = [
    {
      name: 'Pooled (postgres username)',
      connectionString: 'postgresql://postgres:Johnosiemo@1@aws-0-eu-west-1.pooler.supabase.com:6543/postgres'
    },
    {
      name: 'Direct (postgres.PROJECT_REF username)',
      connectionString: 'postgresql://postgres.ehnrbqooskikkclbropi:Johnosiemo@1@db.ehnrbqooskikkclbropi.supabase.co:5432/postgres'
    }
  ];

  for (const config of configs) {
    console.log(`\n🔄 Testing: ${config.name}`);
    console.log('='.repeat(50));
    
    const client = new Client({ connectionString: config.connectionString });
    
    try {
      await client.connect();
      console.log('✅ Connected successfully!');
      
      const result = await client.query('SELECT version(), current_database(), current_user');
      console.log('📊 Database info:', result.rows[0]);
      
      await client.end();
    } catch (error) {
      console.log('❌ Connection failed:', error.message);
    }
  }
}

testDirectConnection();
