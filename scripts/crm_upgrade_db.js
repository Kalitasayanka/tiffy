import mysql from 'mysql2/promise';

async function upgradeCRM() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'tiffy_db'
    });

    console.log('Connected to MySQL server.');

    // Add status column to users
    try {
      await connection.query("ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'active'");
      console.log('Added status column to users.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log('users.status already exists.');
      else throw e;
    }

    // Add status column to contacts
    try {
      await connection.query("ALTER TABLE contacts ADD COLUMN status VARCHAR(20) DEFAULT 'pending'");
      console.log('Added status column to contacts.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log('contacts.status already exists.');
      else throw e;
    }

    await connection.end();
  } catch (error) {
    console.error('Error upgrading CRM db:', error);
  }
}

upgradeCRM();
