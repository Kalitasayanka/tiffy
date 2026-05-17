# Tiffy - Tiffin Management Software

> **Disclaimer:** This project is a replica of [tiffy.io](https://tiffy.io) built by **Sayanka** for educational purposes.

Tiffy is an all-in-one platform built specifically for modern meal prep and tiffin delivery businesses. It features a React frontend and an Express/MySQL backend with real-time WebSocket updates.

## ⚠️ Important Deployment Notice for GitHub Pages
GitHub Pages can **only** host the static React frontend. It **cannot** run the Node.js backend (`server.js`) or the MySQL database.
If you host this site on GitHub Pages, visitors will not see any dynamic data (like features, FAQs, or users) unless they are running the backend locally on their own computer, or unless you deploy the backend to a cloud provider (like Render or Heroku) and link it.

### How to Connect Frontend to a Cloud Backend
Once you host your backend on a service like Render, create a `.env` file in the root of this project and add:
```env
VITE_API_URL=https://your-backend-app.onrender.com
```
Then run `npm run build` and deploy the `dist/` folder to GitHub Pages. The React app will automatically use your cloud API instead of `localhost`.

---

## 🛠️ Local Setup Instructions

### 1. Prerequisites
- **Node.js**: Ensure you have Node v18+ installed.
- **MySQL**: Ensure you have a local MySQL server running (e.g., XAMPP, WAMP, or standalone MySQL).

### 2. Clone & Install
```bash
git clone https://github.com/Kalitasayanka/tiffy.git
cd tiffy
npm install
```

### 3. Database Setup
1. Open your MySQL client (like phpMyAdmin or MySQL Workbench).
2. Create a database named `tiffy_db`.
3. Run the migration scripts to build all the tables:
   ```bash
   node scripts/setup_db.js
   node scripts/create_admin_tables.js
   node scripts/cms_upgrade_db.js
   node scripts/crm_upgrade_db.js
   node scripts/upgrade_analytics_db.js
   ```

### 4. Create Your Admin Account
To access the `/admin` dashboard, you need to create an admin account. Open `scripts/prepare_production.js` and change the username and password to your own:

```js
const adminUsername = 'your_username';     // Change this
const adminPassword = 'Your_Password123'; // Change this
```

Then run the script:
```bash
node scripts/prepare_production.js
```

This will hash the password securely with bcrypt and insert your admin into the database.

### 5. Start the Application
You need to start both the frontend and the backend in two separate terminals.

**Terminal 1 — Backend Server (Port 5000):**
```bash
npm run start-server
```

**Terminal 2 — React Frontend (Port 5173):**
```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.
Access the admin dashboard at [http://localhost:5173/#/admin](http://localhost:5173/#/admin).

---

## 🚀 Deploying Frontend to GitHub Pages

If you want to deploy just the visual frontend to GitHub Pages:
1. Ensure your `package.json` has the `"homepage"` property set to your GitHub Pages URL.
2. Ensure `vite.config.js` has `base: '/tiffy/'` set.
3. Run the deploy script:
   ```bash
   npm run deploy
   ```
*(Note: You must have the `gh-pages` package installed — it's already included in devDependencies).*
