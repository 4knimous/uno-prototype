const fs = require('fs');
const path = require('path');

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8", 
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
};

module.exports = (req, res) => {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  
  // Retirer les paramètres de query (?v=123)
  filePath = filePath.split('?')[0];
  
  // Essayer d'abord dans public/
  let fullPath = path.join(__dirname, '../public', filePath);
  
  // Si pas trouvé et que c'est un .js, essayer dans src/
  if (!fs.existsSync(fullPath) && filePath.endsWith('.js')) {
    fullPath = path.join(__dirname, '../src', filePath.replace('/js/', '/'));
  }
  
  if (!fs.existsSync(fullPath)) {
    res.status(404).end('File not found');
    return;
  }
  
  const ext = path.extname(fullPath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';
  
  res.setHeader('Content-Type', contentType);
  res.end(fs.readFileSync(fullPath));
};