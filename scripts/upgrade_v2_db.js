import mysql from 'mysql2/promise';

async function upgradeV2DB() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'tiffy_db'
    });

    console.log('Connected to MySQL server.');

    // Drop old table to avoid confusion
    await connection.query('DROP TABLE IF EXISTS visit_logs');
    console.log('Dropped old visit_logs table.');

    // Create new detailed user_activity_logs table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_activity_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        visit_date DATETIME NOT NULL
      )
    `);
    console.log('Table user_activity_logs created.');

    // Seed mock data: 12 months for 2025 and 2026
    const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const years = [2025, 2026];

    for (const year of years) {
      for (const month of months) {
        if (year === 2026 && month > 4) continue; 
        
        // MAU is between 100 and 300
        const mau = Math.floor(Math.random() * 200) + 100;
        
        // Let's create some returning users vs new users
        // A user ID between 1 and 1000 is a returning user, > 1000 is new for this month
        for (let i = 0; i < mau; i++) {
          const isReturning = Math.random() > 0.4; // 60% retention rate
          const user_id = isReturning ? Math.floor(Math.random() * 50) + 1 : Math.floor(Math.random() * 1000) + 100;
          
          const date = new Date(year, month, Math.floor(Math.random() * 28) + 1);
          await connection.query(
            'INSERT INTO user_activity_logs (user_id, visit_date) VALUES (?, ?)',
            [user_id, date]
          );
        }
      }
    }
    console.log('Mock MAU data seeded for 2025 and 2026.');

    console.log('Enterprise Analytics DB upgrade complete!');
    await connection.end();
  } catch (error) {
    console.error('Error upgrading analytics db:', error);
  }
}

upgradeV2DB();
