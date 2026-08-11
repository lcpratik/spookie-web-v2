import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useAlerts } from "../context/AlertsContext.jsx"

function formatTime(value) {
    return new Date(value).toLocaleString("en-GB", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    })
}

export default function Alerts() {
    const { alerts, markAllRead } = useAlerts()

    useEffect(() => {
        markAllRead()
    }, [markAllRead])

    return (
        <main className="page">
            <h1 className="page-title">Live Alerts</h1>
            <p className="live-status"><span className="live-dot" /> Listening for new sightings...</p>

            {alerts.length === 0 ? (
                <p className="empty-state">No alerts yet. New sightings will appear here the moment they're reported.</p>
            ) : (
                <div className="alerts-list">
                    {alerts.map((alert) => (
                        <div className="alert-item" key={alert.id}>
                            <span>
                                New sighting nearrr <strong>{alert.location}</strong>:{" "}
                                <Link to={`/sightings/${alert.uuid}`}>{alert.title}</Link>
                            </span>
                            <span className="alert-time">{formatTime(alert.created_at)}</span>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}
