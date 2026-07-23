import path from "node:path";
import fs from "node:fs/promises";
import { sendResponse } from "./sendResponse.js";
import { getContentType } from "./contentType.js";

export async function serveStatic(req, res, basedir) {
  const publicPath = path.join(basedir, "public");

  const pathForResource = path.join(
    publicPath,
    req.url === "/" ? "index.html" : req.url
  );

  const ext = path.extname(pathForResource);
  const contentType = getContentType(ext);

  try {
    const content = await fs.readFile(pathForResource);
    sendResponse(res, 200, contentType, content);
  } catch (err) {
    if(err.code ==='ENOENT')
    {
        const content = await fs.readFile(path.join(publicPath, "404.html"));
        sendResponse(res, 404, "text/html", content);
    }else{
        sendResponse(res, 500, "text/html", "<html><h1>Error</h1><html>");
    }
  }
}
