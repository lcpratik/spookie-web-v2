import { useState } from "react"
import { NavLink, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import { useAlerts } from "../context/AlertsContext.jsx"
import AuthModal from "./AuthModal.jsx"

export default function Header() {
    const { user, logout } = useAuth()
    const { unreadCount } = useAlerts()
    const [showAuth, setShowAuth] = useState(false)
    const [showMenu, setShowMenu] = useState(false)

    return (
        <header>
            <div className="top-header">
                <Link className="logo-link" to="/">
                    <img className="logo-img" src="/images/candle-logo.png" alt="site logo" />
                </Link>
                <nav id="main-navigation">
                    <ul role="list">
                        <li role="listitem"><NavLink to="/" end className={({ isActive }) => isActive ? "current" : ""}>Home</NavLink></li>
                        <li role="listitem"><NavLink to="/read" className={({ isActive }) => isActive ? "current" : ""}>Read</NavLink></li>
                        <li role="listitem"><NavLink to="/map" className={({ isActive }) => isActive ? "current" : ""}>Map</NavLink></li>
                        <li role="listitem"><NavLink to="/upload" className={({ isActive }) => isActive ? "current" : ""}>Upload</NavLink></li>
                        <li role="listitem">
                            <span className="nav-link-wrap">
                                <NavLink to="/alerts" className={({ isActive }) => isActive ? "current" : ""}>Alerts</NavLink>
                                {unreadCount > 0 && <span className="badge">{unreadCount > 9 ? "9+" : unreadCount}</span>}
                            </span>
                        </li>
                    </ul>
                    <div className="auth-area">
                        {user ? (
                            <div className="avatar-menu">
                                <button className="avatar-btn" onClick={() => setShowMenu((v) => !v)} aria-label="Account menu">
                                    {user.name.slice(0, 1).toUpperCase()}
                                </button>
                                {showMenu && (
                                    <div className="avatar-dropdown" onMouseLeave={() => setShowMenu(false)}>
                                        <p>{user.name}</p>
                                        <button onClick={() => { logout(); setShowMenu(false) }}>Sign out</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button className="auth-trigger" onClick={() => setShowAuth(true)}>Sign in</button>
                        )}
                    </div>
                </nav>
            </div>
            <div className="site-header">
                <Link to="/" className="site-title-page">Spookie Web</Link>
            </div>
            {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        </header>
    )
}
