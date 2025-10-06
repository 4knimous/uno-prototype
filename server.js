// Ultra-light static file server (no deps)
// Serves ./public as root and exposes ./src for ES modules

const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT ? Number(process.env.PORT) : 5173;
const root = path.resolve(__dirname);

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

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type });
  res.end(body);
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      send(res, 404, "Not Found");
      return;
    }
    const ext = path.extname(filePath);
    send(res, 200, data, MIME[ext] || "application/octet-stream");
  });
}

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  if (url === "/" || url === "/index.html") {
    return serveFile(res, path.join(root, "public", "index.html"));
  }
  // allow /styles.css and other assets from /public
  if (!url.startsWith("/src/")) {
    const p = path.join(root, "public", url);
    if (fs.existsSync(p) && fs.statSync(p).isFile()) return serveFile(res, p);
  }
  // expose src for module imports
  if (url.startsWith("/src/")) {
    const p = path.join(root, url);
    if (fs.existsSync(p) && fs.statSync(p).isFile()) return serveFile(res, p);
  }
  send(res, 404, "Not Found");
});

server.listen(port, () => {
  console.log(`UNO dev server on http://localhost:${port}`);
});

