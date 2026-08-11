import { useEffect, useState } from "react"
import { fetchSightings } from "../api.js"
import SightingMap from "../components/SightingMap.jsx"

export default function MapPage() {
    const [sightings, setSightings] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSightings({ sort: "newest", limit: 50 })
            .then((data) => setSightings(data.sightings))
            .finally(() => setLoading(false))
    }, [])

    return (
        <main className="page">
            <h1 className="page-title">Sighting Mappp</h1>
            <p className="map-note">
                Locations are geocoded automatically from each report's location fielddd.
            </p>
            {loading ? (
                <p className="empty-state">Loading mappp...</p>
            ) : (
                <SightingMap sightings={sightings} />
            )}
        </main>
    )
}
