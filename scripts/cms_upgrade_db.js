import mysql from 'mysql2/promise';

async function upgradeCMSDB() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'tiffy_db'
    });

    console.log('Connected to MySQL server.');

    // Create settings table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        key_name VARCHAR(100) UNIQUE NOT NULL,
        key_value TEXT NOT NULL,
        category VARCHAR(50) DEFAULT 'general'
      )
    `);
    console.log('Table settings created.');

    // Seed default social links if they don't exist
    const defaultSettings = [
      ['social_facebook', 'https://facebook.com/tiffy_official', 'social'],
      ['social_twitter', 'https://twitter.com/tiffy_app', 'social'],
      ['social_instagram', 'https://instagram.com/tiffy_love', 'social']
    ];

    for (const [key, val, cat] of defaultSettings) {
      await connection.query(
        'INSERT IGNORE INTO settings (key_name, key_value, category) VALUES (?, ?, ?)',
        [key, val, cat]
      );
    }
    console.log('Settings seeded successfully.');

    await connection.end();
  } catch (error) {
    console.error('Error upgrading CMS db:', error);
  }
}

upgradeCMSDB();
