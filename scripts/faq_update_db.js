import mysql from 'mysql2/promise';

const newFaqs = [
  { category: 'Features', question: 'Does Tiffy track my driver routes?', answer: 'Yes, Tiffy features built-in route optimization that provides your drivers with the most efficient delivery paths.' },
  { category: 'Features', question: 'Can I manage multiple kitchens?', answer: 'Absolutely! Tiffy Enterprise allows you to manage multiple kitchen locations from a centralized dashboard.' },
  { category: 'Features', question: 'Does it integrate with WhatsApp?', answer: 'Yes, Tiffy automatically sends delivery updates and subscription reminders to your customers via WhatsApp.' },
  { category: 'Pricing', question: 'How much does Tiffy cost?', answer: 'We offer flexible pricing starting at $49/month for small startups, scaling up based on your active subscription volume.' },
  { category: 'Pricing', question: 'Is there a free trial?', answer: 'Yes! We offer a 14-day fully-featured free trial so you can test all the premium features with zero commitment.' },
  { category: 'Pricing', question: 'Are there setup fees?', answer: 'No, there are zero setup or hidden fees. You only pay your flat monthly subscription.' }
];

async function updateFaqDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'tiffy_db'
    });

    console.log('Connected to MySQL server.');

    try {
      await connection.query('ALTER TABLE faqs ADD COLUMN category VARCHAR(50) DEFAULT "General"');
      console.log('Added category column to faqs.');
    } catch (e) { 
      console.log('Category column might already exist.'); 
    }
    
    // Clear out any old test data for Pricing/Features just in case
    await connection.query('DELETE FROM faqs WHERE category IN ("Features", "Pricing")');

    // Seed new Data
    for (const faq of newFaqs) {
      await connection.query('INSERT INTO faqs (question, answer, category) VALUES (?, ?, ?)', [faq.question, faq.answer, faq.category]);
    }
    console.log('Inserted new FAQ categories.');

    console.log('FAQ Database update complete!');
    await connection.end();
  } catch (error) {
    console.error('Error updating FAQ database:', error);
  }
}

updateFaqDatabase();
