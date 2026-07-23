import http from 'node:http'
import path from 'node:path'
import { serveStatic } from "./utils/serveStatic.js"

const PORT = 6969
const rootDir = path.join(import.meta.dirname, '..')

let Server = http.createServer(async(req,res)=>{
    await serveStatic(req,res,rootDir)
})

Server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})
