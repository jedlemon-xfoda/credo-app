const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(process.env.ROOT || __dirname);
const port = Number(process.env.PORT || 8082);
const host = process.env.HOST || "127.0.0.1";

const mimeTypes = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".json": "application/json",
  ".md": "text/markdown"
};

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url || "/", `http://localhost:${port}`);
  const pathname = decodeURIComponent(requestUrl.pathname);
  const safePath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(root, safePath));

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream"
    });
    response.end(content);
  });
});

server.listen(port, host, () => {
  const displayHost = host === "0.0.0.0" ? "localhost" : host;
  console.log(`The Ordinary Catholic prototype is running at http://${displayHost}:${port}`);
  if (host === "0.0.0.0") {
    console.log("LAN mode is enabled. Open this computer's Wi-Fi IPv4 address on the same port from your phone.");
  }
});
