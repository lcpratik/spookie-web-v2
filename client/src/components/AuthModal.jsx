import { useState } from "react"
import { useAuth } from "../context/AuthContext.jsx"

export default function AuthModal({ onClose }) {
    const { signup, login } = useAuth()
    const [mode, setMode] = useState("signup")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")

    function handleSubmit(event) {
        event.preventDefault()
        setError("")
        try {
            if (mode === "signup") {
                if (!name.trim() || !email.trim()) {
                    setError("Please fill in both fields.")
                    return
                }
                signup(name.trim(), email.trim())
            } else {
                if (!email.trim()) {
                    setError("Please enter your email.")
                    return
                }
                login(email.trim())
            }
            onClose()
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={(event) => event.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Close">&times;</button>
                <h2>{mode === "signup" ? "Join Spookie Web" : "Welcome back"}</h2>
                <div className="auth-tabs">
                    <button
                        className={mode === "signup" ? "active" : ""}
                        onClick={() => { setMode("signup"); setError("") }}
                        type="button"
                    >
                        Sign up
                    </button>
                    <button
                        className={mode === "login" ? "active" : ""}
                        onClick={() => { setMode("login"); setError("") }}
                        type="button"
                    >
                        Log in
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    {mode === "signup" && (
                        <>
                            <label htmlFor="auth-name">Display name</label>
                            <input
                                id="auth-name"
                                type="text"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="Ghost Hunter"
                            />
                        </>
                    )}
                    <label htmlFor="auth-email">Email</label>
                    <input
                        id="auth-email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                    />
                    {error && <p className="form-error">{error}</p>}
                    <button className="modal-submit" type="submit">
                        {mode === "signup" ? "Create account" : "Log in"}
                    </button>
                </form>
            </div>
        </div>
    )
}
