import { Router } from "express"
import { sightingEvents } from "../events.js"

export const alertsRouter = Router()

alertsRouter.get("/stream", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")
    res.flushHeaders?.()

    const onSighting = (sighting) => {
        res.write(
            `event: sighting-added\ndata: ${JSON.stringify({
                uuid: sighting.uuid,
                title: sighting.title,
                location: sighting.location,
                created_at: sighting.created_at,
            })}\n\n`
        )
    }

    sightingEvents.on("sighting-added", onSighting)

    const heartbeat = setInterval(() => res.write(":heartbeat\n\n"), 25000)

    req.on("close", () => {
        clearInterval(heartbeat)
        sightingEvents.off("sighting-added", onSighting)
    })
})
