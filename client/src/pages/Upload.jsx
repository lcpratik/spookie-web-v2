import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createSighting } from "../api.js"

export default function Upload() {
    const navigate = useNavigate()
    const [title, setTitle] = useState("")
    const [details, setDetails] = useState("")
    const [datetime, setDatetime] = useState("")
    const [location, setLocation] = useState("")
    const [photo, setPhoto] = useState(null)
    const [preview, setPreview] = useState(null)
    const [message, setMessage] = useState("")
    const [submitting, setSubmitting] = useState(false)

    function handlePhotoChange(event) {
        const file = event.target.files?.[0] || null
        setPhoto(file)
        setPreview(file ? URL.createObjectURL(file) : null)
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setMessage("")

        if (!title.trim() || !details.trim() || !location.trim()) {
            setMessage("Please complete all required fields!")
            return
        }

        const formData = new FormData()
        formData.append("title", title.trim())
        formData.append("body", details.trim())
        formData.append("location", location.trim())
        if (datetime) formData.append("occurred_at", new Date(datetime).toISOString())
        if (photo) formData.append("photo", photo)

        setSubmitting(true)
        try {
            const sighting = await createSighting(formData)
            setMessage("Your sighting was uploaded.")
            setTitle("")
            setDetails("")
            setDatetime("")
            setLocation("")
            setPhoto(null)
            setPreview(null)
            setTimeout(() => navigate(`/sightings/${sighting.uuid}`), 600)
        } catch (err) {
            setMessage(err.message || "The server ghosted you. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="form-container" aria-labelledby="form-title">
            <h1 className="form-title" id="form-title">Add Sighting</h1>
            <form className="sighting-form" onSubmit={handleSubmit}>
                <label htmlFor="title">Title:</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="A ghostly encounter"
                />

                <label htmlFor="details">Details:</label>
                <textarea
                    id="details"
                    rows={5}
                    value={details}
                    onChange={(event) => setDetails(event.target.value)}
                    placeholder="I was trying to get to sleep when..."
                />

                <label htmlFor="datetime">Time/Date:</label>
                <input
                    id="datetime"
                    type="datetime-local"
                    value={datetime}
                    onChange={(event) => setDatetime(event.target.value)}
                />

                <label htmlFor="location">Location:</label>
                <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="London, UK"
                />

                <label htmlFor="photo">Photo (optional):</label>
                <input
                    id="photo"
                    className="file-input"
                    type="file"
                    accept="image/png,image/jpeg,image/gif,image/webp"
                    onChange={handlePhotoChange}
                />
                {preview && <img className="photo-preview" src={preview} alt="Photo preview" />}

                <button className="submit-btn" type="submit" disabled={submitting}>
                    {submitting ? "submitting..." : "submit"}
                </button>

                <div className="form-message">
                    <p>{message || "All sightings will be published on our Read page."}</p>
                </div>
            </form>
        </main>
    )
}
