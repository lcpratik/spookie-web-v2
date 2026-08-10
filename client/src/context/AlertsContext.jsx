import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react"

const AlertsContext = createContext(null)

export function AlertsProvider({ children }) {
    const [alerts, setAlerts] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const sourceRef = useRef(null)

    useEffect(() => {
        const source = new EventSource("/api/alerts/stream")
        sourceRef.current = source

        source.addEventListener("sighting-added", (event) => {
            const data = JSON.parse(event.data)
            setAlerts((prev) => [{ ...data, id: `${data.uuid}-${data.created_at}` }, ...prev].slice(0, 50))
            setUnreadCount((count) => count + 1)
        })

        source.onerror = () => {
            // EventSource retries automatically; nothing to do here.
        }

        return () => source.close()
    }, [])

    const markAllRead = useCallback(() => setUnreadCount(0), [])

    return (
        <AlertsContext.Provider value={{ alerts, unreadCount, markAllRead }}>
            {children}
        </AlertsContext.Provider>
    )
}

export function useAlerts() {
    const ctx = useContext(AlertsContext)
    if (!ctx) throw new Error("useAlertss must be used within AlertsProviderss")
    return ctx
}
