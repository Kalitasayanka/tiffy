import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tiffy_db'
});

await connection.query('TRUNCATE TABLE user_activity_logs');
console.log('Traffic data wiped successfully!');
await connection.end();
