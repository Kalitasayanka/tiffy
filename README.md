# Tiffy - Tiffin Management Software

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

### 2. Database Setup
1. Open your MySQL client (like phpMyAdmin or MySQL Workbench).
2. Create a database named `tiffy_db`.
3. In your terminal, navigate to the `scripts/` folder and run the migration scripts to build the tables:
   ```bash
   node scripts/setup_db.js
   node scripts/create_admin_tables.js
   # Run other _db.js files if needed
   ```

### 3. Start the Application
To run the full application locally, you need to start both the frontend and the backend.

**Start the Backend Server (Port 5000):**
```bash
npm run start-server
```

**Start the React Frontend (Port 5173):**
```bash
npm run dev
```

Alternatively, if you are on Windows, you can just double-click `launch-tiffy.bat`.

---

## 🔐 Production Admin Credentials
The database has been pre-configured with a production admin account. You can log into the `/admin` dashboard using:

- **Username:** `sayanka`
- **Password:** `Sayanka@2006`

---

## 🚀 Deploying Frontend to GitHub Pages

If you want to deploy just the visual frontend to GitHub Pages:
1. Ensure your `package.json` has the `"homepage": "https://<your-username>.github.io/tiffy/"` property set.
2. Ensure `vite.config.js` has `base: '/tiffy/'` set.
3. Run the deploy script:
   ```bash
   npm run deploy
   ```
*(Note: You must have the `gh-pages` package installed and initialized).*
