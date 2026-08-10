const BASE = "/api"

async function request(path, options = {}) {
    const res = await fetch(`${BASE}${path}`, options)
    const isJson = res.headers.get("content-type")?.includes("application/json")
    const data = isJson ? await res.json() : null

    if (!res.ok) {
        throw new Error(data?.error || `Request failed (${res.status})`)
    }
    return data
}

export function fetchSightings({ search, location, sort, page, limit, viewer } = {}) {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (location) params.set("location", location)
    if (sort) params.set("sort", sort)
    if (page) params.set("page", page)
    if (limit) params.set("limit", limit)
    if (viewer) params.set("viewer", viewer)
    return request(`/sightings?${params.toString()}`)
}

export function fetchSighting(uuid, viewer) {
    const params = viewer ? `?viewer=${encodeURIComponent(viewer)}` : ""
    return request(`/sightings/${uuid}${params}`)
}

export function fetchLocations() {
    return request("/sightings/locations")
}

export function createSighting(formData) {
    return request("/sightings", { method: "POST", body: formData })
}

export function addComment(uuid, { body, author_name }) {
    return request(`/sightings/${uuid}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, author_name }),
    })
}

export function toggleUpvote(uuid, userIdentifier) {
    return request(`/sightings/${uuid}/upvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_identifier: userIdentifier }),
    })
}
