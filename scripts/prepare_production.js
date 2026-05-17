import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

async function prepareDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'tiffy_db'
    });

    console.log('Connected to MySQL server. Clearing data...');

    // Clear tables
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE users');
    await connection.query('TRUNCATE TABLE contacts');
    await connection.query('TRUNCATE TABLE admin_logs');
    await connection.query('TRUNCATE TABLE user_activity_logs');
    await connection.query('TRUNCATE TABLE admins');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Successfully cleared user, contact, and log data.');

    // Create new admin
    const adminUsername = 'sayanka';
    const adminPassword = 'Sayanka@2006';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await connection.query(
      'INSERT INTO admins (username, password) VALUES (?, ?)',
      [adminUsername, hashedPassword]
    );

    console.log(`Successfully created production admin account: ${adminUsername}`);
    
    await connection.end();
    console.log('Database preparation complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error preparing database:', error);
    process.exit(1);
  }
}

prepareDatabase();
