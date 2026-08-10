import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { fetchSighting, addComment } from "../api.js"
import { useAuth } from "../context/AuthContext.jsx"
import UpvoteButton from "../components/UpvoteButton.jsx"

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

export default function SightingDetail() {
    const { uuid } = useParams()
    const { user, userIdentifier } = useAuth()
    const [sighting, setSighting] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [commentBody, setCommentBody] = useState("")
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        let cancelled = false
        setLoading(true)
        fetchSighting(uuid, userIdentifier)
            .then((data) => !cancelled && setSighting(data))
            .catch((err) => !cancelled && setError(err.message))
            .finally(() => !cancelled && setLoading(false))
        return () => { cancelled = true }
    }, [uuid, userIdentifier])

    async function handleCommentSubmit(event) {
        event.preventDefault()
        if (!commentBody.trim()) return
        setSubmitting(true)
        try {
            const comment = await addComment(uuid, {
                body: commentBody.trim(),
                author_name: user?.name,
            })
            setSighting((prev) => ({
                ...prev,
                comments: [...prev.comments, comment],
                comment_count: prev.comment_count + 1,
            }))
            setCommentBody("")
        } catch (err) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return <main className="page"><p className="empty-state">Loading sighting...</p></main>
    }

    if (error && !sighting) {
        return <main className="page"><p className="empty-state">{error}</p></main>
    }

    if (!sighting) return null

    const displayDate = formatDate(sighting.occurred_at) || formatDate(sighting.created_at)

    return (
        <main className="page">
            <div className="detail-card">
                <Link to="/read">&larr; Back to sightings</Link>
                {sighting.photo_url && <img className="detail-photo" src={sighting.photo_url} alt="" />}
                <h1>{sighting.title}</h1>
                <p className="card-details">{sighting.location} &middot; {displayDate}</p>
                <p className="detail-body">{sighting.body}</p>
                <div className="detail-actions">
                    <UpvoteButton
                        uuid={sighting.uuid}
                        upvoted={sighting.upvoted}
                        upvoteCount={sighting.upvote_count}
                        onChange={(result) => setSighting((prev) => ({
                            ...prev, upvoted: result.upvoted, upvote_count: result.upvote_count,
                        }))}
                    />
                    <span className="comment-count">💬 {sighting.comment_count} comments</span>
                </div>

                <section className="comments-section">
                    <h2>Comments</h2>
                    {sighting.comments.length === 0 && <p className="empty-state">No comments yet. Be the first to weigh in.</p>}
                    {sighting.comments.map((comment) => (
                        <div className="comment" key={comment.id}>
                            <span className="comment-author">{comment.author_name}</span>
                            <span className="comment-time">{formatDate(comment.created_at)}</span>
                            <p className="comment-body">{comment.body}</p>
                        </div>
                    ))}

                    <form className="comment-form" onSubmit={handleCommentSubmit}>
                        <label htmlFor="comment-body">
                            {user ? `Commenting as ${user.name}` : "Commenting as Anonymous — sign in to use your name"}
                        </label>
                        <textarea
                            id="comment-body"
                            value={commentBody}
                            onChange={(event) => setCommentBody(event.target.value)}
                            placeholder="Share your thoughts..."
                        />
                        <button type="submit" disabled={submitting || !commentBody.trim()}>
                            {submitting ? "Posting..." : "Post comment"}
                        </button>
                    </form>
                </section>
            </div>
        </main>
    )
}
