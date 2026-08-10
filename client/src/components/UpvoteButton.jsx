import { useState } from "react"
import { useAuth } from "../context/AuthContext.jsx"
import { toggleUpvote } from "../api.js"

export default function UpvoteButton({ uuid, upvoted, upvoteCount, onChange }) {
    const { userIdentifier } = useAuth()
    const [busy, setBusy] = useState(false)

    async function handleClick() {
        if (busy) return
        setBusy(true)
        try {
            const result = await toggleUpvote(uuid, userIdentifier)
            onChange?.(result)
        } catch (err) {
            console.error(err)
        } finally {
            setBusy(false)
        }
    }

    return (
        <button
            className={`upvote-btn${upvoted ? " upvoted" : ""}`}
            onClick={handleClick}
            disabled={busy}
            aria-pressed={upvoted}
        >
            👻 {upvoteCount}
        </button>
    )
}
