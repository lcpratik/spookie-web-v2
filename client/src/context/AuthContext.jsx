import { createContext, useContext, useEffect, useState, useCallback } from "react"

const AuthContext = createContext(null)

const USER_KEY = "spookieweb_user"
const ANON_KEY = "spookieweb_anon_id"
const KNOWN_USERS_KEY = "spookieweb_known_users"

function readKnownUsers() {
    try {
        return JSON.parse(localStorage.getItem(KNOWN_USERS_KEY)) || {}
    } catch {
        return {}
    }
}

function ensureAnonId() {
    let id = localStorage.getItem(ANON_KEY)
    if (!id) {
        id = crypto.randomUUID()
        localStorage.setItem(ANON_KEY, id)
    }
    return id
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(USER_KEY))
        } catch {
            return null
        }
    })
    const [anonId] = useState(ensureAnonId)

    useEffect(() => {
        if (user) {
            localStorage.setItem(USER_KEY, JSON.stringify(user))
        } else {
            localStorage.removeItem(USER_KEY)
        }
    }, [user])

    const signup = useCallback((name, email) => {
        const knownUsers = readKnownUsers()
        const existing = knownUsers[email.toLowerCase()]
        const account = existing || { id: crypto.randomUUID(), name, email }
        account.name = name
        knownUsers[email.toLowerCase()] = account
        localStorage.setItem(KNOWN_USERS_KEY, JSON.stringify(knownUsers))
        setUser(account)
        return account
    }, [])

    const login = useCallback((email) => {
        const knownUsers = readKnownUsers()
        const account = knownUsers[email.toLowerCase()]
        if (!account) {
            throw new Error("No account found with that email. Try signing up instead.")
        }
        setUser(account)
        return account
    }, [])

    const logout = useCallback(() => setUser(null), [])

    const userIdentifier = user ? user.id : anonId

    return (
        <AuthContext.Provider value={{ user, signup, login, logout, userIdentifier }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used within AuthProvider")
    return ctx
}
