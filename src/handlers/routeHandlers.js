import { getSightings, addSighting } from "../data/sightingsStore.js";
import { parseJsonBody } from "../utils/parseJsonBody.js";
import { sendResponse } from "../utils/sendResponse.js";
import { sanitizeInput } from "../utils/sanitizeInput.js";
import { sightingEvents } from "../events/sightingEvents.js";
import { stories } from "../data/stories.js";


export async function handleGet(res) {
    const data = await getSightings()
    const content = JSON.stringify(data)
    sendResponse(res, 200, "application/json", content)
}

export async function handlePost(res,req){

    try{
        const parsedBody = await parseJsonBody(req)
        const sanitizedBody = sanitizeInput(parsedBody)
        await addSighting(sanitizedBody)
        sightingEvents.emit('sighting-added', sanitizedBody)
        sendResponse(res, 201, 'application/json', JSON.stringify(sanitizedBody))

    }catch(err){
        sendResponse(res, 400, 'application/json', JSON.stringify({error: err.message}))

    }
}

export async function handleNews(req,res){

    res.statusCode = 200
    res.setHeader("Content-Type","text/event-stream")
    res.setHeader("Cache-Control","no-cache")
    res.setHeader("Connection","keep-alive")

    setInterval(()=> {
        let randomIndex = Math.floor(Math.random()*stories.length)
        res.write(
            `data: ${JSON.stringify({
                event: 'news-update',
                story: stories[randomIndex]
            })}\n\n`
        )
    }, 3000)
}
