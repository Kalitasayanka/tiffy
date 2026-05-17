import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
  '../src/pages/Landing.jsx',
  '../src/pages/Admin.jsx',
  '../src/components/ParticleCTA.jsx',
  '../src/components/Features.jsx',
  '../src/components/FAQ.jsx',
  '../src/components/AuthModal.jsx'
];

files.forEach(f => {
  const filePath = path.join(__dirname, f);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Add const API_URL at the top after imports if not exists
  if (!content.includes('const API_URL =')) {
    const importMatch = content.match(/^import .*?;\n/gm);
    if (importMatch) {
      const lastImport = importMatch[importMatch.length - 1];
      content = content.replace(lastImport, lastImport + "\nconst API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';\n");
    }
  }

  // Replace 'http://localhost:5000/...' with `${API_URL}/...`
  content = content.replace(/'http:\/\/localhost:5000([^']*)'/g, '`${API_URL}$1`');
  
  // Replace `http://localhost:5000/...` with `${API_URL}/...`
  content = content.replace(/`http:\/\/localhost:5000([^`]*)`/g, '`${API_URL}$1`');

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${f}`);
});
