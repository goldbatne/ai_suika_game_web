import { mkdir, readFile, writeFile } from "node:fs/promises";

const indexHtml = await readFile("dist/index.html", "utf8");

const workerSource = `
const INDEX_HTML = ${JSON.stringify(indexHtml)};

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".mp3": "audio/mpeg",
  ".ico": "image/x-icon",
};

function contentType(pathname) {
  const extension = pathname.match(/\\.[^.\\/]+$/)?.[0]?.toLowerCase();
  return MIME_TYPES[extension] ?? "application/octet-stream";
}

async function fetchAsset(env, request, pathname) {
  const assetUrl = new URL(request.url);
  assetUrl.pathname = pathname;
  return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let pathname = decodeURIComponent(url.pathname);

    if (pathname === "/" || pathname === "") {
      pathname = "/index.html";
    }

    let response = await fetchAsset(env, request, pathname);
    if (response.status === 404 && pathname === "/index.html") {
      return new Response(INDEX_HTML, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    if (response.status === 404 && !pathname.includes(".")) {
      response = await fetchAsset(env, request, "/index.html");
      if (response.status === 404) {
        return new Response(INDEX_HTML, {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      }
    }

    if (!response.headers.get("content-type")) {
      const headers = new Headers(response.headers);
      headers.set("content-type", contentType(pathname));
      return new Response(response.body, { status: response.status, headers });
    }

    return response;
  },
};
`.trimStart();

await mkdir("dist/server", { recursive: true });
await writeFile("dist/server/index.js", workerSource);
