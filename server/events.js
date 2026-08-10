import { EventEmitter } from "node:events"

export const sightingEvents = new EventEmitter()
sightingEvents.setMaxListeners(0)
