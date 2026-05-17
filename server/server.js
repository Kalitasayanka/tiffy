import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import http from 'http';
import { Server } from 'socket.io';
const app = express();
const PORT = 5000;
const JWT_SECRET = 'super-secret-tiffy-key-2026';

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  // console.log('Client connected:', socket.id);
});

// Create connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tiffy_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ─── User Auth Middleware ────────────────────────────────────────────────────
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) { req.user = null; return next(); }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    req.user = err ? null : user;
    next();
  });
};

// ─── Admin Auth Middleware ───────────────────────────────────────────────────
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  jwt.verify(token, JWT_SECRET, (err, admin) => {
    if (err || !admin.isAdmin) return res.status(403).json({ error: 'Forbidden' });
    req.admin = admin;
    next();
  });
};

// ─── Helper: Write Audit Log ─────────────────────────────────────────────────
const writeLog = async (adminUsername, actionType, description, reason = null) => {
  await pool.query(
    'INSERT INTO admin_logs (admin_username, action_type, description, reason) VALUES (?, ?, ?, ?)',
    [adminUsername, actionType, description, reason]
  );
};

// ════════════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ════════════════════════════════════════════════════════════════════

// GET /api/faqs
app.get('/api/faqs', async (req, res) => {
  try {
    const category = req.query.category || 'General';
    const [rows] = await pool.query('SELECT * FROM faqs WHERE category = ?', [category]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/features
app.get('/api/features', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM feature_cards');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching features:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/settings
app.get('/api/settings', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT key_name, key_value FROM settings');
    const settingsObj = {};
    rows.forEach(r => settingsObj[r.key_name] = r.key_value);
    res.json(settingsObj);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/delivery-items
app.get('/api/delivery-items', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM delivery_items');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/signup
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ error: 'Email already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
    const userPayload = { id: result.insertId, name, email };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });
    io.emit('users_updated');
    res.json({ user: userPayload, token });
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = users[0];
    const match = user.password.startsWith('$2b$')
      ? await bcrypt.compare(password, user.password)
      : password === user.password;
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const userPayload = { id: user.id, name: user.name, email: user.email };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: userPayload, token });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/contact
app.post('/api/contact', authenticateToken, async (req, res) => {
  const { name, email, message, business_name, inquiry_type } = req.body;
  try {
    let finalName = name, finalEmail = email, userId = null;
    if (req.user) { finalName = req.user.name; finalEmail = req.user.email; userId = req.user.id; }
    await pool.query(
      'INSERT INTO contacts (name, email, message, user_id, business_name, inquiry_type) VALUES (?, ?, ?, ?, ?, ?)',
      [finalName, finalEmail, message, userId, business_name || null, inquiry_type || null]
    );
    io.emit('contacts_updated');
    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error in contact:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/track-visit
app.post('/api/track-visit', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'User ID required' });
  try {
    const [rows] = await pool.query('SELECT visit_date FROM user_activity_logs WHERE user_id = ? ORDER BY visit_date DESC LIMIT 1', [userId]);
    const now = new Date();
    if (rows.length > 0) {
      const diffInDays = (now - new Date(rows[0].visit_date)) / (1000 * 60 * 60 * 24);
      if (diffInDays < 7) return res.json({ success: true, ignored: true });
    }
    await pool.query('INSERT INTO user_activity_logs (user_id, visit_date) VALUES (?, ?)', [userId, now]);
    res.json({ success: true, recorded: true });
  } catch (error) {
    console.error('Error tracking visit:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ════════════════════════════════════════════════════════════════════
// ADMIN AUTH
// ════════════════════════════════════════════════════════════════════

// POST /api/admin/login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [admins] = await pool.query('SELECT * FROM admins WHERE username = ?', [username]);
    if (admins.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const admin = admins[0];
    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ username: admin.username, isAdmin: true }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ username: admin.username, token });
  } catch (error) {
    console.error('Error in admin login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ════════════════════════════════════════════════════════════════════
// ADMIN PROTECTED ROUTES
// ════════════════════════════════════════════════════════════════════

// GET /api/admin/logs
app.get('/api/admin/logs', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM admin_logs ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/admin/analytics
app.get('/api/admin/analytics', authenticateAdmin, async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const [rows] = await pool.query(`
      SELECT MONTH(visit_date) as monthNum, COUNT(DISTINCT user_id) as visits 
      FROM user_activity_logs WHERE YEAR(visit_date) = ? 
      GROUP BY MONTH(visit_date) ORDER BY monthNum ASC
    `, [year]);
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    res.json(monthNames.map((name, i) => {
      const found = rows.find(r => r.monthNum === i + 1);
      return { date: name, visits: found ? found.visits : 0 };
    }));
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/admin/retention
app.get('/api/admin/retention', authenticateAdmin, async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const [logs] = await pool.query('SELECT user_id, visit_date FROM user_activity_logs');
    const firstVisits = {};
    logs.forEach(log => {
      const d = new Date(log.visit_date);
      if (!firstVisits[log.user_id] || d < firstVisits[log.user_id]) firstVisits[log.user_id] = d;
    });
    const monthlyData = {};
    for (let i = 1; i <= 12; i++) monthlyData[i] = { total: new Set(), returning: new Set() };
    logs.forEach(log => {
      const d = new Date(log.visit_date);
      if (d.getFullYear() === year) {
        const m = d.getMonth() + 1;
        monthlyData[m].total.add(log.user_id);
        if (firstVisits[log.user_id] < new Date(year, m - 1, 1)) monthlyData[m].returning.add(log.user_id);
      }
    });
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    res.json(monthNames.map((name, i) => {
      const data = monthlyData[i + 1];
      const total = data.total.size, returning = data.returning.size;
      return { date: name, newUsers: total - returning, returningUsers: returning };
    }));
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/admin/users
app.get('/api/admin/users', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, status FROM users ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /api/admin/users/:id/ban
app.put('/api/admin/users/:id/ban', authenticateAdmin, async (req, res) => {
  const { status, reason } = req.body;
  try {
    await pool.query('UPDATE users SET status = ? WHERE id = ?', [status, req.params.id]);
    await writeLog(req.admin.username, 'USER_BAN', `Changed user ${req.params.id} status to ${status}`, reason || null);
    io.emit('users_updated');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/admin/users/:id
app.delete('/api/admin/users/:id', authenticateAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    await writeLog(req.admin.username, 'USER_DELETE', `Permanently deleted user ${req.params.id}`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/admin/contacts
app.get('/api/admin/contacts', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, COALESCE(u.name, c.name) AS user_name, COALESCE(u.email, c.email) AS user_email 
      FROM contacts c LEFT JOIN users u ON c.user_id = u.id ORDER BY c.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /api/admin/contacts/:id/status
app.put('/api/admin/contacts/:id/status', authenticateAdmin, async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query('UPDATE contacts SET status = ? WHERE id = ?', [status, req.params.id]);
    await writeLog(req.admin.username, 'QUERY_STATUS', `Marked query ${req.params.id} as ${status}`);
    io.emit('contacts_updated');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/admin/contacts/:id
app.delete('/api/admin/contacts/:id', authenticateAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM contacts WHERE id = ?', [req.params.id]);
    await writeLog(req.admin.username, 'QUERY_DELETE', `Deleted query ${req.params.id}`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /api/admin/settings
app.put('/api/admin/settings', authenticateAdmin, async (req, res) => {
  const settings = req.body;
  try {
    for (const key in settings) {
      await pool.query(
        'INSERT INTO settings (key_name, key_value, category) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE key_value = ?',
        [key, settings[key], 'social', settings[key]]
      );
    }
    await writeLog(req.admin.username, 'CMS_UPDATE', 'Updated site settings / social links');
    io.emit('settings_updated');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/admin/settings/:key
app.delete('/api/admin/settings/:key', authenticateAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM settings WHERE key_name = ?', [req.params.key]);
    await writeLog(req.admin.username, 'CMS_DELETE', `Deleted setting: ${req.params.key}`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/admin/all-faqs
app.get('/api/admin/all-faqs', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM faqs ORDER BY category, id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/admin/faqs
app.post('/api/admin/faqs', authenticateAdmin, async (req, res) => {
  const { question, answer, category } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO faqs (question, answer, category) VALUES (?, ?, ?)',
      [question, answer, category]
    );
    await writeLog(req.admin.username, 'CMS_ADD', `Added new FAQ in category: ${category}`);
    io.emit('faqs_updated');
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /api/admin/faqs/:id
app.put('/api/admin/faqs/:id', authenticateAdmin, async (req, res) => {
  const { question, answer, category } = req.body;
  try {
    await pool.query(
      'UPDATE faqs SET question = ?, answer = ?, category = ? WHERE id = ?',
      [question, answer, category, req.params.id]
    );
    await writeLog(req.admin.username, 'CMS_EDIT', `Edited FAQ ID: ${req.params.id}`);
    io.emit('faqs_updated');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/admin/faqs/:id
app.delete('/api/admin/faqs/:id', authenticateAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM faqs WHERE id = ?', [req.params.id]);
    await writeLog(req.admin.username, 'CMS_DELETE', `Deleted FAQ ID: ${req.params.id}`);
    io.emit('faqs_updated');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/admin/features
app.post('/api/admin/features', authenticateAdmin, async (req, res) => {
  const { title, description, color, gradient } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO feature_cards (title, description, color, gradient) VALUES (?, ?, ?, ?)',
      [title, description, color, gradient || 'linear-gradient(90deg,#6B68D4,#C4C3F7)']
    );
    await writeLog(req.admin.username, 'CMS_ADD', `Added Feature: ${title}`);
    io.emit('features_updated');
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /api/admin/features/:id
app.put('/api/admin/features/:id', authenticateAdmin, async (req, res) => {
  const { title, description, color, gradient } = req.body;
  try {
    await pool.query(
      'UPDATE feature_cards SET title = ?, description = ?, color = ?, gradient = ? WHERE id = ?',
      [title, description, color, gradient, req.params.id]
    );
    await writeLog(req.admin.username, 'CMS_EDIT', `Edited Feature ID: ${req.params.id}`);
    io.emit('features_updated');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/admin/features/:id
app.delete('/api/admin/features/:id', authenticateAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM feature_cards WHERE id = ?', [req.params.id]);
    await writeLog(req.admin.username, 'CMS_DELETE', `Deleted Feature ID: ${req.params.id}`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
