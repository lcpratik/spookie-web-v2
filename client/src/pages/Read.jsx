import { useCallback, useEffect, useState } from "react"
import { fetchSightings, fetchLocations } from "../api.js"
import { useAuth } from "../context/AuthContext.jsx"
import SightingCard from "../components/SightingCard.jsx"
import LoadingSkeleton from "../components/LoadingSkeleton.jsx"
import SightingMap from "../components/SightingMap.jsx"

const LIMIT = 9

export default function Read() {
    const { userIdentifier } = useAuth()
    const [searchInput, setSearchInput] = useState("")
    const [search, setSearch] = useState("")
    const [location, setLocation] = useState("")
    const [sort, setSort] = useState("newest")
    const [page, setPage] = useState(1)
    const [view, setView] = useState("list")

    const [locations, setLocations] = useState([])
    const [sightings, setSightings] = useState([])
    const [total, setTotal] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        fetchLocations().then(setLocations).catch(() => {})
    }, [])

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearch(searchInput)
            setPage(1)
        }, 350)
        return () => clearTimeout(timeout)
    }, [searchInput])

    useEffect(() => {
        let cancelled = false
        setLoading(true)
        setError("")
        fetchSightings({ search, location, sort, page, limit: LIMIT, viewer: userIdentifier })
            .then((data) => {
                if (cancelled) return
                setSightings(data.sightings)
                setTotal(data.total)
                setTotalPages(data.totalPages)
            })
            .catch((err) => !cancelled && setError(err.message))
            .finally(() => !cancelled && setLoading(false))
        return () => { cancelled = true }
    }, [search, location, sort, page, userIdentifier])

    const handleUpvoteChange = useCallback((uuid, result) => {
        setSightings((prev) => prev.map((s) => (
            s.uuid === uuid ? { ...s, upvoted: result.upvoted, upvote_count: result.upvote_count } : s
        )))
    }, [])

    return (
        <main className="sightings">
            <h1 className="page-title">Sightings</h1>

            <div className="feed-controls">
                <input
                    type="text"
                    placeholder="Search sightings..."
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    aria-label="Search sightings"
                />
                <select value={location} onChange={(event) => { setLocation(event.target.value); setPage(1) }} aria-label="Filter by location">
                    <option value="">All locations</option>
                    {locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                </select>
                <select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1) }} aria-label="Sort sightings">
                    <option value="newest">Newest</option>
                    <option value="corroborated">Most corroborated</option>
                    <option value="discussed">Most discussed</option>
                </select>
                <div className="view-toggle">
                    <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>List</button>
                    <button className={view === "map" ? "active" : ""} onClick={() => setView("map")}>Map</button>
                </div>
            </div>

            {loading && <LoadingSkeleton count={LIMIT} />}

            {!loading && error && <p className="empty-state">{error}</p>}

            {!loading && !error && sightings.length === 0 && (
                <p className="empty-state">No sightings match your search. Try different keywords.</p>
            )}

            {!loading && !error && sightings.length > 0 && view === "list" && (
                <div className="cards-container">
                    {sightings.map((sighting) => (
                        <SightingCard key={sighting.uuid} sighting={sighting} onUpvoteChange={handleUpvoteChange} />
                    ))}
                </div>
            )}

            {!loading && !error && sightings.length > 0 && view === "map" && (
                <SightingMap sightings={sightings} />
            )}

            {!loading && !error && total > 0 && (
                <div className="pagination">
                    <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
                    <span>Page {page} of {totalPages}</span>
                    <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
                </div>
            )}
        </main>
    )
}
