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
  
  content = content.replace(
    'const API_URL = import.meta.env.VITE_API_URL || `${API_URL}`;',
    "const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';"
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed ${f}`);
});
