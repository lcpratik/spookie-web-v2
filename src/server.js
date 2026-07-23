import http from 'node:http'
import path from 'node:path'
import { serveStatic } from "./utils/serveStatic.js"
import { handleGet, handlePost, handleNews } from './handlers/routeHandlers.js'

const PORT = 6969
const rootDir = path.join(import.meta.dirname, '..')

let Server = http.createServer(async(req,res)=>{

    if(req.url === "/api"){
        if(req.method === "GET"){
            return await handleGet(res)
        }
        else if(req.method === "POST")
        {
            return await handlePost(res,req)
        }
    }

    else if (req.url === "/api/news"){
        return await handleNews(req,res)
    }

    else if(!req.url.startsWith("/api"))
    {
        await serveStatic(req,res,rootDir)
    }
})

Server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})
