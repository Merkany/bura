import http from "node:http"
import { readFile, stat } from "node:fs/promises"
import path from "node:path"
const root = path.resolve("public")
const types = { ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".json":"application/json; charset=utf-8", ".webp":"image/webp", ".png":"image/png", ".jpg":"image/jpeg", ".mp4":"video/mp4", ".xml":"application/xml; charset=utf-8" }
http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", "http://127.0.0.1")
    let relative = decodeURIComponent(url.pathname).replace(/^\/+/, "")
    if (!relative || relative.endsWith("/")) relative += "index.html"
    let file = path.resolve(root, relative)
    if (!path.extname(file)) {
      try { if ((await stat(file)).isDirectory()) file = path.join(file, "index.html") }
      catch { file += ".html" }
    }
    if (!file.startsWith(root)) throw new Error("Geçersiz yol")
    const contents = await readFile(file)
    response.writeHead(200, { "Content-Type": types[path.extname(file)] ?? "application/octet-stream" })
    response.end(contents)
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" })
    response.end("Bulunamadı")
  }
}).listen(8091, "127.0.0.1")

