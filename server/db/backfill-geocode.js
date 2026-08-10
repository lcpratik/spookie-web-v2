import { pool } from "./pool.js"
import { geocodeLocation } from "../lib/geocode.js"

async function backfill() {
    const { rows } = await pool.query(
        "SELECT id, location FROM sightings WHERE lat IS NULL OR lng IS NULL"
    )

    if (rows.length === 0) {
        console.log("Nothing to backfill — every sighting already has coordinates.")
        await pool.end()
        return
    }

    for (const sighting of rows) {
        const coords = await geocodeLocation(sighting.location)
        if (!coords) {
            console.log(`Could not geocode "${sighting.location}" (id ${sighting.id})`)
            continue
        }
        await pool.query("UPDATE sightings SET lat = $1, lng = $2 WHERE id = $3", [
            coords.lat, coords.lng, sighting.id,
        ])
        console.log(`Geocoded "${sighting.location}" -> ${coords.lat}, ${coords.lng}`)
    }

    await pool.end()
}

backfill().catch((err) => {
    console.error("Backfill failed:", err)
    process.exit(1)
})
