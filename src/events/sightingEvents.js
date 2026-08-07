import { EventEmitter } from "node:events";
import { createAlert } from "../services/createAlert.js";

export const sightingEvents = new EventEmitter();
sightingEvents.on('sighting-added', createAlert);