import mysql from 'mysql2/promise';

const faqs = [
  { question: 'What is tiffin management software?', answer: 'Tiffin management software is a digital solution designed to help tiffin service providers manage their daily operations. This includes tracking customer subscriptions, planning menus, and managing deliveries.' },
  { question: 'What is Tiffy?', answer: "Tiffy is an all-in-one platform built specifically for modern meal prep and tiffin delivery businesses. It helps you automate your daily operations from the kitchen to the customer's doorstep." },
  { question: 'Is it easy to use?', answer: 'Yes! Tiffy is designed with a very intuitive, modern user interface that anyone can quickly learn and use, whether they are in the kitchen or the back office.' },
  { question: 'Can I customize my meal plans?', answer: 'Absolutely. Tiffy allows you to create highly customizable meal plans to cater to various dietary preferences, allergies, and subscription types.' }
];

const featureCards = [
  { color: 'red', gradient: 'linear-gradient(90deg,#E05252,#FFADAD)', title: 'Meal Plan Customization', desc: 'Easily create and manage diverse meal plans catering to various dietary requirements.' },
  { color: 'purple', gradient: 'linear-gradient(90deg,#6B68D4,#C4C3F7)', title: 'Subscription Tracking', desc: 'Automate subscription renewals and billing, ensuring consistent revenue streams.' },
  { color: 'orange', gradient: 'linear-gradient(90deg,#CC6B2E,#FFBD8A)', title: 'Kitchen Management', desc: 'Optimize kitchen workflows with detailed prep lists and ingredient tracking.' },
];

const deliveryItems = [
  { title: 'Automated Route Planning', desc: 'Generate optimal delivery routes to save time and reduce fuel costs.' },
  { title: 'Driver Management', desc: 'Assign deliveries, track driver progress, and manage fleets efficiently.' },
  { title: 'Real-Time Tracking', desc: 'Keep customers informed with live delivery updates and ETAs.' },
];

async function setupDatabase() {
  try {
    // Connect to MySQL without a specific database to create it first
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
    });

    console.log('Connected to MySQL server.');

    await connection.query('CREATE DATABASE IF NOT EXISTS tiffy_db');
    console.log('Database `tiffy_db` created or already exists.');

    await connection.query('USE tiffy_db');

    // Create tables
    await connection.query(`
      CREATE TABLE IF NOT EXISTS faqs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL
      )
    `);
    console.log('Table `faqs` created.');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS feature_cards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        color VARCHAR(50),
        gradient VARCHAR(255),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL
      )
    `);
    console.log('Table `feature_cards` created.');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS delivery_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL
      )
    `);
    console.log('Table `delivery_items` created.');

    // Clear existing data to prevent duplicates on multiple runs
    await connection.query('TRUNCATE TABLE faqs');
    await connection.query('TRUNCATE TABLE feature_cards');
    await connection.query('TRUNCATE TABLE delivery_items');

    // Seed Data
    for (const faq of faqs) {
      await connection.query('INSERT INTO faqs (question, answer) VALUES (?, ?)', [faq.question, faq.answer]);
    }
    console.log('Inserted FAQs.');

    for (const card of featureCards) {
      await connection.query('INSERT INTO feature_cards (color, gradient, title, description) VALUES (?, ?, ?, ?)', [card.color, card.gradient, card.title, card.desc]);
    }
    console.log('Inserted Feature Cards.');

    for (const item of deliveryItems) {
      await connection.query('INSERT INTO delivery_items (title, description) VALUES (?, ?)', [item.title, item.desc]);
    }
    console.log('Inserted Delivery Items.');

    console.log('Database setup complete!');
    await connection.end();
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

setupDatabase();
