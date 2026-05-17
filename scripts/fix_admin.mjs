import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const pool = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'tiffy_db' });

const [tables] = await pool.query("SHOW TABLES LIKE 'admins'");
console.log('admins table exists:', tables.length > 0);

if (tables.length > 0) {
  const [admins] = await pool.query('SELECT id, username FROM admins');
  console.log('Admins in DB:', admins);
  if (admins.length === 0) {
    const hash = await bcrypt.hash('tiffy123', 10);
    await pool.query('INSERT INTO admins (username, password) VALUES (?, ?)', ['tiffyadmin', hash]);
    console.log('Admin tiffyadmin created!');
  } else {
    // Reset password just in case
    const hash = await bcrypt.hash('tiffy123', 10);
    await pool.query('UPDATE admins SET password = ? WHERE username = ?', [hash, 'tiffyadmin']);
    console.log('Password reset to tiffy123 for tiffyadmin');
  }
} else {
  await pool.query(`CREATE TABLE IF NOT EXISTS admins (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS admin_logs (id INT AUTO_INCREMENT PRIMARY KEY, admin_username VARCHAR(255) NOT NULL, action_type VARCHAR(100) NOT NULL, description TEXT, reason TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
  const hash = await bcrypt.hash('tiffy123', 10);
  await pool.query('INSERT INTO admins (username, password) VALUES (?, ?)', ['tiffyadmin', hash]);
  console.log('Tables created and tiffyadmin added!');
}

pool.end();
console.log('Done - try logging in with tiffyadmin / tiffy123');
