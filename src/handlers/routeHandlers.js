import { getSightings, addSighting } from "../data/sightingsStore.js";
import { parseJsonBody } from "../utils/parseJsonBody.js";
import { sendResponse } from "../utils/sendResponse.js";
import { sanitizeInput } from "../utils/sanitizeInput.js";
import { sightingEvents } from "../events/sightingEvents.js";


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
