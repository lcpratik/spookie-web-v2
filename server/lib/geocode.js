const cache = new Map()
let lastRequestAt = 0

async function throttle() {
    const elapsed = Date.now() - lastRequestAt
    const wait = Math.max(0, 1100 - elapsed)
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait))
    lastRequestAt = Date.now()
}

export async function geocodeLocation(location) {
    if (!location) return null
    const key = location.trim().toLowerCase()
    if (cache.has(key)) return cache.get(key)

    try {
        await throttle()
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(location)}`
        const res = await fetch(url, {
            headers: { "User-Agent": "SpookieWeb/1.0 (paranormal sighting community app)" },
            signal: AbortSignal.timeout(8000),
        })
        if (!res.ok) throw new Error(`Geocoding failed with status ${res.status}`)

        const results = await res.json()
        const coords = results[0]
            ? { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) }
            : null

        cache.set(key, coords)
        return coords
    } catch (err) {
        console.error(`Geocoding failed for "${location}":`, err.message)
        return null
    }
}
