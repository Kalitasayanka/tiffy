import mysql from 'mysql2/promise';

async function setupAdminDB() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'tiffy_db'
    });

    console.log('Connected to MySQL server.');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS page_visits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        visit_date DATE NOT NULL,
        visit_count INT DEFAULT 1,
        UNIQUE KEY unique_date (visit_date)
      )
    `);
    console.log('Table `page_visits` created.');

    // Seed some mock analytics data for the past 7 days so the chart looks good immediately
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const randomVisits = Math.floor(Math.random() * 50) + 10; // Between 10 and 60 visits

      try {
        await connection.query(
          'INSERT INTO page_visits (visit_date, visit_count) VALUES (?, ?)',
          [dateString, randomVisits]
        );
      } catch (e) {
        // Ignore duplicate errors if already seeded
      }
    }
    console.log('Mock analytics data seeded.');

    console.log('Admin DB setup complete!');
    await connection.end();
  } catch (error) {
    console.error('Error setting up admin db:', error);
  }
}

setupAdminDB();
