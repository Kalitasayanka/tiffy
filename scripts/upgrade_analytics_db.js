import mysql from 'mysql2/promise';

async function upgradeAnalyticsDB() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'tiffy_db'
    });

    console.log('Connected to MySQL server.');

    // Drop old table to avoid confusion
    await connection.query('DROP TABLE IF EXISTS page_visits');
    console.log('Dropped old page_visits table.');

    // Create new detailed visit_logs table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS visit_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        device_id VARCHAR(255) NOT NULL,
        visit_date DATETIME NOT NULL
      )
    `);
    console.log('Table visit_logs created.');

    // Seed mock data: 12 months for 2025 and 2026
    const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const years = [2025, 2026];

    for (const year of years) {
      for (const month of months) {
        // Only seed up to current month for 2026
        if (year === 2026 && month > 4) continue; 
        
        const numVisits = Math.floor(Math.random() * 100) + 50;
        for (let i = 0; i < numVisits; i++) {
          const isReturning = Math.random() > 0.7; // 30% chance of returning
          const device_id = isReturning ? `mock-device-${Math.floor(Math.random() * 20)}` : `mock-device-${year}-${month}-${i}`;
          
          const date = new Date(year, month, Math.floor(Math.random() * 28) + 1);
          await connection.query(
            'INSERT INTO visit_logs (device_id, visit_date) VALUES (?, ?)',
            [device_id, date]
          );
        }
      }
    }
    console.log('Mock monthly data seeded for 2025 and 2026.');

    console.log('Analytics DB upgrade complete!');
    await connection.end();
  } catch (error) {
    console.error('Error upgrading analytics db:', error);
  }
}

upgradeAnalyticsDB();
