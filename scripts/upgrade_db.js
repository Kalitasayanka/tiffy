import mysql from 'mysql2/promise';

async function upgradeDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'tiffy_db'
    });

    console.log('Connected to MySQL server.');

    try {
      await connection.query('ALTER TABLE contacts ADD COLUMN user_id INT NULL');
      console.log('Added user_id to contacts.');
    } catch (e) { console.log('user_id might already exist.'); }
    
    try {
      await connection.query('ALTER TABLE contacts ADD COLUMN business_name VARCHAR(255) NULL');
      console.log('Added business_name to contacts.');
    } catch (e) { console.log('business_name might already exist.'); }
    
    try {
      await connection.query('ALTER TABLE contacts ADD COLUMN inquiry_type VARCHAR(255) NULL');
      console.log('Added inquiry_type to contacts.');
    } catch (e) { console.log('inquiry_type might already exist.'); }

    // Make name and email nullable just in case
    try {
      await connection.query('ALTER TABLE contacts MODIFY COLUMN name VARCHAR(255) NULL');
      await connection.query('ALTER TABLE contacts MODIFY COLUMN email VARCHAR(255) NULL');
      console.log('Modified name and email to be nullable.');
    } catch (e) { console.log('Could not modify name/email to nullable.', e); }

    console.log('Database upgrade complete!');
    await connection.end();
  } catch (error) {
    console.error('Error upgrading database:', error);
  }
}

upgradeDatabase();
