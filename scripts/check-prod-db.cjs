const { Client } = require('pg');

const connectionString = process.env.PROD_DATABASE_URL;

async function checkUsers() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('✅ Connected to production database\n');
    
    const countResult = await client.query('SELECT COUNT(*) FROM "User"');
    const totalUsers = parseInt(countResult.rows[0].count);
    
    console.log(`📊 Total users in database: ${totalUsers}\n`);
    
    if (totalUsers > 0) {
      const result = await client.query(`
        SELECT id, email, name, role, "createdAt" 
        FROM "User" 
        ORDER BY "createdAt" DESC 
        LIMIT 50
      `);
      
      console.log(`✅ Found ${result.rows.length} users:\n`);
      result.rows.forEach((user, i) => {
        console.log(`${i + 1}. ${user.email || 'No email'}`);
        console.log(`   Name: ${user.name || 'N/A'}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Created: ${new Date(user.createdAt).toLocaleString()}`);
        console.log('');
      });
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkUsers();
