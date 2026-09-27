import { Link } from "react-router-dom"

export default function Home() {
    return (
        <main>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2em", padding: "3em 0" }}>
                <h1 className="hero-title">The online home of paranormal sightingsss</h1>
                <div style={{ display: "flex", gap: "1em", flexWrap: "wrap", justifyContent: "center" }}>
                    <Link to="/read" className="auth-trigger">Read sightings</Link>
                    <Link to="/upload" className="auth-trigger">Report a sighting</Link>
                </div>
            </div>
        </main>
    )
}
