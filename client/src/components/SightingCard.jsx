import { useState } from "react"
import { Link } from "react-router-dom"
import UpvoteButton from "./UpvoteButton.jsx"

function formatDate(value) {
    if (!value) return null
    return new Date(value).toLocaleString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    })
}

export default function SightingCard({ sighting, onUpvoteChange }) {
    const [expanded, setExpanded] = useState(false)
    const displayDate = formatDate(sighting.occurred_at) || formatDate(sighting.created_at)

    return (
        <article className={`sighting-card${expanded ? " expanded" : ""}`}>
            {sighting.photo_url && (
                <img className="card-photo" src={sighting.photo_url} alt="" />
            )}
            <p className="card-details">{sighting.location} &middot; {displayDate}</p>
            <h3><Link to={`/sightings/${sighting.uuid}`}>{sighting.title}</Link></h3>
            <div className="sighting-text-wrapper">
                <p className="sighting-text">{sighting.body}</p>
            </div>
            <button className="read-more-btn" onClick={() => setExpanded((v) => !v)}>
                {expanded ? "Show less" : "Read in full"}
            </button>
            <div className="card-footer">
                <UpvoteButton
                    uuid={sighting.uuid}
                    upvoted={sighting.upvoted}
                    upvoteCount={sighting.upvote_count}
                    onChange={(result) => onUpvoteChange?.(sighting.uuid, result)}
                />
                <span className="comment-count">💬 {sighting.comment_count} comments</span>
            </div>
        </article>
    )
}
