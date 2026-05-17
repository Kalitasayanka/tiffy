import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const createAdmin = async () => {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node create_admin.js <username> <password>');
    process.exit(1);
  }

  const username = args[0];
  const password = args[1];

  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tiffy_db',
  });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO admins (username, password) VALUES (?, ?)', [username, hashedPassword]);
    console.log(`Admin user '${username}' created successfully!`);
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    pool.end();
  }
};

createAdmin();
