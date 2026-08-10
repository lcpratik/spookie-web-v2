import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { Link } from "react-router-dom"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const pinIcon = L.divIcon({
    className: "leaflet-pin-icon",
    html: '<span class="pin-dot"></span>',
    iconSize: [18, 18],
    iconAnchor: [9, 18],
    popupAnchor: [0, -18],
})

function FitBounds({ points }) {
    const map = useMap()
    const key = points.map((p) => p.join(",")).join("|")

    useEffect(() => {
        if (points.length === 0) return
        if (points.length === 1) {
            map.setView(points[0], 8)
        } else {
            map.fitBounds(points, { padding: [40, 40] })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key])
    return null
}

export default function SightingMap({ sightings }) {
    const geocoded = sightings.filter((s) => s.lat != null && s.lng != null)
    const pending = sightings.length - geocoded.length
    const points = geocoded.map((s) => [s.lat, s.lng])

    if (sightings.length === 0) {
        return <p className="empty-state">No sightings to plot yet.</p>
    }

    if (geocoded.length === 0) {
        return <p className="empty-state">Locations are still being geocoded — check back shortly.</p>
    }

    return (
        <div className="map-frame leaflet-frame">
            <MapContainer center={points[0]} zoom={6} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FitBounds points={points} />
                {geocoded.map((sighting) => (
                    <Marker key={sighting.uuid} position={[sighting.lat, sighting.lng]} icon={pinIcon}>
                        <Popup>
                            <strong>{sighting.title}</strong>
                            <br />
                            {sighting.location}
                            <br />
                            <Link to={`/sightings/${sighting.uuid}`}>View sighting &rarr;</Link>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            {pending > 0 && (
                <p className="map-note" style={{ marginTop: ".6em" }}>
                    {pending} sighting{pending > 1 ? "s" : ""} still pending location lookup.
                </p>
            )}
        </div>
    )
}
