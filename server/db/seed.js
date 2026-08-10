import path from "node:path"
import fs from "node:fs/promises"
import { pool } from "./pool.js"

const dataPath = path.join(import.meta.dirname, "..", "..", "src", "data", "data.json")

function parseOccurredAt(raw) {
    if (!raw) return null
    const cleaned = raw.replace(" at ", " ")
    const date = new Date(cleaned)
    return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

async function seed() {
    const raw = await fs.readFile(dataPath, "utf8")
    const sightings = JSON.parse(raw)

    const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM sightings")
    if (rows[0].count > 0) {
        console.log(`sightings table already has ${rows[0].count} rows, skipping seed.`)
        await pool.end()
        return
    }

    for (const sighting of sightings) {
        const title = sighting.title || "Untitled sighting"
        const body = sighting.text || sighting.body || ""
        const location = sighting.location || "Unknown"
        const occurredAt = parseOccurredAt(sighting.timestamp || sighting.timeStamp)

        await pool.query(
            `INSERT INTO sightings (title, body, location, occurred_at)
             VALUES ($1, $2, $3, $4)`,
            [title, body, location, occurredAt]
        )
    }

    console.log(`Seeded ${sightings.length} sightings.`)
    await pool.end()
}

seed().catch((err) => {
    console.error("Seed failed:", err)
    process.exit(1)
})
