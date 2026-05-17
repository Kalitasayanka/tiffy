import http from 'http';

const data = JSON.stringify({ username: 'tiffyadmin', password: 'tiffy123' });
const req = http.request({
  hostname: 'localhost', port: 5000, path: '/api/admin/login', method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
}, (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => { console.log('Status:', res.statusCode); console.log('Body:', body); });
});
req.on('error', e => console.error('CONNECTION ERROR:', e.message, '\n>>> Backend server is NOT running on port 5000!'));
req.write(data);
req.end();
